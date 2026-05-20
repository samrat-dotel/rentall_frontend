import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Signup.css";

const BENEFITS = [
  "Rent products at a fraction of the cost",
  "Access hundreds of curated items",
  "Free returns included",
  "Flexible rental durations",
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const set = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: "",
      form: "",
    }));
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Name is required.";
    }

    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Enter a valid email.";
    }

    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    }

    if (!form.address.trim()) {
      e.address = "Address is required.";
    }

    if (!form.password) {
      e.password = "Password is required.";
    } else if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }

    if (!form.confirm) {
      e.confirm = "Please confirm your password.";
    } else if (form.confirm !== form.password) {
      e.confirm = "Passwords do not match.";
    }

    return e;
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        avatar: "Please upload a valid image file.",
      }));
      return;
    }

    const maxSizeInMb = 5;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      setErrors((current) => ({
        ...current,
        avatar: `Profile photo must be smaller than ${maxSizeInMb}MB.`,
      }));
      return;
    }

    setAvatarFile(file);

    setErrors((current) => ({
      ...current,
      avatar: "",
      form: "",
    }));

    const reader = new FileReader();

    reader.onload = (event) => {
      setAvatarPreview(event.target?.result || null);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
        confirm: form.confirm,
        profileImage: avatarFile,
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirm: "",
      });

      setAvatarFile(null);
      setAvatarPreview(null);
      setShowSuccessPopup(true);
    } catch (error) {
      setErrors({
        form: error.message || "Could not create account.",
      });
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-page__left">
        <div className="signup-page__left-inner">
          <Link to="/" className="signup-page__logo">
            RentAll<span>&#10003;</span>
          </Link>

          <div className="signup-page__left-hero">
            <img
              src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=700"
              alt=""
              className="signup-page__hero-img"
            />
          </div>

          <div className="signup-page__benefits">
            <h3 className="signup-page__benefits-title">Why join RentAll?</h3>

            <ul className="signup-page__benefits-list">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="signup-page__benefit">
                  <CheckCircle
                    size={16}
                    className="signup-page__benefit-icon"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="signup-page__right">
        <div className="signup-page__right-inner">
          <div className="signup-page__form-header">
            <h1 className="signup-page__title">Create your account</h1>

            <p className="signup-page__sub">
              Add your contact details and profile photo to help build trust
              before renting or listing items.
            </p>
          </div>

          <div className="signup-page__avatar-upload">
            <div className="signup-page__avatar-preview">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile preview" />
              ) : (
                <Upload size={24} className="signup-page__upload-icon" />
              )}
            </div>

            <div>
              <label htmlFor="avatar-input" className="signup-page__upload-btn">
                {avatarPreview ? "Change photo" : "Upload profile photo"}
              </label>

              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                style={{ display: "none" }}
              />

              <p className="signup-page__upload-hint">
                Optional · JPG, PNG or WEBP · Max 5MB
              </p>

              {errors.avatar && (
                <p className="signup-page__field-error">{errors.avatar}</p>
              )}
            </div>
          </div>

          {errors.form && (
            <div className="signup-page__error-banner">
              <AlertCircle size={15} /> {errors.form}
            </div>
          )}

          <form
            className="signup-page__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="signup-page__row">
              <Field
                label="Full Name"
                id="name"
                type="text"
                value={form.name}
                onChange={(value) => set("name", value)}
                error={errors.name}
                placeholder="Alex Morgan"
              />

              <Field
                label="Email Address"
                id="email"
                type="email"
                value={form.email}
                onChange={(value) => set("email", value)}
                error={errors.email}
                placeholder="you@example.com"
              />
            </div>

            <div className="signup-page__row">
              <Field
                label="Phone Number"
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(value) => set("phone", value)}
                error={errors.phone}
                placeholder="+1 (555) 000-0000"
              />

              <Field
                label="Address"
                id="address"
                type="text"
                value={form.address}
                onChange={(value) => set("address", value)}
                error={errors.address}
                placeholder="123 Main St, City"
              />
            </div>

            <div className="signup-page__row">
              <div className="signup-page__field">
                <label className="signup-page__label" htmlFor="password">
                  Password
                </label>

                <div className="signup-page__input-wrap">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={`signup-page__input${
                      errors.password ? " signup-page__input--error" : ""
                    }`}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="signup-page__pw-toggle"
                    onClick={() => setShowPw((current) => !current)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="signup-page__field-error">{errors.password}</p>
                )}
              </div>

              <div className="signup-page__field">
                <label className="signup-page__label" htmlFor="confirm">
                  Confirm Password
                </label>

                <div className="signup-page__input-wrap">
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)}
                    className={`signup-page__input${
                      errors.confirm ? " signup-page__input--error" : ""
                    }`}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="signup-page__pw-toggle"
                    onClick={() => setShowConfirm((current) => !current)}
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {errors.confirm && (
                  <p className="signup-page__field-error">{errors.confirm}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="signup-page__submit"
              disabled={loading}
            >
              {loading ? (
                <span className="signup-page__spinner" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="signup-page__login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="signup-success">
          <div className="signup-success__card">
            <div className="signup-success__icon">
              <CheckCircle size={38} />
            </div>

            <h2>Account created successfully</h2>

            <p>
              Your RentAll account has been created. You can now log in and
              start using the platform.
            </p>

            <button
              type="button"
              className="signup-success__btn"
              onClick={goToLogin}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, id, type, value, onChange, error, placeholder }) {
  return (
    <div className="signup-page__field">
      <label className="signup-page__label" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`signup-page__input${
          error ? " signup-page__input--error" : ""
        }`}
        placeholder={placeholder}
      />

      {error && <p className="signup-page__field-error">{error}</p>}
    </div>
  );
}