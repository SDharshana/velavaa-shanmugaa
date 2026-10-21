import { useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { money } from "../lib/catalog";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
}) {
  const [variantId, setVariantId] = useState(
    product.variants[0]?.id
  );

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const variant =
    product.variants.find((v) => v.id === variantId) ||
    product.variants[0];

  const stock = variant?.stock || 0;

  function add() {
    if (!variant || stock < quantity) {
      setMessage("Not enough stock.");
      return;
    }

    const success = onAddToCart({
      ...product,
      variantId: variant.id,
      price: variant.price,
      packageSize: variant.size,
      quantity,
      stock,
    });

    if (success === false) {
      setMessage("Quantity exceeds available stock.");
    }
  }

  return (
    <section className="min-h-screen bg-[#f8f4ea] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={18} />
          Back to Collection
        </button>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="flex min-h-80 items-center justify-center rounded-3xl bg-[#f1e9d8]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[480px] w-full object-contain p-8"
              />
            ) : (
              <span className="font-serif text-3xl">
                Velavaa Shanmugaa
              </span>
            )}
          </div>

          <div>
            <h1 className="font-serif text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 leading-7 text-[#756b5b]">
              {product.description}
            </p>

            <p className="mt-6 text-3xl font-semibold">
              {variant ? money(variant.price) : "Unavailable"}
            </p>

            {variant &&
              variant.originalPrice > variant.price && (
                <p className="mt-2 text-sm text-[#756b5b]">
                  <s>{money(variant.originalPrice)}</s>
                  {" "}— Offer Price
                </p>
              )}

            <h2 className="mt-8 font-semibold">
              Package Size
            </h2>

            <div className="mt-3 flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariantId(v.id);
                    setQuantity(1);
                    setMessage("");
                  }}
                  className={`rounded-xl border px-5 py-3 ${
                    v.id === variant?.id
                      ? "border-[#a87918] bg-white"
                      : "border-[#d5c6a7]"
                  }`}
                >
                  {v.size} · {money(v.price)} ·{" "}
                  {v.stock > 0
                    ? `${v.stock} available`
                    : "Sold Out"}
                </button>
              ))}
            </div>

            <p className="mt-7 text-sm">
              {stock > 0
                ? `${stock} in stock`
                : "Sold Out"}
            </p>

            <div className="mt-3 flex items-center gap-5">
              <button
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
              >
                <Minus />
              </button>

              <span>{quantity}</span>

              <button
                aria-label="Increase quantity"
                disabled={quantity >= stock}
                onClick={() =>
                  setQuantity((q) => Math.min(stock, q + 1))
                }
              >
                <Plus />
              </button>
            </div>

            <button
              disabled={!stock}
              onClick={add}
              className="mt-7 flex items-center gap-3 rounded-xl bg-[#211b14] px-7 py-4 text-white disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              {stock ? "Add to Cart" : "Sold Out"}
            </button>

            {message && (
              <p role="alert" className="mt-3 text-red-700">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
