import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              RentAll<span>&#10003;</span>
            </Link>
            <p className="footer__tagline">
              Rent fashion. Live fully. Return simply.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Shop</h4>
            <ul className="footer__links">
              <li>
                <Link to="/categories" className="footer__link">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/categories" className="footer__link">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/categories" className="footer__link">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/items" className="footer__link">
                  All Items
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Account</h4>
            <ul className="footer__links">
              <li>
                <Link to="/login" className="footer__link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="footer__link">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer__link">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="footer__link">
                  Transactions
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Support</h4>
            <ul className="footer__links">
              <li>
                <Link to="/" className="footer__link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} RentAll. All rights reserved.
          </p>
          <p className="footer__made">
            Made with <Heart size={13} className="footer__heart" />to make renting simple, trusted, and effortless</p>
        </div>
      </div>
    </footer>
  );
}
