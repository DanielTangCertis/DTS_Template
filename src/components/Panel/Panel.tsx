import React from "react";
import { Box, Fade } from "@mui/material";
import { useDigitalTwin } from "../../contexts/DigitalTwinContext";
import { PanelErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import styles from "./Panel.module.css";

// Main Panel props interface - simplified
export interface PanelProps {
  side: "left" | "right";
  children?: React.ReactNode;
  width?: string;
  delay?: number;
}

export const Panel: React.FC<PanelProps> = ({
  side,
  children,
  width,
  delay = 0,
}) => {
  const { state: digitalTwinState } = useDigitalTwin();

  // Don't render until digital twin player is ready
  if (!digitalTwinState.playerIsReady) {
    return null;
  }

  const panelClass = side === "left" ? styles.panelLeft : styles.panelRight;
  const customWidthStyle = width ? { width } : {};

  return (
    <PanelErrorBoundary>
      <Fade
        in={digitalTwinState.playerIsReady}
        timeout={800}
        style={{
          transitionDelay: `${delay * 300}ms`,
        }}
      >
        <Box
          className={`${styles.panelContainer} ${panelClass}`}
          style={customWidthStyle}
        >
          <Box className={styles.contentBox}>
            {children}
          </Box>
        </Box>
      </Fade>
    </PanelErrorBoundary>
  );
};