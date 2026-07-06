import { useToast } from "../../context/ToastContext";

const TYPE_CLASSES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

// Fixed bottom-right stack, rendered once near the root (see App.jsx) so
// any component can call useToast().showSuccess/showError from anywhere
// in the tree without prop drilling.
function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            TYPE_CLASSES[toast.type] || TYPE_CLASSES.success
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-current opacity-60 transition-opacity hover:opacity-100"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;