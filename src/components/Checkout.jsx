import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function Checkout({ cartItems, onBack, onPlaceOrder }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Please enter your delivery address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please enter your city";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Please enter your pincode";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode =
        "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setErrors({
        submit: "Your cart is empty.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order ID
      const newOrderId = `VS${Date.now()
        .toString()
        .slice(-8)}`;

      // Calculate subtotal
      const orderSubtotal = cartItems.reduce(
        (total, item) =>
          total +
          Number(item.price) * item.quantity,
        0
      );

      // Create order in orders table
      const { data: order, error: orderError } =
        await supabase
          .from("orders")
          .insert({
            order_id: newOrderId,
            customer_name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            pincode: formData.pincode.trim(),
            subtotal: orderSubtotal,
            status: "Pending",
          })
          .select("id")
          .single();

      if (orderError) {
        console.error(
          "Supabase Order Error:",
          orderError
        );

        setErrors({
          submit:
            orderError.message ||
            "Unable to save your order.",
        });

        setIsSubmitting(false);
        return;
      }

      // Prepare order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        package_size: item.packageSize,
        price: Number(item.price),
        quantity: item.quantity,
      }));

      // Insert order items
      const { error: itemsError } =
        await supabase
          .from("order_items")
          .insert(orderItems);

      if (itemsError) {
        console.error(
          "Supabase Order Items Error:",
          itemsError
        );

        // Delete the incomplete order
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        setErrors({
          submit:
            itemsError.message ||
            "Unable to save order items.",
        });

        setIsSubmitting(false);
        return;
      }

      // Successfully saved
      console.log("Order saved successfully");
      console.log("Order ID:", newOrderId);
      console.log("Order:", order);
      console.log("Order Items:", orderItems);

      setOrderId(newOrderId);
      setOrderPlaced(true);

      onPlaceOrder(formData);

      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "Unexpected checkout error:",
        error
      );

      setErrors({
        submit:
          "Something went wrong while placing your order. Please try again.",
      });

      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8f4ea] px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#1d1913] text-white shadow-xl">
            <Check size={42} strokeWidth={1.8} />
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
            Order Confirmed
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#211b14] sm:text-5xl">
            Thank You, {formData.name}
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#756b5b]">
            Your order has been received successfully.
            We will contact you regarding delivery and
            payment confirmation.
          </p>

          <div className="mx-auto mt-9 rounded-[28px] border border-[#dfd1b4] bg-[#fffdf8] p-6 text-left sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#918574]">
                  Order ID
                </p>

                <p className="mt-1 text-lg font-semibold tracking-wide text-[#211b14]">
                  #{orderId}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee5d2] text-[#a87918]">
                <ShoppingBag size={20} />
              </div>
            </div>

            <div className="my-6 h-px bg-[#ded1b7]" />

            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#918574]">
                  Order Date
                </span>

                <span className="text-sm font-medium text-[#30291f]">
                  {new Date().toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#918574]">
                  Items
                </span>

                <span className="text-sm font-medium text-[#30291f]">
                  {cartItems.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#918574]">
                  Customer
                </span>

                <span className="text-right text-sm font-medium text-[#30291f]">
                  {formData.name}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#918574]">
                  Phone
                </span>

                <span className="text-sm font-medium text-[#30291f]">
                  {formData.phone}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-[#918574]">
                  City
                </span>

                <span className="text-sm font-medium text-[#30291f]">
                  {formData.city}
                </span>
              </div>
            </div>

            <div className="my-6 h-px bg-[#ded1b7]" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#30291f]">
                Order Total
              </span>

              <span className="text-2xl font-semibold text-[#211b14]">
                ₹{subtotal}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#dfd1b4] bg-[#f3ecdf] p-5">
            <p className="text-sm font-medium text-[#30291f]">
              What happens next?
            </p>

            <p className="mt-2 text-xs leading-6 text-[#756b5b]">
              Our team will review your order and contact
              you using the phone number provided for
              delivery and payment confirmation.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-full bg-[#1d1913] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#a87918]"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f4ea] px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-sm font-medium text-[#655b4d] transition hover:text-[#a87918]"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
            Checkout
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#211b14] sm:text-5xl">
            Complete Your Order
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#756b5b]">
            Enter your delivery details and review your
            Velavaa Shanmugaa order before placing it.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Delivery Details */}
            <div className="rounded-[28px] border border-[#dfd1b4] bg-[#fffdf8] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d1913] text-sm font-semibold text-white">
                  1
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-[#211b14]">
                    Delivery Details
                  </h2>

                  <p className="mt-1 text-xs text-[#918574]">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#30291f]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
                  />

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#30291f]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
                  />

                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#30291f]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#30291f]">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House / Flat number, Street, Area"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
                  />

                  {errors.address && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#30291f]">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
                  />

                  {errors.city && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#30291f]">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
                  />

                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-[28px] border border-[#dfd1b4] bg-[#fffdf8] p-6 sm:p-7 lg:sticky lg:top-28">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d1913] text-white">
                  <ShoppingBag size={17} />
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-[#211b14]">
                    Your Order
                  </h2>

                  <p className="mt-1 text-xs text-[#918574]">
                    {cartItems.length} item
                    {cartItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex gap-3 border-b border-[#eadfca] pb-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0e7d5]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <div className="h-9 w-11 rounded-b-[40%] rounded-t-[15%] bg-gradient-to-br from-[#aaa9a1] via-[#d0cec5] to-[#595750]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#292218]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[#918574]">
                        {item.packageSize} × {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[#211b14]">
                      ₹{Number(item.price) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#756b5b]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#211b14]">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#756b5b]">
                    Shipping
                  </span>

                  <span className="text-xs text-[#918574]">
                    Calculated later
                  </span>
                </div>

                <div className="h-px bg-[#ded1b7]" />

                <div className="flex justify-between">
                  <span className="font-semibold text-[#30291f]">
                    Total
                  </span>

                  <span className="text-xl font-semibold text-[#211b14]">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              {errors.submit && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold text-white transition ${
                  isSubmitting
                    ? "cursor-not-allowed bg-[#8d867b]"
                    : "bg-[#1d1913] hover:bg-[#a87918]"
                }`}
              >
                <Check size={17} />

                {isSubmitting
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="mt-3 text-center text-[11px] leading-5 text-[#918574]">
                Your order will be reviewed before payment
                confirmation.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Checkout;