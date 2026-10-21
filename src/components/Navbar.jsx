import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar({
  cartCount = 0,
  onCartClick,
  searchTerm = "",
  onSearchChange,
  onRegister,
  onNavigate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const links = [
    ["home", "Home"],
    ["collections", "Collections"],
    ["about", "Our Story"],
    ["contact", "Contact"],
  ];

  function navigate(id) {
    setMenuOpen(false);
    onNavigate(id);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6dcc8] bg-[#fffdf8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 lg:px-10">
        <button onClick={() => navigate("home")} aria-label="Home">
          <img
            src={logo}
            alt="Velavaa Shanmugaa"
            className="h-14 w-auto object-contain"
          />
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="text-sm font-medium hover:text-[#a87918]"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegister}
            className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm sm:flex"
          >
            <User size={17} />
            Account
          </button>

          <button
            aria-label="Search products"
            onClick={() => {
              setSearchOpen((v) => !v);
              navigate("collections");
            }}
            className="rounded-full border p-3"
          >
            <Search size={18} />
          </button>

          <button
            aria-label="Open cart"
            onClick={onCartClick}
            className="relative rounded-full border p-3"
          >
            <ShoppingBag size={18} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[#a87918] px-1.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full border p-3 lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <input
            autoFocus
            aria-label="Search products"
            placeholder="Search Sambrani products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border bg-white p-3"
          />
        </div>
      )}

      {menuOpen && (
        <nav className="flex flex-col border-t bg-[#fffdf8] px-4 py-3 lg:hidden">
          <button
            onClick={() => {
              setMenuOpen(false);
              onRegister();
            }}
            className="p-3 text-left"
          >
            Account
          </button>

          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="p-3 text-left"
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
