import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTE_PATHS } from "../constants/routePaths";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || ROUTE_PATHS.DASHBOARD;

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
      await login(form);
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => navigate(redirectTo, { replace: true }), 600);
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Unable to log in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-600">
          Log in to view your readiness dashboard.
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
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to={ROUTE_PATHS.SIGNUP} className="font-medium text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;