import { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error, info) {
    console.error("Application render failed", error, info);
  }
  render() {
    if (this.state.failed)
      return (
        <main className="container section" role="alert">
          <div className="empty-state">
            <h1>Something went wrong</h1>
            <p>Please reload the page and try again.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </main>
      );
    return this.props.children;
  }
}
