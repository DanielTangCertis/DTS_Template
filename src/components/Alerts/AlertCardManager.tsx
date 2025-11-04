import React, { useEffect, useRef, useState } from "react";
import { useDigitalTwinService } from "@/services/DigitalTwinService";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { AlertCard } from "./AlertCard";
import { alertData } from "@/data/alertData";
import { mapCategoryToTilelayerIDs } from "@/data/tileLayerData";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";
import { AlertCategory } from "@/types/digitalTwin.types";

interface AffectedItem {
  objectUUIDs: string[];
  tileLayerID: string;
  description: string;
  location: string;
  coordinates: number[];
}

export const AlertCardManager: React.FC = () => {
  const { onAlertCardShow } = useDigitalTwinService();
  const { state, dispatch } = useDigitalTwinContext();
  const {
    setXrayForLayers,
    startBlinkingHighlight,
    stopBlinkingHighlight,
    setCamera,
    focusActors,
  } = useDigitalTwinApi();
  const { xrayColor } = state;

  const xrayedLayersRef = useRef<string[]>([]);
  const highlightTimerRef = useRef<number | null>(null);

  // Track which item is currently selected
  const [selectedItem, setSelectedItem] = useState<{
    type: "upstream" | "main" | "downstream";
    index: number;
  } | null>(null);

  // Track current display values
  const [currentDisplay, setCurrentDisplay] = useState<{
    description: string;
    location: string;
  } | null>(null);

  // Subscribe to alert card show events
  useEffect(() => {
    const unsubscribe = onAlertCardShow((alertKey, position) => {
      const objectUUID = alertKey.replace("alert_", "");

      dispatch({
        type: "SHOW_ALERT_CARD",
        payload: { alertKey: objectUUID, position },
      });

      // Get alert data and set initial display (main item selected by default)
      const alert = alertData.find((a) => a.objectUUID === objectUUID);
      if (alert) {
        setCurrentDisplay({
          description: alert.description,
          location: alert.location,
        });
        setSelectedItem({ type: "main", index: 0 });
      }

      // X-ray setup
      const alertCategory = getCategoryByObjectUUID(objectUUID);
      if (alertCategory === undefined) return unsubscribe;

      const layersToXray = getLayerIDsExcludingCategory(alertCategory);
      xrayedLayersRef.current = layersToXray;
      setXrayForLayers(true, layersToXray, xrayColor);

      // Highlight the main alert object
      const tileLayerID = getTileLayerIDByObjectUUID(objectUUID);
      if (tileLayerID !== undefined) {
        startBlinkingHighlight(
          highlightTimerRef,
          tileLayerID,
          objectUUID,
          [0.75, 0.05, 0.05, 0.1], // on color
          [0.75, 0.05, 0.05, 0], // off color
          1000 // interval
        );
      }
    });

    return unsubscribe;
  }, [
    onAlertCardShow,
    dispatch,
    setXrayForLayers,
    xrayColor,
    startBlinkingHighlight,
  ]);

  const handleAffectedItemClick = (
    item: AffectedItem,
    type: "upstream" | "main" | "downstream",
    index: number
  ) => {
    console.log(`Clicked ${type} item:`, item);

    // 1. Update selected button state
    setSelectedItem({ type, index });

    // 2. Update description and location display
    setCurrentDisplay({
      description: item.description,
      location: item.location,
    });

    // 3. Focus camera on the affected object
    focusActors({ id: item.tileLayerID, objectIds: item.objectUUIDs });

    // if (item.coordinates && item.coordinates.length >= 3) {
    //   setCamera(
    //     item.coordinates[0], // x
    //     item.coordinates[1], // y
    //     item.coordinates[2] + 1, // z offset away from the screen slightly
    //     -12.962612,          // pitch
    //     145.627472,          // yaw
    //     0                     // flyTime
    //   );
    // }

    // 4. Stop current blinking and start new one
    stopBlinkingHighlight(highlightTimerRef, false); // Don't clear highlights yet
    startBlinkingHighlight(
      highlightTimerRef,
      item.tileLayerID,
      item.objectUUIDs,
      [0.75, 0.05, 0.05, 0.1], // on color
      [0.75, 0.05, 0.05, 0], // off color
      1000 // interval
    );
  };

  // Handle closing alert card
  const handleClose = () => {
    dispatch({ type: "HIDE_ALERT_CARD" });

    // Stop blinking and clear highlights
    stopBlinkingHighlight(highlightTimerRef, true);

    // Reset selection state
    setSelectedItem(null);
    setCurrentDisplay(null);

    // Disable XRAY
    if (xrayedLayersRef.current.length > 0) {
      setXrayForLayers(false, xrayedLayersRef.current, undefined);
      xrayedLayersRef.current = [];
    }

    // Return camera to original position
    setCamera(34738.245, 34043.015312, 93.53667, -14.999996, 130.650467, 0);
  };

  // Render
  if (state.activeAlertCard !== null) {
    const activeAlert = state.activeAlertCard;
    const alert = alertData.find((a) => a.objectUUID === activeAlert.alertKey);

    if (!alert) {
      console.warn(`Alert not found for objectUUID: ${activeAlert.alertKey}`);
      return null;
    }

    // Create main item from alert data
    const mainItem: AffectedItem = {
      objectUUIDs: [alert.objectUUID],
      tileLayerID: alert.tileLayerID,
      description: alert.description,
      location: alert.location,
      coordinates: alert.coordinates,
    };

    return (
      <AlertCard
        alert={alert}
        mainItem={mainItem}
        position={activeAlert.position}
        currentDisplay={currentDisplay}
        selectedItem={selectedItem}
        onClose={handleClose}
        onAffectedItemClick={handleAffectedItemClick}
      />
    );
  }

  return null;
};

// Helper functions
const getCategoryByObjectUUID = (
  objectUUID: string
): AlertCategory | undefined => {
  const alert = alertData.find((alert) => alert.objectUUID === objectUUID);
  return alert?.category;
};

const getTileLayerIDByObjectUUID = (objectUUID: string): string | undefined => {
  const alert = alertData.find((alert) => alert.objectUUID === objectUUID);
  return alert?.tileLayerID;
};

export const getLayerIDsForCategory = (category: AlertCategory): string[] => {
  const layers = mapCategoryToTilelayerIDs[category];
  if (!layers) {
    console.warn(`No layers found for category "${category}"`);
    return [];
  }
  return layers.map((layer) => layer.layerID);
};

const getLayerIDsExcludingCategory = (
  excludeCategory: AlertCategory
): string[] => {
  const layerIDs: string[] = [];
  for (const [category, layers] of Object.entries(mapCategoryToTilelayerIDs)) {
    if (category === excludeCategory) continue;
    for (const layer of layers) {
      layerIDs.push(layer.layerID);
    }
  }
  return layerIDs;
};
