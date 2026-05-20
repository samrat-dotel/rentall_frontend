import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      addToast("Welcome back!", "success");
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__left">
        <div className="login-page__left-inner">
          <Link to="/" className="login-page__logo">
            RentAll<span>&#10003;</span>
          </Link>
          <h1 className="login-page__headline">Welcome back</h1>
          <p className="login-page__sub">
            Sign in to access your rentals, wishlist, and account.
          </p>

          <form className="login-page__form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="login-page__error">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <div className="login-page__field">
              <label className="login-page__label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="login-page__input"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="login-page__field">
              <div className="login-page__label-row">
                <label className="login-page__label" htmlFor="password">
                  Password
                </label>
                <Link to="/" className="login-page__forgot">
                  Forgot password?
                </Link>
              </div>
              <div className="login-page__input-wrap">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="login-page__input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-page__pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="login-page__remember">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => set("remember", e.target.checked)}
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              className="login-page__submit"
              disabled={loading}
            >
              {loading ? <span className="login-page__spinner" /> : "Sign In"}
            </button>
          </form>

          <p className="login-page__signup-link">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>

          {/* Demo hint */}
          <div className="login-page__demo">
            <p className="login-page__demo-title">Demo credentials</p>
            <p>
              Email: <strong>alex@example.com</strong>
            </p>
            <p>
              Password: <strong>any 4+ chars</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="login-page__right" aria-hidden="true">
        <img
          src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=900"
          alt=""
          className="login-page__bg-image"
        />
        <div className="login-page__right-overlay">
          <blockquote className="login-page__quote">
            "Rent the style you love — own the moment, not the wardrobe."
          </blockquote>
        </div>
      </div>
    </div>
  );
}
