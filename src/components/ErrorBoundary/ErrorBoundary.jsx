import React from "react";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;

      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "30px",
            background: "#fff",
            color: "#000",
            fontFamily: "monospace",
          }}
        >
          <h1 style={{ color: "#d32f2f" }}>
            Uncaught Error
          </h1>

          <h2>
            {error?.message || "Unknown error"}
          </h2>

          <pre
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {error?.stack || String(error)}
          </pre>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;