import { useState } from "react";
import { linkProfileRequest } from "../../api/profileApi";
import { useToast } from "../../context/ToastContext";

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

function validate(leetcodeUsername) {
  const errors = {};
  const trimmed = leetcodeUsername.trim();

  if (!trimmed) {
    errors.leetcodeUsername = "LeetCode username is required";
  } else if (!USERNAME_REGEX.test(trimmed)) {
    errors.leetcodeUsername = "Use only letters, numbers, hyphens, and underscores";
  }

  return errors;
}

// Renders inside EmptyState (see Dashboard.jsx) so a user with no
// ProfileSnapshot yet can call POST /api/profile/link directly from the
// dashboard. On success, calls onLinked() so Dashboard's useDashboardData
// refetch runs and the empty state is replaced with real data.
function LinkProfileForm({ onLinked }) {
  const { showSuccess, showError } = useToast();
  const [username, setUsername] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate(username);
    setFieldError(errors.leetcodeUsername || "");
    if (errors.leetcodeUsername) {
      return;
    }

    setIsSubmitting(true);
    try {
      await linkProfileRequest({ leetcodeUsername: username.trim() });
      showSuccess("Profile linked! Loading your dashboard...");
      onLinked?.();
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Unable to link that profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-sm flex-col gap-3"
    >
      <div className="space-y-1 text-left">
        <label
          htmlFor="leetcodeUsername"
          className="block text-sm font-medium text-slate-700"
        >
          LeetCode username
        </label>
        <input
          id="leetcodeUsername"
          name="leetcodeUsername"
          type="text"
          autoComplete="off"
          placeholder="e.g. johndoe123"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {fieldError && <p className="text-xs text-red-600">{fieldError}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Linking profile..." : "Link profile"}
      </button>
    </form>
  );
}

export default LinkProfileForm;