import { useEffect, useState } from "react";

import AdminDashboard from "./admin/AdminDashboard";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import BrandStory from "./components/BrandStory";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import CheckoutUnavailable from "./components/CheckoutUnavailable";
import Register from "./components/Register";
import Login from "./components/Login";
import PasswordRecovery from "./components/PasswordRecovery";

import { fetchCatalog } from "./lib/catalog";

export default function App() {
  const path = window.location.pathname;

  if (path === "/admin" || path.startsWith("/admin/")) {
    return <AdminDashboard />;
  }

  if (path === "/reset-password") {
    return <PasswordRecovery />;
  }

  return <Store />;
}

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("store");

  useEffect(() => {
    let mounted = true;

    fetchCatalog()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function selectProduct(product) {
    setSelected(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToCollection() {
    setSelected(null);

    setTimeout(() => {
      document
        .getElementById("collections")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function navigate(id) {
    setPage("store");
    setSelected(null);
    setCartOpen(false);

    setTimeout(() => {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }, 80);
  }

  function addToCart(item) {
    const cartId = `${item.id}-${item.variantId}`;

    const existing = cart.find(
      (entry) => entry.cartId === cartId
    );

    if (
      (existing?.quantity || 0) + item.quantity >
      item.stock
    ) {
      return false;
    }

    setCart((items) =>
      existing
        ? items.map((entry) =>
            entry.cartId === cartId
              ? {
                  ...entry,
                  quantity: entry.quantity + item.quantity,
                }
              : entry
          )
        : [...items, { ...item, cartId }]
    );

    setCartOpen(true);
    return true;
  }

  function changeQuantity(id, delta) {
    setCart((items) =>
      items
        .map((entry) =>
          entry.cartId === id
            ? {
                ...entry,
                quantity: Math.min(
                  entry.stock,
                  Math.max(0, entry.quantity + delta)
                ),
              }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }

  return (
    <>
      <Navbar
        cartCount={cart.reduce(
          (count, item) => count + item.quantity,
          0
        )}
        onCartClick={() => setCartOpen(true)}
        searchTerm={search}
        onSearchChange={setSearch}
        onRegister={() => {
          setPage("login");
          setSelected(null);
          window.scrollTo(0, 0);
        }}
        onNavigate={navigate}
      />

      {page === "login" ? (
        <Login
          onBack={() => setPage("store")}
          onRegister={() => setPage("register")}
          onLoginSuccess={() => setPage("store")}
        />
      ) : page === "register" ? (
        <Register
          onBack={() => setPage("store")}
          onLogin={() => setPage("login")}
        />
      ) : page === "checkout" ? (
        <CheckoutUnavailable
          onBack={() => {
            setPage("store");
            setCartOpen(true);
          }}
        />
      ) : selected ? (
        <ProductDetails
          key={selected.id}
          product={selected}
          onBack={backToCollection}
          onAddToCart={addToCart}
        />
      ) : (
        <>
          <Hero />

          <Products
            products={products}
            loading={loading}
            error={error}
            onProductSelect={selectProduct}
            searchTerm={search}
          />

          <BrandStory />
          <Footer />
        </>
      )}

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onIncrease={(id) => changeQuantity(id, 1)}
        onDecrease={(id) => changeQuantity(id, -1)}
        onRemove={(id) =>
          setCart((items) =>
            items.filter((entry) => entry.cartId !== id)
          )
        }
        onClear={() => setCart([])}
        onCheckout={() => {
          setCartOpen(false);
          setPage("checkout");
          window.scrollTo(0, 0);
        }}
      />
    </>
  );
}
