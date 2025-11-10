import React, { useEffect, useRef, useState } from "react";
import { AlertCard, AffectedItem } from "./AlertCard";
import { alertData } from "@/data/alertData";
import { AlertCategory } from "@/types/digitalTwin.types";
import { mapCategoryToTilelayerIDs } from "@/data/tileLayerData";
import { CreateCWODialog } from "../CreateCWODialog/CreateCWODialog";
import { useDigitalTwinService } from "@/services/DigitalTwinService";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";

export const AlertCardManager: React.FC = () => {
  const { onAlertCardShow } = useDigitalTwinService();
  const { state, dispatch } = useDigitalTwinContext();
  const {
    setXrayForLayers,
    startBlinkingHighlight,
    stopBlinkingHighlight,
    setCamera,
    focusActor,
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
    assetName: string;
    location: string;
  } | null>(null);

  // save the last position of the card before closing
  const [savedCardPosition, setSavedCardPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Track CWO Dialog
  const [showCWODialog, setShowCWODialog] = useState(false);

  // Subscribe to alert card show events
  useEffect(() => {
    const unsubscribe = onAlertCardShow((alertKey, position) => {
      const objectUUID = alertKey.replace("alert_", "");

      // Use saved position if available, otherwise use center position
      const displayPosition = savedCardPosition || position;

      dispatch({
        type: "SHOW_ALERT_CARD",
        payload: { alertKey: objectUUID, position: displayPosition },
      });

      // Get alert data and set initial display (main item selected by default)
      const alert = alertData.find((a) => a.objectUUID === objectUUID);
      if (alert) {
        setCurrentDisplay({
          assetName: alert.assetName,
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
  }, [onAlertCardShow, dispatch, savedCardPosition, xrayColor]);

  const handleAffectedItemClick = (
    item: AffectedItem,
    type: "upstream" | "main" | "downstream",
    index: number
  ) => {
    console.log(`Clicked ${type} item:`, item);

    // 1. Update selected button state
    setSelectedItem({ type, index });

    // 2. Update assetName and location display
    setCurrentDisplay({
      assetName: item.assetName,
      location: item.location,
    });

    // 3. Focus camera on the affected object
    // if (item.objectUUIDs.length == 1) {
    //   focusActor(item.tileLayerID, item.objectUUIDs[0]);
    // } else {
      focusActors({ id: item.tileLayerID, objectIds: item.objectUUIDs });
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

  // Handle dragging alert card
  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setSavedCardPosition(newPosition);
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

  const handleCreateCWO = () => {
    setShowCWODialog(true);
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
      assetName: alert.assetName,
      location: alert.location,
      coordinates: alert.coordinates,
    };

    return (
      <>
        <AlertCard
          alert={alert}
          mainItem={mainItem}
          position={activeAlert.position}
          currentDisplay={currentDisplay}
          selectedItem={selectedItem}
          onClose={handleClose}
          onAffectedItemClick={handleAffectedItemClick}
          onPositionChange={handlePositionChange}
          onCreateCWO={handleCreateCWO}
        />
        <CreateCWODialog
          open={showCWODialog}
          onClose={() => setShowCWODialog(false)}
          alertData={alert}
        />
      </>
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
