import React, { useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";
import { useDigitalTwin } from "../../contexts/DigitalTwinContext";

const PlayerContainer = styled(Box)({
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  zIndex: 1,
  border: "none",
  background: "#000",
});

const Player: React.FC = () => {
  const initializationRef = useRef<boolean>(false);
  const { dispatch } = useDigitalTwin();

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log("Player initialization already in progress, skipping...");
      return;
    }

    initializationRef.current = true;

    const onReady = async () => {
      try {
        console.log("Digital Twin Player Ready - Starting initialization...");

        // Reset the 3D scene
        console.log("Resetting 3D scene...");
        await (window as any).fdapi.reset(1 | 2 | 4); // camera + weather + layers

        // Load layer tree data
        console.log("Loading layer tree...");
        const response = await (window as any).fdapi.infoTree.get();
        if (response?.infotree) {
          // Process layer tree to match React context interface
          const layerTree = response.infotree.map((item: any) => ({
            id: item.iD || item.id,
            name: item.name,
            visibility: item.visiblity || false,
            index: item.index,
            parentIndex: item.parentIndex,
            color: item.color || "#ffffff",
            style: item.style || 0,
            type: item.type || "default",
          }));

          dispatch({ type: "SET_LAYER_TREE", payload: layerTree });
          console.log("Layer tree loaded:", layerTree.length, "items");
        }

        console.log("Loading animations...");
        const { data } = await (window as any).fdapi.camera.getAnimationList();

        if (data && Array.isArray(data)) {
          const animationList = [];

          // Process each animation and get its preview image
          for (const item of data) {
            try {
              const { image } = await (
                window as any
              ).fdapi.camera.getAnimationImage(item.name);

              const animationItem = {
                id: item.id,
                name: item.name,
                img: image ? `data:image/png;base64,${image}` : "",
              };

              animationList.push(animationItem);
            } catch (imageError) {
              console.warn(
                `Failed to load image for animation ${item.name}:`,
                imageError
              );
              // Add animation without image
              animationList.push({
                id: item.id,
                name: item.name,
                img: "",
              });
            }
          }

          dispatch({ type: "SET_ANIMATION_LIST", payload: animationList });
          console.log(
            "Animation list loaded:",
            animationList.length,
            "animations"
          );
        }

        // Mark player as ready
        dispatch({ type: "SET_READY_STATE", payload: true });

        console.log("Digital Twin initialization complete");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Failed to initialize Digital Twin:", errorMessage);
      }
    };

    const onEvent = (eventData?: any) => {
      console.log("Digital Twin Event:", eventData);
      // Handle specific events as needed
    };

    console.log("Creating Digital Twin Player (Vue approach)...");

    try {
      new (window as any).DigitalTwinPlayer((window as any).HostConfig.Player, {
        domId: "player",
        apiOptions: {
          onReady: onReady, // React equivalent of _onReady
          onEvent: onEvent, // React equivalent of _onEvent
        },
      });

      console.log("Digital Twin Player created successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Failed to create Digital Twin Player:", errorMessage);
      initializationRef.current = false;
    }

    // Cleanup function - don't destroy player, just reset React state
    return () => {
      console.log("Player component unmounting - resetting React state...");
      dispatch({ type: "SET_READY_STATE", payload: false });
      initializationRef.current = false;
    };
  }, [dispatch]);

  return <PlayerContainer id="player" />;
};

export default Player;
