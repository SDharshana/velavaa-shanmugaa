import { ArrowUpRight, ShoppingBag } from "lucide-react";

function ProductCard({ product, onClick }) {
  const startingPrice = product.variants[0].price;

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-[#e2d6bd] bg-[#fffdf8] transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(69,48,14,0.12)]"
    >
      {/* Product Image */}
      <div className="relative flex h-[330px] items-center justify-center overflow-hidden bg-[#f2ead9]">

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative z-10 flex h-52 w-44 flex-col items-center justify-end">

            <div className="relative flex h-28 w-36 items-center justify-center rounded-b-[45%] rounded-t-[18%] bg-gradient-to-br from-[#8d8d88] via-[#d2d0c7] to-[#55544f] shadow-[0_20px_25px_rgba(0,0,0,0.2)]">

              <div className="absolute -top-3 h-9 w-40 rounded-[50%] bg-gradient-to-br from-[#c9c8c0] via-[#77766f] to-[#3f3e3a]" />

              <div className="absolute -top-1 h-5 w-28 rounded-[50%] bg-[#47311e]" />

              <div className="absolute -top-1 h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_15px_5px_rgba(255,130,20,0.7)]" />

            </div>

            <div className="absolute bottom-0 h-7 w-24 rounded-[50%] bg-[#4b4a45]" />

          </div>
        )}

        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#d3ad55]/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#8b6b32]/10 blur-2xl" />

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-5 top-5 rounded-full bg-[#1d1913] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            {product.badge}
          </span>
        )}

        {/* View Button */}
        <button
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="absolute right-5 top-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label="View product"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-6">

        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a87918]">
          Cup Sambrani
        </p>

        <h3 className="mt-2 font-serif text-2xl text-[#292218]">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#756b5b]">
          {product.description}
        </p>

        {/* Price + View */}
        <div className="mt-5 flex items-center justify-between">

          <div>
            <p className="text-xs text-[#918574]">
              Starting from
            </p>

            <p className="mt-1 text-lg font-semibold text-[#211b14]">
              ₹{startingPrice}
            </p>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            className="flex items-center gap-2 rounded-full bg-[#1d1913] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#a87918]"
          >
            <ShoppingBag size={15} />
            View
          </button>

        </div>
      </div>
    </article>
  );
}

export default ProductCard;