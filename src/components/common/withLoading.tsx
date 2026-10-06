import React from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export interface WithLoadingProps {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  onRetry?: () => void;
  loadingMessage?: string;
  errorMessage?: string;
}

/**
 * Higher-Order Component (HOC) Pattern: withLoading
 * Transparently wraps any list or view component with loading spinner/skeleton and error retry state
 *
 * @template P Component props type
 */
export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  const ComponentWithLoading: React.FC<P & WithLoadingProps> = ({
    status,
    error,
    onRetry,
    loadingMessage = 'Đang tải danh sách bài tập...',
    errorMessage = 'Không thể tải danh sách bài tập.',
    ...restProps
  }) => {
    // 1. Loading State
    if (status === 'loading') {
      return (
        <div className="state-card loading-state" role="status" aria-live="polite">
          <div className="loading-spinner-wrapper">
            <Loader2 className="spinner-icon" size={36} />
          </div>
          <p className="loading-text">{loadingMessage}</p>
          <span className="loading-subtext">Đang kết nối API và đồng bộ dữ liệu...</span>
        </div>
      );
    }

    // 2. Failed / Error State
    if (status === 'failed') {
      return (
        <div className="state-card error-state" role="alert">
          <div className="error-icon-wrapper">
            <AlertCircle className="error-icon" size={40} />
          </div>
          <h3 className="error-title">{errorMessage}</h3>
          <p className="error-description">{error || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'}</p>
          {onRetry && (
            <button
              type="button"
              className="btn btn-primary retry-btn"
              onClick={onRetry}
              aria-label="Thử lại thao tác tải bài tập"
            >
              <RefreshCw size={16} />
              Thử lại
            </button>
          )}
        </div>
      );
    }

    // 3. Render wrapped component with full types
    return <WrappedComponent {...(restProps as P)} />;
  };

  ComponentWithLoading.displayName = `withLoading(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ComponentWithLoading;
}
