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
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const apiRef = useRef<any>(null);
  const initializationRef = useRef<boolean>(false);
  const { dispatch } = useDigitalTwin();

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log("Player initialization already in progress, skipping...");
      return;
    }

    const loadSDKAndInitialize = async () => {
      try {
        // Check if SDK is already loaded via script tag
        if ((window as any).DigitalTwinPlayer) {
          console.log("SDK already available via script tag");
          await waitForHostConfigAndInitialize();
          return;
        }

        // Try to dynamically load the script
        console.log("Loading Digital Twin SDK via script tag...");
        await loadScriptDynamically('/aircity/ac.min.js');
        console.log("SDK loaded successfully");
        
        await waitForHostConfigAndInitialize();

      } catch (error) {
        console.error("Failed to load SDK:", error);
        // Try alternative paths
        console.log("Trying alternative path...");
        try {
          await loadScriptDynamically('/ac.min.js');
          await waitForHostConfigAndInitialize();
        } catch (altError) {
          console.error("Failed with alternative path:", altError);
          // Last resort - check if it was loaded via index.html
          if ((window as any).DigitalTwinPlayer) {
            console.log("SDK found via index.html script tag");
            await waitForHostConfigAndInitialize();
          }
        }
      }
    };

    const loadScriptDynamically = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const waitForHostConfigAndInitialize = async () => {
      // Wait for HostConfig to be available
      let attempts = 0;
      while (!window.HostConfig && attempts < 50) {
        console.log("Waiting for HostConfig...");
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.HostConfig) {
        throw new Error("HostConfig not available after 5 seconds");
      }

      if (playerInstanceRef.current) {
        console.log("Player already initialized, skipping...");
        return;
      }

      initializationRef.current = true;
      console.log("SDK and HostConfig ready, initializing player...");
      initializePlayer();
    };

    const initializePlayer = () => {
      if (!playerRef.current) {
        console.error("Player container not ready");
        return;
      }

      try {
        console.log("Creating Digital Twin Player...");

        // Extract host from HostConfig
        const host = window.HostConfig.Player;
        console.log("Connecting to host:", host);

        // Create player instance with options
        const options = {
          domId: "player",
          apiOptions: {
            onReady: () => {
              console.log("Digital Twin Player Ready - Initializing app dependencies...");
              setTimeout(async () => {
                try {
                  await initializeAppDependencies();
                } catch (error) {
                  console.error("Failed to initialize app dependencies:", error);
                }
              }, 200);
            },
            onLog: (s: any, nnl: any) => {
              console.info("logging...");
              var logStr = s + (nnl ? "" : "\n");
              console.info(logStr);
            },
            onEvent: (e: any) => {
              console.log("Digital Twin Event:", e);
            },
          },
          ui: {
            startupInfo: true,
            statusButton: true,
          },
          events: {
            onVideoLoaded: () => {
              console.log("Video stream loaded successfully");
            },
            onConnClose: () => {
              console.log("Connection closed");
              dispatch({ type: "SET_READY_STATE", payload: false });
              initializationRef.current = false;
              playerInstanceRef.current = null;
              apiRef.current = null;
            },
          },
          keyEventTarget: "none",
        };

        console.log("Creating DigitalTwinPlayer with options:", options);

        // Create the player instance using global DigitalTwinPlayer
        const playerInstance = new (window as any).DigitalTwinPlayer(host, options);

        // Try to get API using .getAPI() method if it exists (React-compliant approach)
        if (typeof playerInstance.getAPI === 'function') {
          console.log("Using React-compliant .getAPI() method");
          apiRef.current = playerInstance.getAPI();
        } else {
          console.log("Using standard approach - waiting for window.fdapi");
          // Fallback to waiting for window.fdapi (standard approach)
          apiRef.current = null;
        }

        playerInstanceRef.current = playerInstance;
        
        console.log("Digital Twin Player instance created successfully");
      } catch (error) {
        console.error("Error creating Digital Twin Player:", error);
        initializationRef.current = false;
      }
    };

    const initializeAppDependencies = async () => {
      try {
        console.log("Initializing app dependencies...");

        // Wait for API to be available - either from .getAPI() or window.fdapi
        let api = apiRef.current;
        if (!api && (window as any).fdapi) {
          console.log("Using window.fdapi as API source");
          api = (window as any).fdapi;
          apiRef.current = api;
        }

        if (!api) {
          // Wait for window.fdapi with timeout
          let attempts = 0;
          while (!(window as any).fdapi && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          if ((window as any).fdapi) {
            api = (window as any).fdapi;
            apiRef.current = api;
          } else {
            throw new Error("API not available after waiting");
          }
        }

        console.log("API available, proceeding with initialization...");

        // Set global reference for other components
        (window as any).fdapi = api;

        // Reset the 3D scene
        console.log("Resetting 3D scene...");
        await api.reset(7);

        // Load layer tree data
        console.log("Loading layer tree...");
        const layerInfo = await api.infoTree.get();

        // Load animation data
        console.log("Loading animations...");
        const animationData = await api.camera.getAnimationList();

        // Process layer tree
        const layerTree = layerInfo.infotree.map((item: any) => ({
          id: item.iD || item.id,
          name: item.name,
          visibility: item.visiblity || false,
          index: item.index,
          parentIndex: item.parentIndex,
          color: item.color || "#ffffff",
          style: item.style || 0,
          type: item.type || "default",
        }));

        // Process animations with images
        const animationList = [];
        for (const item of animationData.data) {
          try {
            const { image } = await api.camera.getAnimationImage(item.name);
            animationList.push({
              id: item.id,
              name: item.name,
              img: image ? `data:image/png;base64,${image}` : "",
            });
          } catch (imageError) {
            console.warn(`Failed to load image for animation ${item.name}:`, imageError);
            animationList.push({
              id: item.id,
              name: item.name,
              img: "",
            });
          }
        }

        // Update React context
        dispatch({ type: "SET_LAYER_TREE", payload: layerTree });
        dispatch({ type: "SET_ANIMATION_LIST", payload: animationList });
        dispatch({ type: "SET_READY_STATE", payload: true });

        console.log("Digital Twin initialization complete!");
        console.log("- Layer tree items:", layerTree.length);
        console.log("- Animation items:", animationList.length);
        console.log("- Player ready state: true");
      } catch (error) {
        console.error("Failed to initialize Digital Twin app dependencies:", error);
        initializationRef.current = false;
        throw error;
      }
    };

    // Start the initialization process
    loadSDKAndInitialize();

    // Cleanup function
    return () => {
      console.log("Player component unmounting...");
      if (apiRef.current) {
        try {
          if (typeof apiRef.current.destroy === 'function') {
            apiRef.current.destroy();
            console.log("API instance destroyed");
          }
        } catch (error) {
          console.error("Error destroying API:", error);
        }
        apiRef.current = null;
        (window as any).fdapi = null;
      }

      if (playerInstanceRef.current) {
        try {
          if (typeof playerInstanceRef.current.destroy === "function") {
            playerInstanceRef.current.destroy();
            console.log("Player instance destroyed");
          }
          playerInstanceRef.current = null;
          initializationRef.current = false;
          console.log("Digital Twin Player instance cleaned up");
        } catch (error) {
          console.error("Error cleaning up player:", error);
        }
      }
    };
  }, []);

  return <PlayerContainer id="player" ref={playerRef} />;
};

export default Player;