import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { AlertData, AlertStatus } from "@/types/digitalTwin.types";

const StyledAlertCard = styled(Box)({
  position: "fixed",
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "16px 20px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  minWidth: "250px",
  maxWidth: "350px",
  zIndex: 1000,
  pointerEvents: "auto",
  fontFamily: "General Sans, Arial, sans-serif",
});

const StatusChip = styled(Box)<{ status: AlertStatus }>(({ status }) => ({
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "bold",
  backgroundColor: status === AlertStatus.UNRESOLVED ? "#ff4444" : "#ff9800",
  color: "#ffffff",
  marginTop: "8px",
  fontFamily: "General Sans, Arial, sans-serif",
}));

interface AlertCardProps {
  alert: AlertData;
  position: { x: number; y: number };
  onClose?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, position, onClose }) => {
  return (
    <StyledAlertCard
      sx={{
        left: `${position.x + 10}px`,
        top: `${position.y + 10}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "8px",
          fontFamily: "General Sans, Arial, sans-serif",
        }}
      >
        {alert.title}
      </Typography>

      <StatusChip status={alert.status}>{alert.status}</StatusChip>

      <Typography
        variant="body2"
        sx={{
          marginTop: "12px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.7)",
          fontFamily: "General Sans, Arial, sans-serif",
        }}
      >
        Entity ID: {alert.entityId}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          marginTop: "4px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.7)",
          fontFamily: "General Sans, Arial, sans-serif",
        }}
      >
        Location: ({alert.location.x.toFixed(2)}, {alert.location.y.toFixed(2)}, {alert.location.z.toFixed(2)})
      </Typography>
    </StyledAlertCard>
  );
};