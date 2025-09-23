import React from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import Header from "../components/Header/Header";
import Player from "../components/Player/Player";
import RouterNav from "../components/RouterNav/RouterNav";
import LayerTree from "../components/LayerTree/LayerTree";
import Animation from "../components/Animation/Animation";
import Weather from "../components/Weather/Weather";
import { LayoutBox } from "../components/Layout";
import { Title } from "../components/Layout";
import { useHeader } from "../contexts/HeaderContext";
import { useDigitalTwin } from "../contexts/DigitalTwinContext";

const HomeContainer = styled(Box)({
  width: "100vw",
  height: "100vh",
  background: "black",
  position: "relative",
  overflow: "hidden", // Add overflow hidden like in Vue version
});

const HomePage: React.FC = () => {
  const { state: headerState } = useHeader();
  const { state: digitalTwinState } = useDigitalTwin();

  return (
    <HomeContainer>
      {/* Player component - always rendered */}
      <Player />

      {/* Header - only show when player is ready */}
      {digitalTwinState.playerIsReady && <Header />}

      {/* Left side overlay for LayerTree and Animation */}
      {headerState.showUI &&
        (headerState.showLayerTree || headerState.showAnimation) && (
          <LayoutBox side="left" delay={0.3}>
            <Title icon="tucengshu">Menu</Title>
            {headerState.showLayerTree && <LayerTree />}
            {headerState.showAnimation && <Animation />}
          </LayoutBox>
        )}

      {/* Weather overlay */}
      {headerState.showUI && headerState.showWeather && <Weather />}

      {/* Router navigation - show when UI is ready */}
      {digitalTwinState.playerIsReady && headerState.showUI && <RouterNav />}

      {/* Page content - always render when player is ready, regardless of overlays */}
      {digitalTwinState.playerIsReady && <Outlet />}
    </HomeContainer>
  );
};

export default HomePage;
