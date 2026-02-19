import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Une erreur s'est produite
            </h2>
            <p className="text-gray-600 mb-6">
              Nous sommes désolés, mais quelque chose s'est mal passé. Veuillez réessayer.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 rounded p-3 mb-6 text-left">
                <p className="text-sm text-gray-600 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button
              onClick={this.handleReset}
              className="bg-[#2196F3] hover:bg-[#1976D2]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
