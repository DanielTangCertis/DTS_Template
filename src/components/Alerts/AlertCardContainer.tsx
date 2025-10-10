import React from "react";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useAlertCardSync } from "@/hooks/useAlertCardSync";
import { AlertCard } from "./AlertCard";

export const AlertCardContainer: React.FC = () => {
  const { state, dispatch } = useDigitalTwinContext();

  useAlertCardSync();

  if (!state.activeAlertCard) {
    return null;
  }

  const alert = state.alerts[state.activeAlertCard.alertKey]; // Changed from alertId to alertKey

  if (!alert) {
    return null;
  }

  const handleClose = () => {
    dispatch({ type: "HIDE_ALERT_CARD" });
  };

  return (
    <AlertCard
      alert={alert}
      position={state.activeAlertCard.position}
      onClose={handleClose}
    />
  );
};
