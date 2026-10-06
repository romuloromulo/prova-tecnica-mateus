import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('mateus_cart');
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-mateus-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-dentinho text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-mateus-sky-50 p-2 border border-mateus-sky-200 flex items-center justify-center">
              <img
                src="/mascote/dentinho-ola.svg"
                alt="Mascote Dentinho"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                <AlertTriangle size={14} />
                <span>Ops, vizinho! Tivemos um contratempo</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">
                Vamos organizar a prateleira
              </h2>
              <p className="text-xs text-slate-500">
                O Dentinho já está cuidando disso para você. Clique abaixo para restabelecer a loja.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-mateus-blue hover:bg-mateus-blue-700 text-white font-bold text-sm shadow-soft transition"
            >
              <RefreshCcw size={16} />
              <span>Recarregar Supermercado</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
