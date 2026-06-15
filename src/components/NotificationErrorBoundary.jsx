import React from 'react';

// Evita que falhas no sistema de alerta/horário derrubem a interface.
export default class NotificationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
