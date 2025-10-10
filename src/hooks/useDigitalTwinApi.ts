import { useCallback, useRef } from "react";
import { changeWeather, WeatherOptions } from "../utils/weatherUtils";
import { Coordinates, FDApi } from "../types/digitalTwin.types";

export const useDigitalTwinApi = () => {
  const apiRef = useRef<FDApi | null>(null);

  const ensureApiAvailable = useCallback(() => {
    if (!window.fdapi) {
      throw new Error("Digital Twin API not available");
    }
    apiRef.current = window.fdapi;
    return window.fdapi;
  }, []);

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

  // camera: Orbit camera around the 3D scene
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

          // Schedule the NEXT loop iteration to start after the current one finishes.
          setTimeout(flightLoop, time * 1000);
        };

        // Start the very first iteration of the loop.
        flightLoop();
        console.log("starting camera orbit...");
      } catch (error) {
        console.error("Failed to start camera orbit:", error);
        throw error;
      }
    },
    [ensureApiAvailable]
  );

  // const stopCameraOrbit = useCallback(async );

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

  // Markers
  const toggleAlertMarkersWithState = useCallback(
    async (isCurrentlyShown: boolean, alertCoordinates: Coordinates[]) => {
      try {
        const api = ensureApiAvailable();

        if (isCurrentlyShown) {
          // Clear existing markers
          api.marker.clear();
          return false; // Return new state
        } else {
          // Create markers
          for (let i = 0; i < alertCoordinates.length; i++) {
            createMarker(api, alertCoordinates[i], i);
          }
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
    alertCoords: Coordinates,
    alertIndex: number
  ) => {
    const AlertIcon = new Image();
    AlertIcon.src = "/assets/icons/warning_filled_EA3323.svg";
    const AlertIconOnHover = new Image();
    AlertIconOnHover.src = "/assets/icons/warning_twotone_EA3323.svg";
    // Construct marker with popup window
    let o = {
      id: "alert" + alertIndex,
      coordinate: [alertCoords.x, alertCoords.y, alertCoords.z], //coordinate position
      coordinateType: 0, //default 0 is the projection coordinate system, can also be set to latitude and longitude space coordinate system value of 1
      anchors: [0, 100], //Anchors control the overall offset of the marker
      range: [0, 10000], //visual range

      imagePath: AlertIcon.src,
      hoverImagePath: AlertIconOnHover.src,
      // imageSize: [32, 32], // the size of the image
      fixedSize: true, // image fixed size, range of values: false adaptive, near large, far small, true fixed size, default value: false

      text: "alert" + alertIndex, //the text to be displayed
      useTextAnimation: false, //turn on the text expansion animation effect
      textRange: [0, 10000], //the visible range of the text [near-crop distance, far-crop distance]
      textOffset: [0, 0], // text offset
      textBackgroundColor: [0, 0, 0, 0], // text background color
      fontSize: 10, // font size
      fontOutlineSize: 1, // font outline size
      fontColor: "#ffffff",
      fontOutlineColor: "#000000",

      popupURL: "http://www.google.com", //Popup HTML link
      popupBackgroundColor: [1.0, 1.0, 1.0, 1], //Popup background color
      popupSize: [600, 580], //the size of the popup window
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
    api.marker.add(o);
  };

  return {
    // Layer Management
    toggleLayerVisibility,
    setStyleForTreeLayers,
    setXrayForLayers,
    focusOnTileLayer,

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

    //Markers
    toggleAlertMarkersWithState,
  };
};
