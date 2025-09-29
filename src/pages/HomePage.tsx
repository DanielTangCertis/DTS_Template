import React from "react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { LayoutBox } from "../components/Layout";
import { Title } from "../components/Layout";
import { useHeader } from "../contexts/HeaderContext";
import { useDigitalTwin } from "../contexts/DigitalTwinContext";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { AnimationErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";

import {
  useDigitalTwinService,
  ConnectionStatus,
} from "@/services/DigitalTwinService";

// Components wrapped in error boundaries
import { Header } from "../components/Header/Header";
import { RouterNav } from "../components/RouterNav/RouterNav";
import LayerTree from "../components/LayerTree/LayerTree";
import Animation from "../components/ExplorerAnimations/ExplorerAnimations";
import { Weather } from "../components/Weather/Weather";

const HomeContainer = styled(Box)({
  width: "100vw",
  height: "100vh",
  background: "black",
  position: "relative",
  overflow: "hidden",
});

// Connection status indicator for debugging
const ConnectionStatusIndicator = styled(Box)<{ status: string }>(
  ({ status }) => ({
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 1000, //highest z-index
    padding: "8px 16px",
    borderRadius: "4px",
    color: "white",
    fontSize: "12px",
    fontFamily: "monospace",
    backgroundColor:
      status === "connected"
        ? "rgba(76, 175, 80, 0.8)"
        : status === "connecting" ||
          status === "reconnecting" ||
          status === "initializing"
        ? "rgba(255, 193, 7, 0.8)"
        : status === "error" || status === "timeout"
        ? "rgba(244, 67, 54, 0.8)"
        : "rgba(158, 158, 158, 0.8)",
    border: "1px solid",
    borderColor:
      status === "connected"
        ? "#4CAF50"
        : status === "connecting" ||
          status === "reconnecting" ||
          status === "initializing"
        ? "#FFC107"
        : status === "error" || status === "timeout"
        ? "#F44336"
        : "#9E9E9E",
  })
);

const HomePage: React.FC = () => {
  const { state: headerState } = useHeader();
  const { state: digitalTwinState, dispatch } = useDigitalTwin();
  const { connectionState, connect, onDataUpdate } = useDigitalTwinService();

  useEffect(() => {
    const initConnection = async () => {
      try {
        await connect(); //doesn't matter whether true or false is returned here
      } catch (error) {
        console.error("Digital Twin initialization error:", error);
      }
    };

    initConnection();
  }, [connect]);

  // Subscribe to Digital Twin service data updates
  useEffect(() => {
    const unsubscribe = onDataUpdate((type, data) => {
      switch (type) {
        case "layerTree":
          dispatch({ type: "SET_LAYER_TREE", payload: data });
          break;
        case "animations":
          dispatch({ type: "SET_ANIMATION_LIST", payload: data });
          break;
      }
    });

    return unsubscribe;
  }, [dispatch, onDataUpdate]);

  // Use ConnectionStatus enum for type safety
  useEffect(() => {
    dispatch({
      type: "SET_READY_STATE",
      payload: connectionState.status === ConnectionStatus.CONNECTED,
    });
  }, [connectionState.status, dispatch]);

  // Helper function for status display
  const getConnectionMessage = () => {
    switch (connectionState.status) {
      case ConnectionStatus.INITIALIZING:
        return "Initializing...";
      case ConnectionStatus.CONNECTING:
        return "Connecting...";
      case ConnectionStatus.RECONNECTING:
        return "Reconnecting...";
      case ConnectionStatus.CONNECTED:
        return "Connected";
      case ConnectionStatus.TIMEOUT:
        return "Timeout";
      case ConnectionStatus.ERROR:
        return `Error: ${connectionState.error}`;
      default:
        return "Disconnected";
    }
  };

  return (
    <HomeContainer>
      {/* Player container - this is where ac.min.js will render */}
      <Box
        id="player"
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          zIndex: 1,
          border: "none",
          background: "#000",
        }}
      />

      {process.env.NODE_ENV === "development" && (
        <ConnectionStatusIndicator status={connectionState.status}>
          DT: {getConnectionMessage()}
          {connectionState.retryCount > 0 &&
            ` (Retry ${connectionState.retryCount})`}
        </ConnectionStatusIndicator>
      )}

      <ErrorBoundary componentName="Header" showRetry={true}>
        <Header />
      </ErrorBoundary>

      {/* Left side overlay for LayerTree and Animation */}
      {headerState.showUI && (
        <>
          {headerState.showLayerTree && (
            <LayoutBox side="left">
              <Title>Layers</Title>
              <ErrorBoundary componentName="LayerTree">
                <LayerTree />
              </ErrorBoundary>
            </LayoutBox>
          )}

          {headerState.showAnimation && (
            <LayoutBox side="left">
              <Title>Animations</Title>
              <AnimationErrorBoundary>
                <Animation />
              </AnimationErrorBoundary>
            </LayoutBox>
          )}
        </>
      )}

      {/* Right side overlay for Weather */}
      {headerState.showUI && headerState.showWeather && (
        <LayoutBox side="right">
          <Title>Weather Control</Title>
          <ErrorBoundary componentName="Weather">
            <Weather />
          </ErrorBoundary>
        </LayoutBox>
      )}

      {/* Router navigation */}
      <ErrorBoundary componentName="RouterNav">
        <RouterNav />
      </ErrorBoundary>

      {/* Outlet for nested routes */}
      <Outlet />
    </HomeContainer>
  );
};

export default HomePage;
