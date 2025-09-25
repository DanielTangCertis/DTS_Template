import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { WifiOff, Refresh } from "@mui/icons-material";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Services
import {
  digitalTwinService,
  ConnectionStatus,
  useDigitalTwinService,
} from "./services/DigitalTwinService";

// Context Providers
import { DigitalTwinProvider } from "./contexts/DigitalTwinContext";
import { HeaderProvider } from "./contexts/HeaderContext";

// Pages
import HomePage from "./pages/HomePage";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import NotFound from "./pages/NotFound";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7afafe",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#000000",
      paper: "rgba(0, 0, 0, 0.8)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: "Oppo, Arial, sans-serif",
  },
});

// Connection Status Component
const ConnectionDisplay: React.FC = () => {
  const { connectionState, connect, reconnect } = useDigitalTwinService();

  const getStatusColor = () => {
    switch (connectionState.status) {
      case ConnectionStatus.CONNECTED:
        return "#4caf50";
      case ConnectionStatus.CONNECTING:
      case ConnectionStatus.RECONNECTING:
        return "#ff9800";
      case ConnectionStatus.ERROR:
      case ConnectionStatus.DISCONNECTED:
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getStatusText = () => {
    switch (connectionState.status) {
      case ConnectionStatus.CONNECTED:
        return "Connected";
      case ConnectionStatus.CONNECTING:
        return "Connecting...";
      case ConnectionStatus.RECONNECTING:
        return `Reconnecting... (${connectionState.retryCount}/${5})`;
      case ConnectionStatus.ERROR:
        return "Connection Error";
      case ConnectionStatus.DISCONNECTED:
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  if (connectionState.status === ConnectionStatus.CONNECTED) {
    return null; // Hide when connected
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${getStatusColor()}`,
        borderRadius: 2,
        p: 2,
        color: "white",
        minWidth: 200,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        {connectionState.status === ConnectionStatus.CONNECTING ||
        connectionState.status === ConnectionStatus.RECONNECTING ? (
          <CircularProgress size={16} sx={{ mr: 1, color: getStatusColor() }} />
        ) : (
          <WifiOff sx={{ mr: 1, color: getStatusColor(), fontSize: 16 }} />
        )}
        <Typography variant="body2" sx={{ color: getStatusColor() }}>
          {getStatusText()}
        </Typography>
      </Box>

      {connectionState.error && (
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 1, opacity: 0.8 }}
        >
          {connectionState.error}
        </Typography>
      )}

      {(connectionState.status === ConnectionStatus.ERROR ||
        connectionState.status === ConnectionStatus.DISCONNECTED) && (
        <Button
          size="small"
          startIcon={<Refresh />}
          onClick={() =>
            connectionState.status === ConnectionStatus.ERROR
              ? reconnect()
              : connect()
          }
          sx={{
            color: getStatusColor(),
            borderColor: getStatusColor(),
            "&:hover": {
              borderColor: getStatusColor(),
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          variant="outlined"
        >
          Retry
        </Button>
      )}
    </Box>
  );
};

// Main App with Error Boundaries
const AppContent: React.FC = () => {
  const { connectionState, connect } = useDigitalTwinService();
  const [initialConnectionAttempted, setInitialConnectionAttempted] =
    useState(false);

  // Initial connection attempt
  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
      try {
        // Wait a moment for scripts to load
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (mounted) {
          await connect();
          setInitialConnectionAttempted(true);
        }
      } catch (error) {
        console.error("Failed to initialize connection:", error);
        if (mounted) {
          setInitialConnectionAttempted(true);
        }
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
    };
  }, [connect]);

  // Show loading screen during initial connection
  if (!initialConnectionAttempted) {
    return <LoadingSpinner />;
  }

  // Show NotFound page on connection failure
  if (
    connectionState.status === ConnectionStatus.ERROR &&
    connectionState.retryCount >= 5
  ) {
    return <NotFound />;
  }

  // Show loading for ongoing connection attempts
  if (
    connectionState.status === ConnectionStatus.CONNECTING ||
    connectionState.status === ConnectionStatus.RECONNECTING
  ) {
    const message =
      connectionState.status === ConnectionStatus.RECONNECTING
        ? `Reconnecting... (Attempt ${connectionState.retryCount + 1})`
        : "Connecting to Digital Twin...";
    return <LoadingSpinner message={message} />;
  }

  // Main app routes (only render when connected)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <ErrorBoundary componentName="HomePage" showRetry={true}>
              <HomePage />
            </ErrorBoundary>
          }
        >
          <Route index element={<Navigate to="page1" replace />} />
          <Route
            path="page1"
            element={
              <ErrorBoundary componentName="Page1" showRetry={true}>
                <Page1 />
              </ErrorBoundary>
            }
          />
          <Route
            path="page2"
            element={
              <ErrorBoundary componentName="Page2" showRetry={true}>
                <Page2 />
              </ErrorBoundary>
            }
          />
          <Route
            path="page3"
            element={
              <ErrorBoundary componentName="Page3" showRetry={true}>
                <Page3 />
              </ErrorBoundary>
            }
          />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ErrorBoundary
        componentName="Application Root"
        fallback={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              backgroundColor: "#000",
              color: "white",
              textAlign: "center",
              p: 3,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Application Error
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              The application encountered a critical error and needs to be
              reloaded.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ backgroundColor: "#00ffff", color: "#000" }}
            >
              Reload Application
            </Button>
          </Box>
        }
      >
        <DigitalTwinProvider>
          <HeaderProvider>
            <AppContent />
          </HeaderProvider>
        </DigitalTwinProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
