import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const money = (value) => `₹${Number(value || 0).toFixed(2)}`;

const inputClass =
  "w-full rounded-xl border border-[#d8c9aa] bg-white px-4 py-3 text-sm text-[#211b14] outline-none focus:border-[#a87918]";

const buttonClass =
  "rounded-xl bg-[#211b14] px-5 py-3 text-sm font-semibold text-white hover:bg-[#a87918] disabled:opacity-50";

function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [authorised, setAuthorised] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [tab, setTab] = useState("products");

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    badge: "",
  });

  const [newDiscount, setNewDiscount] = useState({
    product_id: "",
    name: "",
    discount_type: "percentage",
    discount_value: "",
    starts_at: "",
    ends_at: "",
  });

  useEffect(() => {
    if (!supabase) {
      setMessage("Supabase is not configured.");
      setChecking(false);
      return;
    }

    let mounted = true;

    const check = async (currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      setChecking(true);

      if (!currentSession?.user) {
        setAuthorised(false);
        setChecking(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", currentSession.user.id)
        .maybeSingle();

      if (!mounted) return;

      setAuthorised(!error && Boolean(data));
      setChecking(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      check(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        // Defer database queries outside the auth callback.
        setTimeout(() => check(nextSession), 0);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadData() {
    setMessage("");

    const [p, v, d] = await Promise.all([
      supabase.from("products").select("*").order("id"),
      supabase.from("product_variants").select("*").order("id"),
      supabase.from("discounts").select("*").order("id"),
    ]);

    const error = p.error || v.error || d.error;

    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts(p.data || []);
    setVariants(v.data || []);
    setDiscounts(d.data || []);
  }

  useEffect(() => {
    if (authorised) loadData();
  }, [authorised]);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) setMessage(error.message);
    setBusy(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function save(table, id, values) {
    setBusy(true);
    setMessage("");

    const { error } = await supabase
      .from(table)
      .update(values)
      .eq("id", id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Changes saved successfully.");
      await loadData();
      setMessage("Changes saved successfully.");
    }

    setBusy(false);
  }

  async function addProduct(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.from("products").insert({
      ...newProduct,
      name: newProduct.name.trim(),
      category: newProduct.category.trim().toLowerCase(),
      active: false,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setNewProduct({
        name: "",
        category: "",
        description: "",
        image_url: "",
        badge: "",
      });
      await loadData();
      setMessage("Product created as inactive. Add variants before activating.");
    }

    setBusy(false);
  }

  async function addVariant(productId, size) {
    setBusy(true);

    const { error } = await supabase
      .from("product_variants")
      .insert({
        product_id: productId,
        size,
        price: 0,
        stock: 0,
      });

    if (error) setMessage(error.message);
    else await loadData();

    setBusy(false);
  }

  async function addDiscount(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const start = new Date(newDiscount.starts_at);
    const end = new Date(newDiscount.ends_at);

    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      end <= start
    ) {
      setMessage("Choose valid dates, with the end after the start.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.from("discounts").insert({
      product_id: Number(newDiscount.product_id),
      name: newDiscount.name.trim(),
      discount_type: newDiscount.discount_type,
      discount_value: Number(newDiscount.discount_value),
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
      enabled: true,
    });

    if (error) {
      setMessage(error.message);
    } else {
      await loadData();
      setMessage("Discount created successfully.");
    }

    setBusy(false);
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f8f4ea] p-12 text-center">
        Checking administrator access...
      </div>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f4ea] p-6">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-3xl border border-[#dfd1b4] bg-[#fffdf8] p-8 shadow-xl"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
            Velavaa Shanmugaa
          </p>

          <h1 className="mt-4 text-center font-serif text-3xl">
            Administrator Login
          </h1>

          <div className="mt-8 space-y-4">
            <input
              className={inputClass}
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button className={`${buttonClass} w-full`} disabled={busy}>
              {busy ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {message && <p className="mt-4 text-sm text-red-700">{message}</p>}

          <a href="/" className="mt-6 block text-center text-sm underline">
            Return to Store
          </a>
        </form>
      </main>
    );
  }

  if (!authorised) {
    return (
      <main className="min-h-screen bg-[#f8f4ea] p-12 text-center">
        <h1 className="font-serif text-3xl">Access Denied</h1>
        <p className="mt-4">
          This account is not registered as a store administrator.
        </p>
        <button onClick={logout} className={`${buttonClass} mt-6`}>
          Sign Out
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4ea] px-5 py-8 text-[#211b14] md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-[#dfd1b4] pb-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
              Velavaa Shanmugaa
            </p>
            <h1 className="mt-2 font-serif text-4xl">Store Administration</h1>
            <p className="mt-2 text-sm text-[#756b5b]">
              Signed in as {session.user.email}
            </p>
          </div>

          <div className="flex gap-3">
            <a href="/" className={`${buttonClass} inline-block`}>
              View Store
            </a>
            <button onClick={logout} className={buttonClass}>
              Sign Out
            </button>
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Products", products.length],
            ["Variants", variants.length],
            ["Discounts", discounts.length],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[#dfd1b4] bg-white p-6"
            >
              <p className="text-sm text-[#756b5b]">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <nav className="mt-8 flex flex-wrap gap-3">
          {["products", "inventory", "discounts"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-full px-6 py-3 text-sm font-semibold capitalize ${
                tab === item
                  ? "bg-[#211b14] text-white"
                  : "border border-[#dfd1b4] bg-white"
              }`}
            >
              {item}
            </button>
          ))}
          <button onClick={loadData} className={buttonClass}>
            Refresh
          </button>
        </nav>

        {message && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-[#dfd1b4] bg-white p-4 text-sm"
          >
            {message}
          </div>
        )}

        {tab === "products" && (
          <section className="mt-8 space-y-6">
            <h2 className="font-serif text-2xl">Manage Products</h2>

            {products.map((product) => (
              <ProductEditor
                key={product.id}
                product={product}
                busy={busy}
                onSave={(values) => save("products", product.id, values)}
              />
            ))}

            <form
              onSubmit={addProduct}
              className="rounded-2xl border border-[#dfd1b4] bg-white p-6"
            >
              <h3 className="mb-5 font-serif text-xl">Add New Product</h3>

              <div className="grid gap-4 md:grid-cols-2">
                {["name", "category", "description", "image_url", "badge"].map(
                  (field) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-sm capitalize">
                        {field.replace("_", " ")}
                      </span>
                      <input
                        className={inputClass}
                        value={newProduct[field]}
                        required={field === "name" || field === "category"}
                        onChange={(event) =>
                          setNewProduct({
                            ...newProduct,
                            [field]: event.target.value,
                          })
                        }
                      />
                    </label>
                  )
                )}
              </div>

              <button disabled={busy} className={`${buttonClass} mt-5`}>
                Create Product
              </button>
            </form>
          </section>
        )}

        {tab === "inventory" && (
          <section className="mt-8 space-y-6">
            <h2 className="font-serif text-2xl">Prices and Inventory</h2>

            {products.map((product) => {
              const productVariants = variants.filter(
                (variant) => variant.product_id === product.id
              );

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-[#dfd1b4] bg-white p-6"
                >
                  <h3 className="font-serif text-xl">{product.name}</h3>

                  <div className="mt-5 space-y-4">
                    {productVariants.map((variant) => (
                      <VariantEditor
                        key={variant.id}
                        variant={variant}
                        busy={busy}
                        onSave={(values) =>
                          save("product_variants", variant.id, values)
                        }
                      />
                    ))}
                  </div>

                  {["Small", "Large"]
                    .filter(
                      (size) =>
                        !productVariants.some((variant) => variant.size === size)
                    )
                    .map((size) => (
                      <button
                        key={size}
                        disabled={busy}
                        onClick={() => addVariant(product.id, size)}
                        className={`${buttonClass} mt-4 mr-3`}
                      >
                        Add {size} Variant
                      </button>
                    ))}
                </div>
              );
            })}
          </section>
        )}

        {tab === "discounts" && (
          <section className="mt-8 space-y-6">
            <h2 className="font-serif text-2xl">Scheduled Discounts</h2>

            {discounts.map((discount) => (
              <DiscountEditor
                key={discount.id}
                discount={discount}
                product={products.find(
                  (product) => product.id === discount.product_id
                )}
                busy={busy}
                onSave={(values) => save("discounts", discount.id, values)}
              />
            ))}

            <form
              onSubmit={addDiscount}
              className="rounded-2xl border border-[#dfd1b4] bg-white p-6"
            >
              <h3 className="mb-5 font-serif text-xl">Create Discount</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm">Product</span>
                  <select
                    className={inputClass}
                    value={newDiscount.product_id}
                    onChange={(event) =>
                      setNewDiscount({
                        ...newDiscount,
                        product_id: event.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm">Offer Name</span>
                  <input
                    className={inputClass}
                    value={newDiscount.name}
                    onChange={(event) =>
                      setNewDiscount({
                        ...newDiscount,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm">Discount Type</span>
                  <select
                    className={inputClass}
                    value={newDiscount.discount_type}
                    onChange={(event) =>
                      setNewDiscount({
                        ...newDiscount,
                        discount_type: event.target.value,
                      })
                    }
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed amount (₹)</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm">Discount Value</span>
                  <input
                    type="number"
                    min="0.01"
                    max={
                      newDiscount.discount_type === "percentage"
                        ? 100
                        : undefined
                    }
                    step="0.01"
                    className={inputClass}
                    value={newDiscount.discount_value}
                    onChange={(event) =>
                      setNewDiscount({
                        ...newDiscount,
                        discount_value: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                {["starts_at", "ends_at"].map((field) => (
                  <label key={field}>
                    <span className="mb-2 block text-sm">
                      {field === "starts_at" ? "Starts At" : "Ends At"}
                    </span>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={newDiscount[field]}
                      onChange={(event) =>
                        setNewDiscount({
                          ...newDiscount,
                          [field]: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                ))}
              </div>

              <button disabled={busy} className={`${buttonClass} mt-5`}>
                Create Discount
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}

function ProductEditor({ product, onSave, busy }) {
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    description: product.description || "",
    image_url: product.image_url || "",
    badge: product.badge || "",
    active: product.active,
  });

  useEffect(() => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description || "",
      image_url: product.image_url || "",
      badge: product.badge || "",
      active: product.active,
    });
  }, [product]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave(form);
      }}
      className="rounded-2xl border border-[#dfd1b4] bg-white p-6"
    >
      <h3 className="mb-5 font-serif text-xl">{product.name}</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {["name", "category", "description", "image_url", "badge"].map(
          (field) => (
            <label key={field}>
              <span className="mb-2 block text-sm capitalize">
                {field.replace("_", " ")}
              </span>
              <input
                className={inputClass}
                value={form[field]}
                required={field === "name" || field === "category"}
                onChange={(event) =>
                  setForm({ ...form, [field]: event.target.value })
                }
              />
            </label>
          )
        )}
      </div>

      <label className="mt-5 flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) =>
            setForm({ ...form, active: event.target.checked })
          }
        />
        Product Active
      </label>

      <button disabled={busy} className={`${buttonClass} mt-5`}>
        Save Product
      </button>
    </form>
  );
}

function VariantEditor({ variant, onSave, busy }) {
  const [price, setPrice] = useState(String(variant.price));
  const [stock, setStock] = useState(String(variant.stock));

  useEffect(() => {
    setPrice(String(variant.price));
    setStock(String(variant.stock));
  }, [variant]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          price: Number(price),
          stock: Number(stock),
        });
      }}
      className="grid items-end gap-4 rounded-xl bg-[#f8f4ea] p-4 md:grid-cols-4"
    >
      <div>
        <p className="text-sm font-semibold">{variant.size}</p>
        <p className="mt-1 text-xs text-[#756b5b]">
          Current price: {money(variant.price)}
        </p>
      </div>

      <label>
        <span className="mb-2 block text-sm">Price (₹)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          className={inputClass}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
      </label>

      <label>
        <span className="mb-2 block text-sm">Stock</span>
        <input
          type="number"
          min="0"
          step="1"
          className={inputClass}
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          required
        />
      </label>

      <button disabled={busy} className={buttonClass}>
        Save
      </button>
    </form>
  );
}

function DiscountEditor({ discount, product, onSave, busy }) {
  const [enabled, setEnabled] = useState(discount.enabled);

  useEffect(() => {
    setEnabled(discount.enabled);
  }, [discount]);

  const now = Date.now();
  const start = new Date(discount.starts_at).getTime();
  const end = new Date(discount.ends_at).getTime();

  const status = !enabled
    ? "Disabled"
    : now < start
    ? "Scheduled"
    : now >= end
    ? "Expired"
    : "Active";

  return (
    <div className="rounded-2xl border border-[#dfd1b4] bg-white p-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl">{discount.name}</h3>
          <p className="mt-2 text-sm text-[#756b5b]">
            {product?.name || `Product #${discount.product_id}`}
          </p>
          <p className="mt-2 text-sm">
            {discount.discount_type === "percentage"
              ? `${discount.discount_value}% off`
              : `${money(discount.discount_value)} off`}
          </p>
          <p className="mt-2 text-xs text-[#756b5b]">
            {new Date(discount.starts_at).toLocaleString()} —{" "}
            {new Date(discount.ends_at).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">{status}</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
            Enabled
          </label>
          <button
            disabled={busy}
            onClick={() => onSave({ enabled })}
            className={`${buttonClass} mt-4`}
          >
            Save Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
