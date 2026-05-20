import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/items?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          RentAll
          <span className="navbar__logo-dot">&#10003;</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <Search size={16} className="navbar__search-icon" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="navbar__search-input"
          />
        </form>

        {/* Right Actions */}
        <div className="navbar__actions">
          {/* Mobile Search Toggle */}
          <button
            className="navbar__icon-btn navbar__mobile-search"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <Link
            to="/items"
            className="navbar__icon-btn navbar__wishlist"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="navbar__badge">{wishlist.length}</span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="navbar__user" ref={dropdownRef}>
              <button
                className="navbar__user-btn"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="navbar__avatar"
                  />
                ) : (
                  <div className="navbar__avatar navbar__avatar--placeholder">
                    {user.name[0]}
                  </div>
                )}
                <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user.name}</p>
                    <p className="navbar__dropdown-email">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={15} /> Profile
                  </Link>
                  <Link
                    to="/transactions"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Transactions
                  </Link>
                  <Link
                    to="/payments"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Payments
                  </Link>
                  <button
                    className="navbar__dropdown-item navbar__dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="navbar__btn navbar__btn--outline">
                Login
              </Link>
              <Link to="/signup" className="navbar__btn navbar__btn--filled">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="navbar__icon-btn navbar__hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="navbar__mobile-searchbar">
          <form onSubmit={handleSearch}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar__mobile-menu">
          <NavLink
            to="/"
            className="navbar__mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/items"
            className="navbar__mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Items
          </NavLink>
          <NavLink
            to="/categories"
            className="navbar__mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            Categories
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="navbar__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </NavLink>
              <NavLink
                to="/transactions"
                className="navbar__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                Transactions
              </NavLink>
              <NavLink
                to="/payments"
                className="navbar__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                Payments
              </NavLink>
              <button
                className="navbar__mobile-link navbar__mobile-logout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="navbar__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="navbar__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
