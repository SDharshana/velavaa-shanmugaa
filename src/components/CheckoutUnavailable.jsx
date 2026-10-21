export default function CheckoutUnavailable({ onBack }) {
  return (
    <main className="min-h-[70vh] bg-[#f8f4ea] px-6 py-24">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#dfd1b4] bg-white p-10 text-center">
        <h1 className="font-serif text-3xl">
          Checkout Coming Soon
        </h1>

        <p className="mt-5 text-[#756b5b]">
          Secure Razorpay payments are being prepared.
          We are not accepting online orders or payments yet.
        </p>

        <button
          onClick={onBack}
          className="mt-8 rounded-xl bg-[#211b14] px-6 py-3 text-white"
        >
          Back to Cart
        </button>
      </div>
    </main>
  );
}
