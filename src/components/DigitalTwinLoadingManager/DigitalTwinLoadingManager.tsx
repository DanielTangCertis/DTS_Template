import React from "react";
import { Box, styled } from "@mui/material";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useDigitalTwinService, ConnectionStatus } from "../../services/DigitalTwinService";

const LoadingOverlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 5, // above DT player but below UI
  color: "white",
  fontSize: "18px",
  backdropFilter: "blur(6px)",
  pointerEvents: "none",
});

const ErrorMessage = styled(Box)({
  textAlign: "center",
  maxWidth: "400px",
  padding: "20px",
  // Re-enable pointer events for error content
  pointerEvents: "auto",
  
  "& .error-title": {
    fontSize: "24px",
    marginBottom: "16px",
    color: "#F44336"
  },
  
  "& .error-description": {
    fontSize: "16px",
    marginBottom: "20px",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.5
  },
  
  "& .error-details": {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "monospace",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "12px",
    borderRadius: "4px",
    marginTop: "16px"
  }
});

const DigitalTwinLoadingManager: React.FC = () => {
  const { connectionState} = useDigitalTwinService();

  // Don't render overlay if successfully connected
  if (connectionState.status === ConnectionStatus.CONNECTED) {
    return null;
  }

  // Render error/timeout state
  if (connectionState.status === ConnectionStatus.TIMEOUT || 
      connectionState.status === ConnectionStatus.ERROR) {
    return (
      <LoadingOverlay>
        <ErrorMessage>
          <Box className="error-title">
            {connectionState.status === ConnectionStatus.TIMEOUT ? "Connection Timeout" : "Connection Error"}
          </Box>
          <Box className="error-description">
            {connectionState.status === ConnectionStatus.TIMEOUT 
              ? "Failed to establish connection to Digital Twin within 10 seconds. The interface will continue to work with limited functionality."
              : "An error occurred while connecting to Digital Twin. Some features may not be available."
            }
          </Box>
          {connectionState.error && (
            <Box className="error-details">
              {connectionState.error}
            </Box>
          )}
        </ErrorMessage>
      </LoadingOverlay>
    );
  }

  // Render loading state using your original spinner
  return (
    <LoadingOverlay>
      <Box textAlign="center" sx={{ pointerEvents: "auto" }}>
        <LoadingSpinner />
      </Box>
    </LoadingOverlay>
  );
};

export default DigitalTwinLoadingManager;