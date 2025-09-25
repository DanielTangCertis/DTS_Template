import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { RefreshOutlined, ReportProblemOutlined } from '@mui/icons-material';

// Generic Error Boundary Props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showRetry?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Base Error Boundary Class
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.componentName || 'Component'}:`, error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Box
          sx={{
            p: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <ReportProblemOutlined sx={{ fontSize: 48, mb: 2, color: '#ff6b6b' }} />
          <Typography variant="h6" gutterBottom>
            {this.props.componentName || 'Component'} Error
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            This component encountered an error and couldn't render properly.
          </Typography>
          
          {this.props.showRetry && (
            <Button
              variant="outlined"
              startIcon={<RefreshOutlined />}
              onClick={this.handleRetry}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                }
              }}
            >
              Try Again
            </Button>
          )}

          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="caption" component="pre" sx={{ 
                fontSize: '0.7rem',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 200,
              }}>
                {this.state.error?.stack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

// Specialized Error Boundaries for different components
export const PanelErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    componentName="Panel"
    showRetry={true}
    fallback={
      <Box sx={{
        p: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        textAlign: 'center',
        minHeight: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography variant="body2">
          Panel temporarily unavailable
        </Typography>
      </Box>
    }
  >
    {children}
  </ErrorBoundary>
);

export const ChartErrorBoundary: React.FC<{ children: ReactNode; chartTitle?: string }> = ({ 
  children, 
  chartTitle 
}) => (
  <ErrorBoundary
    componentName={`Chart${chartTitle ? ` (${chartTitle})` : ''}`}
    showRetry={true}
    fallback={
      <Box sx={{
        height: '100%',
        minHeight: 150,
        border: '1px dashed rgba(255, 255, 255, 0.3)',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
      }}>
        <Typography variant="body2">
          Chart failed to load
        </Typography>
      </Box>
    }
  >
    {children}
  </ErrorBoundary>
);

export const CustomContentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    componentName="Custom Content"
    showRetry={false}
    fallback={
      <Alert 
        severity="warning" 
        sx={{ 
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          color: 'white',
          border: '1px solid rgba(255, 193, 7, 0.3)',
        }}
      >
        Content section unavailable
      </Alert>
    }
  >
    {children}
  </ErrorBoundary>
);

export const AnimationErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    componentName="Animation Panel"
    showRetry={true}
    fallback={
      <Box sx={{
        p: 3,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
      }}>
        <Typography variant="body1">
          Animation panel is temporarily unavailable
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontSize: '0.85rem' }}>
          The 3D scene is still functional
        </Typography>
      </Box>
    }
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;