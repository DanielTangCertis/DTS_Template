import React from "react";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useAlertCardSync } from "@/hooks/useAlertCardSync";
import { AlertCard } from "./AlertCard";
import { alertData } from "@/data/sampleData";

export const AlertCardContainer: React.FC = () => {
  const { state, dispatch } = useDigitalTwinContext();

  useAlertCardSync();

  if (!state.activeAlertCard) {
    return null;
  }

  const alert =
    alertData[state.activeAlertCard.alertKey as keyof typeof alertData];

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
