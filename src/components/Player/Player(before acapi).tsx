// import React, { useEffect, useRef } from "react";
// import { Box, styled } from "@mui/material";
// import { useDigitalTwin } from "../../contexts/DigitalTwinContext";

// const PlayerContainer = styled(Box)({
//   width: "100%",
//   height: "100%",
//   position: "absolute",
//   top: 0,
//   zIndex: 1,
//   border: "none",
//   background: "#000",
// });

// const Player: React.FC = () => {
//   const playerRef = useRef<HTMLDivElement>(null);
//   const playerInstanceRef = useRef<any>(null);
//   const initializationRef = useRef<boolean>(false);
//   const { dispatch } = useDigitalTwin();

//   useEffect(() => {
//     // Prevent multiple initializations
//     if (initializationRef.current) {
//       console.log("Player initialization already in progress, skipping...");
//       return;
//     }

//     const waitForSDKAndInitialize = () => {
//       // Check if SDK is fully loaded
//       if (!window.DigitalTwinPlayer || !window.HostConfig) {
//         console.log("SDK not ready, retrying in 100ms...");
//         setTimeout(waitForSDKAndInitialize, 100);
//         return;
//       }

//       if (playerInstanceRef.current) {
//         console.log("Player already initialized, skipping...");
//         return;
//       }

//       initializationRef.current = true;
//       console.log("SDK ready, initializing player...");
//       initializePlayer();
//     };

//     const initializePlayer = () => {
//       if (!playerRef.current) {
//         console.error("Player container not ready");
//         return;
//       }

//       try {
//         console.log("Creating Digital Twin Player...");

//         // Extract host from HostConfig (matching vanilla JS pattern)
//         const host = window.HostConfig.Player;
//         console.log("Connecting to host:", host);

//         // Create player instance with options matching vanilla JS exactly
//         const options = {
//           // Required parameter - the domId of the video stream displayed on the web page
//           domId: "player",

//           // Required parameter - API callbacks
//           apiOptions: {
//             onReady: () => {
//               console.log(
//                 "Digital Twin Player Ready - Initializing app dependencies..."
//               );

//               // Use setTimeout to ensure fdapi is fully ready (matching vanilla JS pattern)
//               setTimeout(async () => {
//                 try {
//                   await initializeAppDependencies();
//                 } catch (error) {
//                   console.error(
//                     "Failed to initialize app dependencies:",
//                     error
//                   );
//                 }
//               }, 200); // Slightly longer delay
//             },

//             onLog: (s: any, nnl: any) => {
//               console.info("logging...");
//               var logStr = s + (nnl ? "" : "\n");
//               console.info(logStr);
//             },

//             onEvent: (e: any) => {
//               console.log("Digital Twin Event:", e);
//             },
//           },

//           // UI configuration (matching vanilla JS exactly)
//           ui: {
//             startupInfo: true, // Display page loading details
//             statusButton: true, // Display the status button
//           },

//           // Events configuration (matching vanilla JS exactly)
//           events: {
//             onVideoLoaded: () => {
//               console.log("Video stream loaded successfully");
//             },
//             onConnClose: () => {
//               console.log("Connection closed");
//               // Reset ready state if connection is lost
//               dispatch({ type: "SET_READY_STATE", payload: false });
//               // Reset initialization flag to allow reconnection
//               initializationRef.current = false;
//               playerInstanceRef.current = null;
//             },
//           },

//           // Keyboard event target (matching vanilla JS exactly)
//           keyEventTarget: "none",
//         };

//         console.log("Creating DigitalTwinPlayer with options:", options);

//         // Create the player instance (matching vanilla JS constructor pattern exactly)
//         const playerInstance = new window.DigitalTwinPlayer(host, options);

//         // Store the instance reference
//         playerInstanceRef.current = playerInstance;
//         console.log("Digital Twin Player instance created successfully");
//       } catch (error) {
//         console.error("Error creating Digital Twin Player:", error);
//         initializationRef.current = false; // Reset flag on error
//       }
//     };

//     // App dependencies initialization (matching vanilla JS initializeAppDependencies)
//     const initializeAppDependencies = async () => {
//       try {
//         console.log("Initializing app dependencies...");

//         // Ensure fdapi is available (matching vanilla JS check)
//         if (!window.fdapi) {
//           throw new Error(
//             "fdapi not available - connection may not be established"
//           );
//         }

//         console.log("fdapi available, proceeding with initialization...");

//         // Reset the 3D scene (matching vanilla JS timing and flags)
//         console.log("Resetting 3D scene...");
//         await window.fdapi.reset(7); // 7 = camera + weather + layers

//         // Load layer tree data
//         console.log("Loading layer tree...");
//         const layerInfo = await window.fdapi.infoTree.get();

//         // Load animation data
//         console.log("Loading animations...");
//         const animationData = await window.fdapi.camera.getAnimationList();

//         // Process layer tree (matching your context interface)
//         const layerTree = layerInfo.infotree.map((item: any) => ({
//           id: item.iD || item.id,
//           name: item.name,
//           visibility: item.visiblity || false,
//           index: item.index,
//           parentIndex: item.parentIndex,
//           color: item.color || "#ffffff",
//           style: item.style || 0,
//           type: item.type || "default",
//         }));

//         // Process animations with images
//         const animationList = [];
//         for (const item of animationData.data) {
//           try {
//             const { image } = await window.fdapi.camera.getAnimationImage(
//               item.name
//             );
//             animationList.push({
//               id: item.id,
//               name: item.name,
//               img: image ? `data:image/png;base64,${image}` : "",
//             });
//           } catch (imageError) {
//             console.warn(
//               `Failed to load image for animation ${item.name}:`,
//               imageError
//             );
//             animationList.push({
//               id: item.id,
//               name: item.name,
//               img: "",
//             });
//           }
//         }

//         // Update React context (marking initialization as complete)
//         dispatch({ type: "SET_LAYER_TREE", payload: layerTree });
//         dispatch({ type: "SET_ANIMATION_LIST", payload: animationList });
//         dispatch({ type: "SET_READY_STATE", payload: true });

//         console.log("Digital Twin initialization complete!");
//         console.log("- Layer tree items:", layerTree.length);
//         console.log("- Animation items:", animationList.length);
//         console.log("- Player ready state: true");
//       } catch (error) {
//         console.error(
//           "Failed to initialize Digital Twin app dependencies:",
//           error
//         );
//         initializationRef.current = false; // Reset flag on error
//         throw error;
//       }
//     };

//     // Start the initialization process with SDK waiting
//     waitForSDKAndInitialize();

//     // Cleanup function
//     return () => {
//       console.log("Player component unmounting...");
//       if (playerInstanceRef.current) {
//         try {
//           // Clean up the player instance if it has a destroy method
//           if (typeof playerInstanceRef.current.destroy === "function") {
//             playerInstanceRef.current.destroy();
//             console.log("Player instance destroyed");
//           }
//           playerInstanceRef.current = null;
//           initializationRef.current = false;
//           console.log("Digital Twin Player instance cleaned up");
//         } catch (error) {
//           console.error("Error cleaning up player:", error);
//         }
//       }
//     };
//   }, []); // Empty dependency array - only run once

//   return <PlayerContainer id="player" ref={playerRef} />;
// };

// export default Player;
