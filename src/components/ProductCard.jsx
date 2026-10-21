import { ShoppingBag } from "lucide-react";
import { money } from "../lib/catalog";

export default function ProductCard({ product, onClick }) {
  const available = product.variants.filter((v) => v.stock > 0);

  const variants = available.length
    ? available
    : product.variants;

  const starting = [...variants].sort(
    (a, b) => a.price - b.price
  )[0];

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#e2d6bd] bg-white">
      <button onClick={onClick} className="block w-full text-left">
        <div className="relative flex h-72 items-center justify-center bg-[#f2ead9]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-6"
            />
          ) : (
            <span className="font-serif text-2xl text-[#8b744a]">
              Velavaa Shanmugaa
            </span>
          )}

          {!available.length && (
            <span className="absolute left-4 top-4 rounded-full bg-[#211b14] px-4 py-2 text-xs text-white">
              Sold Out
            </span>
          )}

          {available.length > 0 && product.discount && (
            <span className="absolute left-4 top-4 rounded-full bg-[#a87918] px-4 py-2 text-xs text-white">
              Special Offer
            </span>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-serif text-2xl">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-[#756b5b]">
            {product.description}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-semibold">
              {starting
                ? `From ${money(starting.price)}`
                : "Unavailable"}
            </span>

            <span className="flex items-center gap-2 rounded-full bg-[#211b14] px-4 py-3 text-xs text-white">
              <ShoppingBag size={15} />
              View
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
