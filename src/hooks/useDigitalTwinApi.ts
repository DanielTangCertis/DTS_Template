import { useCallback, useRef } from "react";
import { changeWeather, WeatherOptions } from "../utils/weatherUtils";
import { FDApi } from "../types/digitalTwin.types";

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
  };
};
