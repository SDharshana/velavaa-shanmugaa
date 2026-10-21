import { supabase } from "./supabase";

export const money = (value) =>
  `₹${Number(value || 0).toFixed(2)}`;

export function activeDiscount(discounts, now = Date.now()) {
  return (discounts || [])
    .filter((d) =>
      d.enabled &&
      new Date(d.starts_at).getTime() <= now &&
      new Date(d.ends_at).getTime() > now
    )
    .sort((a, b) => Number(b.discount_value) - Number(a.discount_value))[0] || null;
}

export function discountedPrice(price, discount) {
  const original = Number(price);

  if (!discount) return original;

  const value = Number(discount.discount_value);

  const result =
    discount.discount_type === "percentage"
      ? original * (1 - value / 100)
      : original - value;

  return Math.max(0, Math.round(result * 100) / 100);
}

export async function fetchCatalog() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const [products, variants, discounts] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("id"),

    supabase
      .from("product_variants")
      .select("*")
      .order("id"),

    supabase
      .from("discounts")
      .select("*"),
  ]);

  const error =
    products.error ||
    variants.error ||
    discounts.error;

  if (error) throw error;

  return (products.data || []).map((product) => {
    const discount = activeDiscount(
      (discounts.data || []).filter(
        (d) => d.product_id === product.id
      )
    );

    return {
      ...product,
      image: product.image_url,
      discount,
      variants: (variants.data || [])
        .filter((v) => v.product_id === product.id)
        .map((v) => ({
          ...v,
          originalPrice: Number(v.price),
          price: discountedPrice(v.price, discount),
          stock: Number(v.stock),
        })),
    };
  });
}
