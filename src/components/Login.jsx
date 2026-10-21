
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";

function Login({ onBack, onRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      submit: "",
    }));
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateLogin()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error(
          "Authentication is not configured. Please contact the store administrator."
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Login failed. Please try again.");
      }

      alert("Login successful!");

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (error) {
      console.error("Login error:", error);

      let message = error.message || "Login failed. Please try again.";

      if (error.message === "Invalid login credentials") {
        message = "Incorrect email or password.";
      }

      if (error.message?.toLowerCase().includes("email not confirmed")) {
        message =
          "Please verify your email address before logging in.";
      }

      setErrors({
        submit: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setErrors({
        email: "Enter your email address first.",
      });

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      setErrors({
        email: "Enter a valid email address.",
      });

      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (!supabase) {
        throw new Error(
          "Authentication is not configured. Please contact the store administrator."
        );
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email.trim(),
        {
          redirectTo: `${window.location.origin}`,
        }
      );

      if (error) {
        throw error;
      }

      alert(
        "Password reset link sent. Please check your email."
      );
    } catch (error) {
      console.error("Password reset error:", error);

      setErrors({
        submit:
          error.message ||
          "Unable to send password reset email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f4ea] px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-xl">

        {/* Back */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-[#655b4d] transition hover:text-[#a87918]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Card */}
        <div className="rounded-[32px] border border-[#dfd1b4] bg-[#fffdf8] p-7 shadow-[0_25px_70px_rgba(69,48,14,0.08)] sm:p-10">

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1e5c9] text-[#a87918]">
              <LogIn size={27} />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
              Welcome Back
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#211b14]">
              Login to Your Account
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#756b5b]">
              Sign in to manage your profile and track your
              Velavaa Shanmugaa orders.
            </p>

          </div>

          {/* Error */}
          {errors.submit && (
            <div className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="mt-9 space-y-5"
          >

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-[#30291f]">
                Email{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#30291f]">
                  Password{" "}
                  <span className="text-red-600">*</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowForgotPassword(
                      (current) => !current
                    )
                  }
                  className="text-xs font-semibold text-[#a87918] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative mt-2">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#a87918]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#756b5b] hover:text-[#a87918]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Message */}
            {showForgotPassword && (
              <div className="rounded-xl border border-[#dfd1b4] bg-[#f8f4ea] p-4">
                <p className="text-sm leading-6 text-[#756b5b]">
                  Enter your email above and click the button
                  below to receive a password reset link.
                </p>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  className="mt-3 text-sm font-semibold text-[#a87918] hover:underline disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#1d1913] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#a87918] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Logging In..."
                : "Login"}
            </button>

          </form>

          {/* Register */}
          <div className="mt-7 text-center">
            <p className="text-sm text-[#756b5b]">
              Don't have an account?{" "}

              <button
                type="button"
                onClick={onRegister}
                className="font-semibold text-[#a87918] hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Login;

