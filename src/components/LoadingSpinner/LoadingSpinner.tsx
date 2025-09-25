import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  styled,
  keyframes,
} from "@mui/material";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoadingContainer = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99,
  animation: `${fadeIn} 0.3s ease-out`,
});

const LoadingText = styled(Typography)({
  color: "#ffffff",
  marginTop: "20px",
  fontSize: "16px",
  fontFamily: "Oppo, Arial, sans-serif",
});

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Connecting To Digital Twin...",
  size = 60,
}) => {
  return (
    <LoadingContainer>
      <CircularProgress
        size={size}
        sx={{
          color: "#7afafe",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
