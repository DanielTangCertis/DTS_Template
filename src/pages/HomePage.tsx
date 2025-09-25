import React from "react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import Player from "../components/Player/Player";
import { LayoutBox } from "../components/Layout";
import { Title } from "../components/Layout";
import { useHeader } from "../contexts/HeaderContext";
import { useDigitalTwin } from "../contexts/DigitalTwinContext";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { AnimationErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import {
  digitalTwinService,
  useDigitalTwinService,
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

const HomePage: React.FC = () => {
  const { state: headerState } = useHeader();
  const { state: digitalTwinState, dispatch } = useDigitalTwin();
  const { connectionState, connect, onDataUpdate } = useDigitalTwinService();

  // Initialize connection on mount
  useEffect(() => {
    connect();
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

  // Update player ready state based on connection
  useEffect(() => {
    dispatch({
      type: "SET_READY_STATE",
      payload: connectionState.status === "connected",
    });
  }, [connectionState.status, dispatch]);

  return (
    <HomeContainer>
      {/* Player container - no longer a React component */}
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

      {/* Header - wrapped in error boundary */}
      {digitalTwinState.playerIsReady && (
        <ErrorBoundary componentName="Header" showRetry={true}>
          <Header />
        </ErrorBoundary>
      )}

      {/* Left side overlay for LayerTree and Animation */}
      {headerState.showUI &&
        (headerState.showLayerTree || headerState.showAnimation) && (
          <ErrorBoundary componentName="Left Panel" showRetry={false}>
            <LayoutBox side="left" delay={0.3}>
              <Title icon="tucengshu">Menu</Title>
              {headerState.showLayerTree && (
                <ErrorBoundary componentName="Layer Tree" showRetry={true}>
                  <LayerTree />
                </ErrorBoundary>
              )}
              {headerState.showAnimation && (
                <AnimationErrorBoundary>
                  <Animation />
                </AnimationErrorBoundary>
              )}
            </LayoutBox>
          </ErrorBoundary>
        )}

      {/* Weather overlay */}
      {headerState.showUI && headerState.showWeather && (
        <ErrorBoundary componentName="Weather" showRetry={true}>
          <Weather />
        </ErrorBoundary>
      )}

      {/* Router navigation */}
      {digitalTwinState.playerIsReady && headerState.showUI && (
        <ErrorBoundary componentName="Router Navigation" showRetry={false}>
          <RouterNav />
        </ErrorBoundary>
      )}

      {/* Page content - always render when player is ready */}
      {digitalTwinState.playerIsReady && (
        <ErrorBoundary componentName="Page Content" showRetry={true}>
          <Outlet />
        </ErrorBoundary>
      )}
    </HomeContainer>
  );
};

export default HomePage;
