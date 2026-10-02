import { useState } from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Paal Sambrani",
    category: "paal",
    description:
      "Traditional Paal Sambrani crafted for a rich and soothing aromatic experience.",
    badge: "Popular",
    variants: [
      { size: "Small", price: 99 },
      { size: "Large", price: 179 },
    ],
  },
  {
    id: 2,
    name: "Normal Sambrani",
    category: "normal",
    description:
      "Traditional Sambrani suitable for everyday use and devotional moments.",
    badge: "Classic",
    variants: [
      { size: "Small", price: 99 },
      { size: "Large", price: 169 },
    ],
  },
  {
    id: 3,
    name: "Sandal Sambrani",
    category: "sandal",
    description:
      "A warm sandalwood-inspired Sambrani experience for traditional moments.",
    badge: "Premium",
    variants: [
      { size: "Small", price: 109 },
      { size: "Large", price: 189 },
    ],
  },
];

function Products({ onProductSelect, searchTerm }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeFilter === "all" ||
      product.category === activeFilter;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="collections"
      className="bg-[#fffdf8] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-10 bg-[#b58a2b]" />

              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
                Our Collection
              </span>
            </div>

            <h2 className="font-serif text-4xl leading-tight text-[#211b14] sm:text-5xl">
              Our Sambrani{" "}
              <span className="italic text-[#a87918]">
                Collection
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#756b5b]">
            Discover our traditional Cup Sambrani collection,
            crafted with care for everyday fragrance and
            devotional moments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-12 flex gap-3 overflow-x-auto pb-2">

          <button
            onClick={() => setActiveFilter("all")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-xs font-semibold transition ${
              activeFilter === "all"
                ? "bg-[#1d1913] text-white"
                : "border border-[#d8c9aa] text-[#655b4d] hover:border-[#a87918]"
            }`}
          >
            All Products
          </button>

          <button
            onClick={() => setActiveFilter("paal")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-xs font-semibold transition ${
              activeFilter === "paal"
                ? "bg-[#1d1913] text-white"
                : "border border-[#d8c9aa] text-[#655b4d] hover:border-[#a87918]"
            }`}
          >
            Paal Sambrani
          </button>

          <button
            onClick={() => setActiveFilter("normal")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-xs font-semibold transition ${
              activeFilter === "normal"
                ? "bg-[#1d1913] text-white"
                : "border border-[#d8c9aa] text-[#655b4d] hover:border-[#a87918]"
            }`}
          >
            Normal Sambrani
          </button>

          <button
            onClick={() => setActiveFilter("sandal")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-xs font-semibold transition ${
              activeFilter === "sandal"
                ? "bg-[#1d1913] text-white"
                : "border border-[#d8c9aa] text-[#655b4d] hover:border-[#a87918]"
            }`}
          >
            Sandal Sambrani
          </button>

        </div>

        {/* Product Count */}
        <div className="mt-8">
          <p className="text-sm text-[#918574]">
            Showing{" "}
            <span className="font-semibold text-[#30291f]">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductSelect(product)}
              />
            ))}
          </div>
        )}

        {/* No Products */}
        {filteredProducts.length === 0 && (
          <div className="mt-12 rounded-[28px] border border-[#dfd1b4] bg-[#f8f3e8] py-20 text-center">

            <h3 className="font-serif text-2xl text-[#292218]">
              No products found
            </h3>

            <p className="mt-3 text-sm text-[#756b5b]">
              Try searching for another Sambrani product.
            </p>

            <button
              onClick={() => {
                setActiveFilter("all");
              }}
              className="mt-6 rounded-full bg-[#1d1913] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#a87918]"
            >
              View All Products
            </button>

          </div>
        )}

      </div>
    </section>
  );
}

export default Products;