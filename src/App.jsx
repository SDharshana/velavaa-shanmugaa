import AdminDashboard from "./admin/AdminDashboard";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import BrandStory from "./components/BrandStory";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const isAdminRoute = window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin/");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    setSelectedProduct(null);

    setTimeout(() => {
      document.getElementById("collections")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  const handleAddToCart = (product) => {
    const cartId = `${product.id}-${product.packageSize}`;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.cartId === cartId
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: item.quantity + product.quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          cartId,
        },
      ];
    });

    setCartOpen(true);
  };

  const handleIncrease = (cartId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const handleDecrease = (cartId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (cartId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartId !== cartId)
    );
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
    setRegisterOpen(false);
    setLoginOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCheckoutBack = () => {
    setCheckoutOpen(false);
    setCartOpen(true);
  };

  const handlePlaceOrder = (customerDetails) => {
    console.log("Customer Details:", customerDetails);
    console.log("Order Items:", cartItems);
  };

  // Open Register page
  const handleRegister = () => {
    setRegisterOpen(true);
    setLoginOpen(false);
    setCheckoutOpen(false);
    setSelectedProduct(null);
    setCartOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Open Login page
  const handleLogin = () => {
    setLoginOpen(true);
    setRegisterOpen(false);
    setCheckoutOpen(false);
    setSelectedProduct(null);
    setCartOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Back from Register
  const handleRegisterBack = () => {
    setRegisterOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Back from Login
  const handleLoginBack = () => {
    setLoginOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // After successful login
  const handleLoginSuccess = () => {
    setLoginOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isAdminRoute) return <AdminDashboard />;

  return (
    <div>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRegister={handleRegister}
      />

      {loginOpen ? (
        <Login
          onBack={handleLoginBack}
          onRegister={handleRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : registerOpen ? (
        <Register
          onBack={handleRegisterBack}
          onLogin={handleLogin}
        />
      ) : checkoutOpen ? (
        <Checkout
          cartItems={cartItems}
          onBack={handleCheckoutBack}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={handleBack}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <>
          <Hero />

          <Products
            onProductSelect={handleProductSelect}
            searchTerm={searchTerm}
          />

          <BrandStory />

          <Footer />
        </>
      )}

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
        onClear={() => setCartItems([])}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;

