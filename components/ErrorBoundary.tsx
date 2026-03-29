import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      try {
        if (this.state.error?.message) {
           const parsed = JSON.parse(this.state.error.message);
           if (parsed.error) {
               errorMessage = `Database Error: ${parsed.error}`;
           }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-cyber-black text-red-500 font-mono p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">SYSTEM FAILURE</h1>
          <p className="text-xl mb-6">{errorMessage}</p>
          <button
            className="px-6 py-2 bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors"
            onClick={() => window.location.reload()}
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
