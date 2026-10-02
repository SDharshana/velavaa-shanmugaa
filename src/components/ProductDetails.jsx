import { useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Check,
} from "lucide-react";

function ProductDetails({
  product,
  onBack,
  onAddToCart,
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]
  );

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      price: selectedVariant.price,
      packageSize: selectedVariant.size,
      quantity,
    });
  };

  return (
    <section className="min-h-screen bg-[#f8f4ea] px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <button
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-sm font-medium text-[#655b4d] transition hover:text-[#a87918]"
        >
          <ArrowLeft size={18} />
          Back to Collection
        </button>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* Product Image */}
          <div className="sticky top-28">

            <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[32px] border border-[#dfd1b4] bg-[#f1e9d8]">

              {/* Decorative glow */}
              <div className="absolute h-80 w-80 rounded-full bg-[#c8a34f]/20 blur-3xl" />

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="relative z-10 max-h-[480px] max-w-[85%] object-contain transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="relative z-10 flex flex-col items-center">

                  {/* Temporary Cup Sambrani */}
                  <div className="relative flex h-52 w-64 items-center justify-center rounded-b-[45%] rounded-t-[18%] bg-gradient-to-br from-[#9b9a93] via-[#d5d2c8] to-[#55534e] shadow-[0_30px_45px_rgba(0,0,0,0.25)]">

                    <div className="absolute -top-5 h-14 w-72 rounded-[50%] bg-gradient-to-br from-[#cccac0] via-[#77756e] to-[#3d3b36]" />

                    <div className="absolute -top-1 h-8 w-48 rounded-[50%] bg-[#4b3421]" />

                    <div className="absolute -top-1 h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_25px_8px_rgba(255,130,20,0.65)]" />

                    <div className="absolute bottom-8 rounded-full bg-white/15 px-8 py-3 text-center backdrop-blur">
                      <p className="text-xs font-semibold tracking-[0.2em] text-white">
                        VELAVAA
                      </p>

                      <p className="mt-1 text-[9px] tracking-[0.15em] text-white/80">
                        SHANMUGAA
                      </p>
                    </div>

                  </div>

                  <div className="mt-[-8px] h-10 w-44 rounded-[50%] bg-[#45433e]" />

                </div>
              )}

              {/* Product Badge */}
              {product.badge && (
                <span className="absolute left-6 top-6 z-20 rounded-full bg-[#1d1913] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  {product.badge}
                </span>
              )}

            </div>

          </div>

          {/* Product Information */}
          <div className="pt-2">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
              Cup Sambrani
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#211b14] sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#756b5b]">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-7 flex items-end gap-3">
              <span className="text-3xl font-semibold text-[#211b14]">
                ₹{selectedVariant.price}
              </span>

              <span className="pb-1 text-sm text-[#918574]">
                / {selectedVariant.size}
              </span>
            </div>

            <div className="my-8 h-px bg-[#ded1b7]" />

            {/* Package Size */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#30291f]">
                  Package Size
                </p>

                <p className="text-xs text-[#918574]">
                  Select an option
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                {product.variants.map((variant) => {
                  const selected =
                    selectedVariant.size === variant.size;

                  return (
                    <button
                      key={variant.size}
                      onClick={() =>
                        setSelectedVariant(variant)
                      }
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-[#a87918] bg-[#fffdf8] shadow-sm"
                          : "border-[#d5c6a7] bg-[#fffdf8] hover:border-[#a87918]"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#30291f]">
                          {variant.size}
                        </p>

                        <p className="mt-1 text-xs text-[#918574]">
                          Cup Sambrani
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#211b14]">
                          ₹{variant.price}
                        </span>

                        {selected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#a87918] text-white">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-[#30291f]">
                Quantity
              </p>

              <div className="mt-4 flex h-12 w-fit items-center rounded-xl border border-[#d5c6a7] bg-[#fffdf8]">

                <button
                  onClick={decreaseQuantity}
                  className="flex h-full w-12 items-center justify-center text-[#655b4d] transition hover:text-[#a87918]"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center text-sm font-semibold text-[#30291f]">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  className="flex h-full w-12 items-center justify-center text-[#655b4d] transition hover:text-[#a87918]"
                >
                  <Plus size={16} />
                </button>

              </div>
            </div>

            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1d1913] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#a87918] sm:w-auto"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>

            {/* Product Highlights */}
            <div className="mt-10 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-[#dfd1b4] bg-[#fffdf8] p-4">
                <p className="text-xs font-semibold text-[#30291f]">
                  Traditional
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#918574]">
                  Crafted for a traditional experience
                </p>
              </div>

              <div className="rounded-2xl border border-[#dfd1b4] bg-[#fffdf8] p-4">
                <p className="text-xs font-semibold text-[#30291f]">
                  Cup Sambrani
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#918574]">
                  Easy-to-use Sambrani cup format
                </p>
              </div>

              <div className="rounded-2xl border border-[#dfd1b4] bg-[#fffdf8] p-4">
                <p className="text-xs font-semibold text-[#30291f]">
                  Velavaa
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#918574]">
                  From Velavaa Shanmugaa
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;