import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";

function Cart({
  isOpen,
  onClose,
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckout,
}) {
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Cart Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#fffdf8] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e1d5bd] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a87918]">
              Your Cart
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[#211b14]">
              Shopping Bag
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded2ba] text-[#554c3e] transition hover:bg-[#eee5d2]"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eee5d2] text-[#a87918]">
                <ShoppingBag size={30} strokeWidth={1.5} />
              </div>

              <h3 className="mt-6 font-serif text-2xl text-[#292218]">
                Your cart is empty
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-6 text-[#756b5b]">
                Add your favourite Velavaa Shanmugaa Sambrani products to get
                started.
              </p>

              <button
                onClick={onClose}
                className="mt-7 flex items-center gap-2 rounded-full bg-[#1d1913] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#a87918]"
              >
                Continue Shopping
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Clear Cart */}
              {onClear && (
                <div className="flex justify-end">
                  <button
                    onClick={onClear}
                    className="text-xs font-medium text-[#8c8170] transition hover:text-red-700"
                  >
                    Clear cart
                  </button>
                </div>
              )}

              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="rounded-2xl border border-[#e1d5bd] bg-[#f8f3e8] p-4"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e8dfcd]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="relative h-14 w-16 rounded-b-[40%] rounded-t-[15%] bg-gradient-to-br from-[#aaa9a1] via-[#d0cec5] to-[#595750]">
                          <div className="absolute -top-2 left-1/2 h-4 w-18 -translate-x-1/2 rounded-[50%] bg-[#77766f]" />
                        </div>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a87918]">
                            Cup Sambrani
                          </p>

                          <h3 className="mt-1 text-sm font-semibold text-[#292218]">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs text-[#756b5b]">
                            {item.packageSize}
                          </p>
                        </div>

                        <button
                          onClick={() => onRemove(item.cartId)}
                          className="text-[#8c8170] transition hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity + Price */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex h-9 items-center rounded-lg border border-[#d5c6a7] bg-white">
                          <button
                            onClick={() => onDecrease(item.cartId)}
                            className="flex h-full w-9 items-center justify-center text-[#655b4d] hover:text-[#a87918]"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-8 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => onIncrease(item.cartId)}
                            className="flex h-full w-9 items-center justify-center text-[#655b4d] hover:text-[#a87918]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-[#211b14]">
                          ₹{Number(item.price) * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#e1d5bd] bg-[#fffdf8] p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#756b5b]">Subtotal</span>

                <span className="text-xl font-semibold text-[#211b14]">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#918574]">
                <span>Shipping</span>

                <span>Calculated at checkout</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d1913] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#a87918]"
            >
              Proceed to Checkout
              <ArrowRight size={17} />
            </button>
            <p className="mt-3 text-center text-[11px] leading-5 text-[#918574]">
              Your order will be reviewed before payment confirmation.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default Cart;
