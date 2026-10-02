import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
} from "lucide-react";

import logo from "../assets/logo.png";

function Navbar({
  cartCount,
  onCartClick,
  searchTerm,
  onSearchChange,
  onRegister,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6dcc8] bg-[#fffdf8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <a
          href="#"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="Velavaa Shanmugaa"
            className="h-14 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <a
            href="#"
            className="text-sm font-medium text-[#3b3429] transition hover:text-[#a87918]"
          >
            Home
          </a>

          <a
            href="#collections"
            className="text-sm font-medium text-[#3b3429] transition hover:text-[#a87918]"
          >
            Collections
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-[#3b3429] transition hover:text-[#a87918]"
          >
            Our Story
          </a>

          <a
            href="#contact"
            className="text-sm font-medium text-[#3b3429] transition hover:text-[#a87918]"
          >
            Contact
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* Account */}
          <button
            onClick={onRegister}
            className="hidden items-center gap-2 rounded-full border border-[#c9a85a] px-5 py-2.5 text-sm font-semibold text-[#3b3429] transition hover:bg-[#eee5d2] hover:text-[#a87918] sm:flex"
          >
            <User size={17} />
            Account
          </button>

          {/* Search */}
          <div className="relative flex items-center">

            {searchOpen && (
              <div className="absolute right-14 top-1/2 w-64 -translate-y-1/2">
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(event) =>
                    onSearchChange(event.target.value)
                  }
                  placeholder="Search products..."
                  className="w-full rounded-full border border-[#d8c9aa] bg-[#fffdf8] px-5 py-3 pr-10 text-sm text-[#30291f] shadow-lg outline-none placeholder:text-[#a69a87] focus:border-[#a87918]"
                />

                {searchTerm && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8170] transition hover:text-[#a87918]"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() =>
                setSearchOpen((current) => !current)
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a85a] text-[#3b3429] transition hover:bg-[#eee5d2] hover:text-[#a87918]"
              aria-label="Search"
            >
              <Search size={19} />
            </button>
          </div>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a85a] text-[#3b3429] transition hover:bg-[#eee5d2] hover:text-[#a87918]"
            aria-label="Shopping cart"
          >
            <ShoppingBag
              size={19}
              strokeWidth={1.7}
            />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#a87918] text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a85a] text-[#3b3429] transition hover:bg-[#eee5d2] lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#e6dcc8] bg-[#fffdf8] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">

            {/* Mobile Account */}
            <button
              onClick={() => {
                setMenuOpen(false);
                onRegister();
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#a87918] hover:bg-[#f3ecdf]"
            >
              <User size={18} />
              Account
            </button>

            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#3b3429] hover:bg-[#f3ecdf] hover:text-[#a87918]"
            >
              Home
            </a>

            <a
              href="#collections"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#3b3429] hover:bg-[#f3ecdf] hover:text-[#a87918]"
            >
              Collections
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#3b3429] hover:bg-[#f3ecdf] hover:text-[#a87918]"
            >
              Our Story
            </a>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#3b3429] hover:bg-[#f3ecdf] hover:text-[#a87918]"
            >
              Contact
            </a>

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;