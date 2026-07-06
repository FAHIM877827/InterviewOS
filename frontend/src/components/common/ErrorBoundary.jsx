import { Component } from "react";

// App-wide safety net for render-time errors that would otherwise show a
// blank white screen. Deliberately a class component - React only supports
// error boundaries via componentDidCatch/getDerivedStateFromError, there is
// no hook equivalent. Wraps the whole app in App.jsx.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a production build this is where an error-reporting service
    // (Sentry, LogRocket, etc.) would be wired in.
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
          <p className="max-w-sm text-sm text-slate-600">
            An unexpected error occurred. Try reloading the page - if the
            problem continues, please check back later.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Reload app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;