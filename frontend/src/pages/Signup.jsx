import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTE_PATHS } from "../constants/routePaths";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches SignupRequest's @Size(min = 6) constraint on the backend.
const MIN_PASSWORD_LENGTH = 6;

function validate({ email, password, confirmPassword }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already logged in? Don't show the signup form - send them straight to
  // the dashboard instead.
  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");
    setSuccessMessage("");

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      // confirmPassword is client-side only - SignupRequest only accepts
      // { email, password }.
      await signup({ email: form.email, password: form.password });
      setSuccessMessage("Account created! Redirecting to your dashboard...");
      setTimeout(() => navigate(ROUTE_PATHS.DASHBOARD, { replace: true }), 600);
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Unable to sign up. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-600">
          Start tracking your DSA interview readiness.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {serverError && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {successMessage}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to={ROUTE_PATHS.LOGIN} className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;