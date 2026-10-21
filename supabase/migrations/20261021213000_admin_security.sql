-- Secure existing Sambrani tables.
-- Does not delete product or inventory records.

BEGIN;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Remove excessive privileges from browser roles.
REVOKE ALL ON TABLE
  public.products,
  public.product_variants,
  public.discounts,
  public.admin_users
FROM anon, authenticated;

GRANT SELECT ON TABLE
  public.products,
  public.product_variants,
  public.discounts
TO anon, authenticated;

GRANT SELECT ON TABLE
  public.admin_users
TO authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE
  public.products,
  public.product_variants,
  public.discounts
TO authenticated;

GRANT USAGE, SELECT ON SEQUENCE
  public.products_id_seq,
  public.product_variants_id_seq,
  public.discounts_id_seq
TO authenticated;

-- Remove old overlapping policies.
DROP POLICY IF EXISTS "Public can view products"
ON public.products;

DROP POLICY IF EXISTS "Public can view product variants"
ON public.product_variants;

DROP POLICY IF EXISTS "Public can view discounts"
ON public.discounts;

DROP POLICY IF EXISTS "Read active products"
ON public.products;

DROP POLICY IF EXISTS "Read variants"
ON public.product_variants;

DROP POLICY IF EXISTS "Read discounts"
ON public.discounts;

DROP POLICY IF EXISTS "Admins manage products"
ON public.products;

DROP POLICY IF EXISTS "Admins manage variants"
ON public.product_variants;

DROP POLICY IF EXISTS "Admins manage discounts"
ON public.discounts;

DROP POLICY IF EXISTS "Admins view own membership"
ON public.admin_users;

-- Admin users can only read their own membership.
CREATE POLICY "Admin membership read"
ON public.admin_users
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Customers see active products.
-- Administrators can also see inactive products.
CREATE POLICY "Product catalogue read"
ON public.products
FOR SELECT TO anon, authenticated
USING (
  active = true
  OR public.is_admin()
);

CREATE POLICY "Product variant read"
ON public.product_variants
FOR SELECT TO anon, authenticated
USING (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.products p
    WHERE p.id = product_variants.product_id
      AND p.active = true
  )
);

-- Public customers see only current discounts.
CREATE POLICY "Discount catalogue read"
ON public.discounts
FOR SELECT TO anon, authenticated
USING (
  public.is_admin()
  OR (
    enabled = true
    AND starts_at <= now()
    AND ends_at > now()
    AND EXISTS (
      SELECT 1
      FROM public.products p
      WHERE p.id = discounts.product_id
        AND p.active = true
    )
  )
);

-- Administrator product permissions.
CREATE POLICY "Admin product insert"
ON public.products
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin product update"
ON public.products
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin product delete"
ON public.products
FOR DELETE TO authenticated
USING (public.is_admin());

-- Administrator variant permissions.
CREATE POLICY "Admin variant insert"
ON public.product_variants
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin variant update"
ON public.product_variants
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin variant delete"
ON public.product_variants
FOR DELETE TO authenticated
USING (public.is_admin());

-- Administrator discount permissions.
CREATE POLICY "Admin discount insert"
ON public.discounts
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin discount update"
ON public.discounts
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin discount delete"
ON public.discounts
FOR DELETE TO authenticated
USING (public.is_admin());

-- Never allow browser accounts to grant admin status.
REVOKE INSERT, UPDATE, DELETE
ON public.admin_users
FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.is_admin()
FROM PUBLIC;

REVOKE ALL ON FUNCTION public.is_admin()
FROM anon;

GRANT EXECUTE ON FUNCTION public.is_admin()
TO authenticated;

COMMIT;
