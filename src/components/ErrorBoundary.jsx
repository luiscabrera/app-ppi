import { Component } from "react";
import ErrorState from "./ErrorState";

// Última red de seguridad: si algo inesperado rompe el render, se muestra un
// mensaje en lugar de una pantalla en blanco.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}
