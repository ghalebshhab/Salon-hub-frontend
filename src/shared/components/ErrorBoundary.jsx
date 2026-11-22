import { Component } from "react";
import ErrorPage from "./ErrorPage.jsx";

/**
 * Catches a render crash and shows the "crash" error page.
 * - `resetKey`: when it changes (for example the page address), the boundary
 *   tries again, so opening another page recovers without a reload.
 * - `fullScreen`: for the top-level boundary, where no app shell is left.
 */
export default class ErrorBoundary extends Component {
  state = { failed: false, resetKey: this.props.resetKey };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey)
      return { failed: false, resetKey: props.resetKey };
    return null;
  }

  componentDidCatch(error, info) {
    console.error("Application render failed", error, info);
  }

  render() {
    if (this.state.failed)
      return <ErrorPage kind="crash" fullScreen={this.props.fullScreen} />;
    return this.props.children;
  }
}
