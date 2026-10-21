import { useState } from "react";
import ProductCard from "./ProductCard";

export default function Products({
  products = [],
  loading = false,
  error = "",
  onProductSelect,
  searchTerm = "",
}) {
  const [filter, setFilter] = useState("all");

  const categories = [
    ["all", "All Products"],
    ["paal", "Paal Sambrani"],
    ["normal", "Normal Sambrani"],
    ["sandal", "Sandal Sambrani"],
  ];

  const visible = products.filter(
    (product) =>
      (filter === "all" || product.category === filter) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      id="collections"
      className="bg-[#fffdf8] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
          Our Collection
        </p>

        <h2 className="mt-4 font-serif text-4xl">
          Our Sambrani Collection
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`rounded-full px-5 py-3 text-sm ${
                filter === id
                  ? "bg-[#211b14] text-white"
                  : "border border-[#d8c9aa]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8">Loading products...</p>
        ) : error ? (
          <p role="alert" className="mt-8 text-red-700">
            {error}
          </p>
        ) : (
          <>
            <p className="mt-8 text-sm text-[#756b5b]">
              Showing {visible.length} products
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductSelect(product)}
                />
              ))}
            </div>

            {!visible.length && (
              <p className="mt-10">No products found.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
