import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";

function Register({ onBack, onLogin }) {
  const [formData, setFormData] = useState({
    fullName: "",
    country: "India",
    state: "Tamil Nadu",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const indianStates = [
    "Tamil Nadu",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

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

  const validateForm = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name.";
    }

    // Country
    if (!formData.country) {
      newErrors.country = "Please select your country.";
    }

    // State
    if (formData.country === "India" && !formData.state) {
      newErrors.state = "Please select your state.";
    }

    // Mobile is OPTIONAL
    if (
      formData.phone.trim() &&
      !/^\+?[0-9]{10,15}$/.test(formData.phone.trim())
    ) {
      newErrors.phone = "Enter a valid mobile number.";
    }

    // Email is REQUIRED
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Please enter a password.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Supabase Auth account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Registration failed. Please try again.");
      }

      /*
       * If email confirmation is enabled,
       * Supabase creates the user but does not
       * create an authenticated session yet.
       */
      if (!data.session) {
        alert(
          "Account created successfully! Please check your email and verify your account before logging in."
        );

        if (onLogin) {
          onLogin();
        }

        return;
      }

      /*
       * A session exists.
       * The user is authenticated, so RLS allows
       * the user to insert their own customer profile.
       */
      const { error: profileError } = await supabase
        .from("customers")
        .insert({
          id: data.user.id,
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim() || null,
          email: formData.email.trim(),
          country: formData.country,
          state:
            formData.country === "India"
              ? formData.state
              : null,
        });

      if (profileError) {
        throw profileError;
      }

      alert("Registration successful!");

      if (onLogin) {
        onLogin();
      }
    } catch (error) {
      console.error("Registration error:", error);

      setErrors({
        submit:
          error.message ||
          "Registration failed. Please try again.",
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
              <UserPlus size={27} />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#a87918]">
              Welcome
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#211b14]">
              Create Your Account
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#756b5b]">
              Create an account to manage your profile and track
              your Velavaa Shanmugaa orders.
            </p>

          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="mt-9 space-y-5"
          >

            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold text-[#30291f]">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
              />

              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Country + State */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Country */}
              <div>
                <label className="text-sm font-semibold text-[#30291f]">
                  Country
                </label>

                <select
                  name="country"
                  value={formData.country}
                  onChange={(event) => {
                    const value = event.target.value;

                    setFormData((current) => ({
                      ...current,
                      country: value,
                      state:
                        value === "India"
                          ? current.state || "Tamil Nadu"
                          : "",
                    }));

                    setErrors((current) => ({
                      ...current,
                      country: "",
                      state: "",
                      submit: "",
                    }));
                  }}
                  className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none focus:border-[#a87918]"
                >
                  <option value="India">
                    India
                  </option>

                  <option value="United States">
                    United States
                  </option>

                  <option value="United Kingdom">
                    United Kingdom
                  </option>

                  <option value="Canada">
                    Canada
                  </option>

                  <option value="Australia">
                    Australia
                  </option>

                  <option value="Singapore">
                    Singapore
                  </option>

                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                {errors.country && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.country}
                  </p>
                )}
              </div>

              {/* State */}
              {formData.country === "India" && (
                <div>
                  <label className="text-sm font-semibold text-[#30291f]">
                    State
                  </label>

                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none focus:border-[#a87918]"
                  >
                    <option value="">
                      Select your state
                    </option>

                    {indianStates.map((state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    ))}
                  </select>

                  {errors.state && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.state}
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-sm font-semibold text-[#30291f]">
                Mobile Number{" "}
                <span className="font-normal text-[#918574]">
                  (Optional)
                </span>
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={
                  formData.country === "India"
                    ? "9876543210"
                    : "+1 234 567 8900"
                }
                className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
              />

              <p className="mt-1 text-xs text-[#918574]">
                Optional. You can add your mobile number for
                order contact and delivery updates.
              </p>

              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>

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
                className="mt-2 w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a87918]"
              />

              <p className="mt-1 text-xs text-[#918574]">
                Required for login and account verification.
              </p>

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-[#30291f]">
                Password
              </label>

              <div className="relative mt-2">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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

              <p className="mt-1 text-xs text-[#918574]">
                Minimum 6 characters.
              </p>

              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-[#30291f]">
                Confirm Password
              </label>

              <div className="relative mt-2">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-[#d5c6a7] bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#a87918]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#756b5b] hover:text-[#a87918]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#1d1913] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#a87918] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-7 text-center">
            <p className="text-sm text-[#756b5b]">
              Already have an account?{" "}

              <button
                type="button"
                onClick={onLogin}
                className="font-semibold text-[#a87918] hover:underline"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Register;