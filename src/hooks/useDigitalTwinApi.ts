import { useCallback, useRef } from "react";
import { changeWeather, WeatherOptions } from "../utils/weatherUtils";
import { MarkerType, FDApi } from "../types/digitalTwin.types";
import { digitalTwinService } from "../services/DigitalTwinService";

export const useDigitalTwinApi = () => {
  const apiRef = useRef<FDApi | null>(null);

  const ensureApiAvailable = useCallback(() => {
    if (!window.fdapi) {
      throw new Error("Digital Twin API not available");
    }
    apiRef.current = window.fdapi;
    return window.fdapi;
  }, []);

  const highlightActorWithColor = useCallback(
    async (
      tileLayerId: string,
      objectIds: string | string[],
      color: number[], //RGBA number[]
      wireframe: boolean //false means solid color
    ) => {
      try {
        const api = ensureApiAvailable();
        await api.tileLayer.highlightActorWithColor(
          tileLayerId,
          objectIds,
          color,
          wireframe
        );
      } catch (error) {
        console.error("Failed to highlight actor:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const stopHighlightAllActors = useCallback(async () => {
    try {
      const api = ensureApiAvailable();
      await api.tileLayer.stopHighlightAllActors();
    } catch (error) {
      console.error("Failed to remove highlights:", error);
      throw error;
    }
  }, [ensureApiAvailable]);

  /**
   * Starts a blinking highlight effect on an actor
   * @param tileLayerID - The tile layer ID
   * @param objectUUID - The object UUID to highlight
   * @param onColor - The highlight color when on (default: red with 0.1 alpha)
   * @param offColor - The highlight color when off (default: red with 0 alpha)
   * @param interval - The blink interval in milliseconds (default: 1000)
   */
  const startBlinkingHighlight = useCallback(
    (
      highlightTimerRef: React.RefObject<number | null>,
      tileLayerID: string,
      objectUUID: string | string[],
      onColor: number[] = [0.75, 0.05, 0.05, 0.5],
      offColor: number[] = [0.75, 0.05, 0.05, 0],
      interval: number = 1000
    ) => {
      // Clear any existing timer first
      stopBlinkingHighlight(highlightTimerRef);

      let isOn = false;

      const blink = () => {
        try {
          const api = ensureApiAvailable();
          const color = isOn ? offColor : onColor;
          api.tileLayer.highlightActorWithColor(
            tileLayerID,
            objectUUID,
            color,
            false
          );
          isOn = !isOn;
        } catch (error) {
          console.error("Failed to toggle highlight:", error);
          stopBlinkingHighlight(highlightTimerRef);
        }
      };

      // Start immediately
      blink();

      // Then continue at intervals
      highlightTimerRef.current = window.setInterval(blink, interval); // Explicitly use window.setInterval

      console.log("Started blinking highlight for:", objectUUID);
    },
    [ensureApiAvailable]
  );

  /**
   * Stops the blinking highlight effect and optionally clears the highlight
   */
  const stopBlinkingHighlight = useCallback(
    (
      highlightTimerRef: React.RefObject<number | null>,
      clearHighlight: boolean = false
    ) => {
      if (highlightTimerRef.current !== null) {
        window.clearInterval(highlightTimerRef.current); // Explicitly use window.clearInterval
        highlightTimerRef.current = null;
        console.log("Stopped blinking highlight");
      }

      if (clearHighlight) {
        try {
          const api = ensureApiAvailable();
          api.tileLayer.stopHighlightAllActors();
        } catch (error) {
          console.error("Failed to clear highlight:", error);
        }
      }
    },
    [ensureApiAvailable]
  );

  // tileLayer: focus on tileLayer
  const focusOnTileLayer = useCallback(
    async (
      ids: string[] | string,
      distance?: number,
      flyTime?: number,
      rotation?: number[]
    ) => {
      try {
        const api = ensureApiAvailable();
        await api.tileLayer.focus(ids, distance, flyTime, rotation);
      } catch (error) {
        console.error("Failed to toggle layer visibility:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const focusActor = useCallback(
    async (
      id: string,
      objectId: string,
      distance?: number,
      flyTime?: number,
      rotation?: number[]
      // distance: number = 1.5,
      // flyTime: number = 0.5,
      // rotation: number[] = [-20, 45, 0]
    ) => {
      try {
        const api = ensureApiAvailable();
        await api.tileLayer.focusActor(
          id,
          objectId,
          distance,
          flyTime,
          rotation
        );
      } catch (error) {
        console.error("Failed to focus on actor:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const focusActors = useCallback(
    async (
      data: { id: string; objectIds: string[] },
      distance?: number,
      flyTime?: number,
      rotation?: number[]
      // distance: number = 1.5,
      // flyTime: number = 0.5,
      // rotation: number[] = [-20, 45, 0]
    ) => {
      try {
        const api = ensureApiAvailable();
        await api.tileLayer.focusActors(data, distance, flyTime, rotation);
      } catch (error) {
        console.error("Failed to focus on actor:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  // infoTree: Layer Management
  const toggleLayerVisibility = useCallback(
    async (id: string, visible: boolean) => {
      try {
        const api = ensureApiAvailable();
        if (visible) {
          await api.infoTree.show(id);
        } else {
          await api.infoTree.hide(id);
        }
        console.log(`Layer ${id} ${visible ? "shown" : "hidden"}`);
      } catch (error) {
        console.error("Failed to toggle layer visibility:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  // tileLayer: Configure styles for specified layers
  const setStyleForTreeLayers = useCallback(
    async (ids: string[] | string, color: number[]) => {
      try {
        const api = ensureApiAvailable();
        await api.tileLayer.setStyle(ids, 1, color); //style 0 for default, 1 for x-ray
        // await api.tileLayer.enableXRay(ids, color);
        console.log("xray enabled for:", ids);
      } catch (error) {
        console.error("Failed to toggle xray mode:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  // tileLayer: toggle xray for specified layers
  const setXrayForLayers = useCallback(
    async (
      xrayState: boolean,
      ids: string[] | string,
      color: number[] | undefined
    ) => {
      try {
        const api = ensureApiAvailable();
        if (xrayState && color !== undefined) {
          //enable if true and vice versa
          await api.tileLayer.enableXRay(ids, color);
          console.log("xray Enabled for:", ids);
        } else {
          await api.tileLayer.disableXRay(ids);
          console.log("xray Disabled for:", ids);
        }
        // await api.tileLayer.enableXRay(ids, color);
      } catch (error) {
        console.error("Failed to toggle xray mode:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  // camera: Animation Control
  const playAnimation = useCallback(
    async (id: string | number) => {
      try {
        const api = ensureApiAvailable();
        await api.camera.playAnimation(id);
        console.log("Playing animation:", id);
      } catch (error) {
        console.error("Failed to play animation:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const startCameraOrbit = useCallback(
    async (
      location: number[],
      rotation: number[],
      distance: number,
      time: number
    ) => {
      try {
        const api = ensureApiAvailable();
        const flightLoop = () => {
          api.camera.flyAround(location, rotation, distance, time);

          // Schedule the NEXT loop iteration
          let timer = setTimeout(flightLoop, time * 1000);

          // Store timer in the service instead of context
          digitalTwinService.setCameraOrbitTimer(timer);
        };

        // Start the very first iteration
        flightLoop();
        console.log("starting camera orbit...");
      } catch (error) {
        console.error("Failed to start camera orbit:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const stopCameraOrbit = useCallback(async () => {
    // Call the service method
    digitalTwinService.stopCameraOrbit();
  }, []);

  const stopAnimation = useCallback(async () => {
    try {
      const api = ensureApiAvailable();
      await api.camera.stopAnimation();
      console.log("Animation stopped");
    } catch (error) {
      console.error("Failed to stop animation:", error);
      throw error;
    }
  }, [ensureApiAvailable]);

  const setCamera = useCallback(
    async (
      x: number,
      y: number,
      z: number,
      pitch: number,
      yaw: number,
      flyTime: number
    ) => {
      const api = ensureApiAvailable();
      api.camera.set(x, y, z, pitch, yaw, flyTime);
    },
    [ensureApiAvailable]
  );

  // reset: Player Control
  const resetPlayer = useCallback(
    async (flags: number = 7) => {
      try {
        const api = ensureApiAvailable();
        await api.reset(flags);
        console.log("Digital Twin scene reset complete");
      } catch (error) {
        console.error("Failed to reset player:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  // settings: UI visibility
  const setMainUIVisibility = useCallback(
    (visible: boolean) => {
      try {
        const api = ensureApiAvailable();
        api.settings.setMainUIVisibility(visible);
      } catch (error) {
        console.error("Failed to set UI visibility:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  // weather: Weather Control
  const setWeatherTime = useCallback(
    async (hour: number, minute: number) => {
      try {
        const api = ensureApiAvailable();
        if (api.weather?.setDateTime) {
          const now = new Date();
          await api.weather.setDateTime(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            hour,
            minute
          );
          console.log(
            `Time set to ${hour}:${minute.toString().padStart(2, "0")}`
          );
        }
      } catch (error) {
        console.error("Failed to set weather time:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const setDarkMode = useCallback(
    async (isDark: boolean) => {
      try {
        const api = ensureApiAvailable();
        if (api.weather?.setDarkMode) {
          await api.weather.setDarkMode(isDark);
          console.log("Dark mode:", isDark ? "enabled" : "disabled");
        }
      } catch (error) {
        console.error("Failed to set dark mode:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const resetWeather = useCallback(async () => {
    try {
      const api = ensureApiAvailable();
      // Reset with weather and environment flags (2 | 4 = 6)
      await api.reset(6);
      console.log("Weather reset to default");
    } catch (error) {
      console.error("Failed to reset weather:", error);
      throw error;
    }
  }, [ensureApiAvailable]);

  // Advanced weather control using weatherUtils
  const updateWeather = useCallback(async (options: WeatherOptions) => {
    try {
      changeWeather(options);
      console.log("Weather updated with options:", options);
    } catch (error) {
      console.error("Failed to update weather:", error);
      throw error;
    }
  }, []);

  // Toggle for all kinds of Markers (alerts,cameras etc.) should use the same logic
  const toggleMarkersWithState = useCallback(
    async (isCurrentlyShown: boolean, IDs: string[]) => {
      try {
        const api = ensureApiAvailable();

        if (isCurrentlyShown) {
          // Hide markers
          api.marker.hide(IDs);
          return false; // Return new state
        } else {
          // Show markers
          api.marker.show(IDs);
          return true; // Return new state
        }
      } catch (error) {
        console.error("Failed to toggle markers:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const createMarker = (
    api: FDApi,
    markerType: MarkerType,
    data: any[] //this should be an array of arrays of data for each floor
  ) => {
    const Icon = new Image();
    const IconOnHover = new Image();
    // marker data
    let markerProps: any = [];
    const htmlElement = document.documentElement;
    const computedStyle = window.getComputedStyle(htmlElement);
    const fontSize = parseFloat(computedStyle.getPropertyValue("font-size")); //gets the page default font size in pixels, usually 16px
    let _imageSize = 4 * fontSize;
    switch (markerType) {
      case "ALERT":
        Icon.src = "/assets/icons/events.png"; //MUST USE PNG
        IconOnHover.src = "/assets/icons/events512.png"; //MUST USE PNG
        markerProps = data.map((item: any) => {
          return {
            id: "alert_" + item.objectUUID,
            coordinate: item.coordinates,
            coordinateType: 0, //default 0 is the projection coordinate system, can also be set to latitude and longitude space coordinate system value of 1
            anchors: [-0.5 * _imageSize, _imageSize], // (-0.5x, y) -> see imageSize
            range: [0, 10000], //visual range [10, 10000]
            imagePath: Icon.src,
            // hoverImagePath: AlertIconOnHover.src,
            imageSize: [_imageSize, _imageSize], // the size of the image
            // imageSize: [32, 32], // the size of the image
            fixedSize: false, // image fixed size, range of values: false adaptive, near large, far small, true fixed size, default value: false
            text: item.description, //the text to be displayed
            useTextAnimation: false, //turn on the text expansion animation effect
            textRange: [0, 500], //the visible range of the text [near-crop distance, far-crop distance]
            textOffset: [0, 0], // text offset
            textBackgroundColor: [0, 0, 0, 0], // text background color
            fontSize: fontSize, // font size
            fontOutlineSize: 1, // font outline size
            fontColor: "#ffffff",
            fontOutlineColor: "#000000",
            priority: 0, // the priority of avoidance
            occlusionCull: false, // Whether to participate in occlusion culling
          };
        });

        break;
      case "CAMERA":
        Icon.src = "/assets/icons/cctv.png";
        IconOnHover.src = "/assets/icons/cctv.png";

        //FLATTEN the data to a single array
        markerProps = data.flat().map((item: any) => {
          return {
            id: "camera_" + item.UUID,
            coordinate: item.location,
            coordinateType: 0, //default 0 is the projection coordinate system, can also be set to latitude and longitude space coordinate system value of 1
            anchors: [-0.5 * _imageSize, _imageSize], // (-0.5x, y) -> see imageSize
            range: [0, 500], //visual range [10, 10000]
            imagePath: Icon.src,
            hoverImagePath: IconOnHover.src,
            imageSize: [_imageSize, _imageSize], // the size of the image
            fixedSize: false, // image fixed size, range of values: false adaptive, near large, far small, true fixed size, default value: false
            // text: item.AssetName //the text to be displayed
            useTextAnimation: false, //turn on the text expansion animation effect
            textRange: [0, 500], //the visible range of the text [near-crop distance, far-crop distance]
            textOffset: [0, 0], // text offset
            textBackgroundColor: [0, 0, 0, 0], // text background color
            fontSize: fontSize, // font size
            fontOutlineSize: 1, // font outline size
            fontColor: "#ffffff",
            fontOutlineColor: "#000000",
            popupURL: `https://10.238.30.117/stream.html?id=${item.CameraConfigId}`,
            popupBackgroundColor: [1.0, 1.0, 1.0, 1], //Popup background color
            popupSize: [820, 462], //the size of the popup window
            popupOffset: [0, 0], //offset of the popup
            showLine: false, //whether to show the vertical traction line below the markup point
            lineSize: [2, 50], //the width and height of the vertical tractor line [width, height]
            lineColor: [
              0.2274509803921569, 0.8156862745098039, 0.9843137254901961, 1,
            ], //color of vertical traction line
            lineOffset: [0, 0], //vertical traction line offset
            autoHidePopupWindow: true, //whether to close the popup window automatically after losing focus
            autoHeight: false, // Auto determine if there is an object below
            displayMode: 2, // display mode
            priority: 0, // the priority of avoidance
            occlusionCull: false, // Whether to participate in occlusion culling
          };
        });

        break;
      case "OFFICER":
        //FLATTEN the data to a single array
        markerProps = data.map(
          (item: {
            name: string;
            picture: string;
            coordinates: number[];
            contact: string;
          }) => {
            Icon.src = item.picture;
            IconOnHover.src = item.picture;
            return {
              id: "officer_" + item.name,
              coordinate: item.coordinates,
              coordinateType: 0, //default 0 is the projection coordinate system, can also be set to latitude and longitude space coordinate system value of 1
              anchors: [-0.5 * _imageSize, _imageSize], // (-0.5x, y) -> see imageSize
              range: [0, 500], //visual range [10, 10000]
              imagePath: Icon.src,
              hoverImagePath: IconOnHover.src,
              imageSize: [_imageSize, _imageSize], // the size of the image
              fixedSize: false, // image fixed size, range of values: false adaptive, near large, far small, true fixed size, default value: false
              // text: item.name //the text to be displayed
              useTextAnimation: false, //turn on the text expansion animation effect
              textRange: [0, 500], //the visible range of the text [near-crop distance, far-crop distance]
              textOffset: [0, 0], // text offset
              textBackgroundColor: [0, 0, 0, 0], // text background color
              fontSize: fontSize, // font size
              fontOutlineSize: 1, // font outline size
              fontColor: "#ffffff",
              fontOutlineColor: "#000000",
              showLine: false, //whether to show the vertical traction line below the markup point
              lineSize: [2, 50], //the width and height of the vertical tractor line [width, height]
              lineColor: [
                0.2274509803921569, 0.8156862745098039, 0.9843137254901961, 1,
              ], //color of vertical traction line
              lineOffset: [0, 0], //vertical traction line offset
              autoHidePopupWindow: true, //whether to close the popup window automatically after losing focus
              autoHeight: false, // Auto determine if there is an object below
              displayMode: 2, // display mode
              priority: 0, // the priority of avoidance
              occlusionCull: false, // Whether to participate in occlusion culling
            };
          }
        );

        break;
      default:
        Icon.src = "/assets/icons/events.png";
        IconOnHover.src = "/assets/icons/events512.png";
        break;
    }
    api.marker.add(markerProps);
  };

  /*OD Lines*/
  /***
   * @param startEndPairs - [[[startX1,startY1,startZ1], [endX1,endY1,endZ1]] , [[startX2,startY2,startZ2], [endX2,endY2,endZ2]]...]
   */
  const addODLines = useCallback(
    async (linesConfig: Array<{ id: string; coordinates: number[][] }>) => {
      try {
        const api = ensureApiAvailable();
        let linesToAdd: any = [];
        linesToAdd = linesConfig.map((config) => {
          return {
            id: config.id,
            coordinates: config.coordinates,
            color: "RGB(255,0,0)", //Red
            coordinateType: 0,
            flowRate: 0.5,
            intensity: 10,
            bendDegree: 0.5,
            tiling: 10,
            lineThickness: 0.25,
            flowPointSizeScale: 1,
            labelSizeScale: 15, //this shows the effect of the radius at start and end points

            lineShape: 1, //0:plane 1:column, default 1
            lineStyle: 3, //0: Solid Color 1: Arrow, 2: Flowing Point, 3: Dotted Line; Style default value 0 (it is recommended to set Tiling manually when lineStyle is 2 and 3, e.g. set to 1)
            flowShape: 0, //1 to show the movement from start to end as a sphere

            startPointShape: 0, //1 for sphere
            endPointShape: 0, //1 for sphere
            startLabelShape: 1,
            endLabelShape: 1,
          };
        });
        await api.odline.add(linesToAdd);
        console.log("Added ODLines");
      } catch (error) {
        console.error("Failed to add ODLines:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const deleteODLines = useCallback(
    async (ids: string | string[]) => {
      try {
        const api = ensureApiAvailable();
        await api.odline.delete(ids);
        console.log(`Deleted ODLines: ${ids}`);
      } catch (error) {
        console.error("Failed to delete ODLines:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const clearODLines = useCallback(async () => {
    try {
      const api = ensureApiAvailable();
      await api.odline.clear();
      console.log("Cleared ODLines");
    } catch (error) {
      console.error("Failed to clear ODLines:", error);
      throw error;
    }
  }, [ensureApiAvailable]);

  const focusODLines = useCallback(
    async (
      ids: string | string[],
      distance: number = 0, //0 for autocalculate
      flyTime: number = 0.5, //0.5 seconds
      rotation?: number[]
    ) => {
      try {
        const api = ensureApiAvailable();
        await api.odline.focus(ids, distance, flyTime, rotation);
        console.log(`Focused on ODLines: ${ids}`);
      } catch (error) {
        console.error("Failed to focus on ODLines:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  const setODLineColor = useCallback(
    async (id: string, newVal: string) => {
      try {
        const api = ensureApiAvailable();
        await api.odline.setColor(id, newVal);
        console.log(`Set ODLine Color: ${newVal}`);
      } catch (error) {
        console.error("Failed to change ODLine color:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  return {
    // tileLayer Management
    toggleLayerVisibility,
    setStyleForTreeLayers,
    setXrayForLayers,
    focusOnTileLayer,
    focusActor,
    focusActors,
    highlightActorWithColor,
    stopHighlightAllActors,
    startBlinkingHighlight,
    stopBlinkingHighlight,

    // Animation Control
    playAnimation,
    stopAnimation,

    // Player Control
    resetPlayer,
    setMainUIVisibility,

    // Weather Control
    setWeatherTime,
    setDarkMode,
    resetWeather,
    updateWeather,

    // Camera Controls
    startCameraOrbit,
    stopCameraOrbit,
    setCamera,

    //Markers
    toggleMarkersWithState,
    createMarker,
    MarkerType,

    //ODLine
    addODLines,
    deleteODLines,
    clearODLines,
    focusODLines,
    setODLineColor,
  };
};
