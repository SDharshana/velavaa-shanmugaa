# Velavaa Shanmugaa — Launch checklist

Razorpay checkout is intentionally disabled.

Before accepting orders:

- Integrate Razorpay securely on the server.
- Verify payments using server-side signatures/webhooks.
- Create orders using server-calculated prices.
- Implement transactional inventory reservation/deduction.
- Add order management and customer order history.
- Configure shipping, returns, privacy and terms policies.
- Test registration, login and password recovery.
- Test admin product image uploads.
- Test mobile navigation and all cart interactions.
- Verify hosting and production environment variables.

Supabase Auth redirect URLs must include:

http://localhost:5173/reset-password

And the production equivalent:

https://YOUR-DOMAIN/reset-password

Do not put Razorpay secret keys in VITE_ environment variables.
