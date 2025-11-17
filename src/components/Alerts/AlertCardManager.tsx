import React, { useEffect, useRef, useState } from "react";
import {
  PrimaryAlertCard,
  SecondaryAlertCard,
  AffectedItem,
  SecondaryCardData,
  MergedItemData,
  CARD_CONSTANTS,
} from "./AlertCard";
import { alertData } from "@/data/alertData";
import { AlertCategory } from "@/types/digitalTwin.types";
import { mapCategoryToTilelayerIDs } from "@/data/tileLayerData";
import { useDigitalTwinService } from "@/services/DigitalTwinService";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";

// Constants
const INCIDENT_MANAGEMENT_URL = "https://your-incident-management-url.com"; // TODO: Replace with actual URL
const OD_LINE_COLOR_GREEN = "RGB(0,255,0)";

export const AlertCardManager: React.FC = () => {
  const { onAlertCardShow } = useDigitalTwinService();
  const { state, dispatch } = useDigitalTwinContext();
  const {
    setXrayForLayers,
    startBlinkingHighlight,
    stopBlinkingHighlight,
    setCamera,
    focusActors,
    addODLines,
    clearODLines,
    deleteODLines,
    focusODLines,
    setODLineColor,
  } = useDigitalTwinApi();
  const { xrayColor } = state;

  const xrayedLayersRef = useRef<string[]>([]);
  const highlightTimerRef = useRef<number | null>(null);

  // Non-security alert state (existing)
  const [selectedItem, setSelectedItem] = useState<{
    type: "upstream" | "main" | "downstream";
    index: number;
  } | null>(null);

  const [currentDisplay, setCurrentDisplay] = useState<{
    assetName: string;
    location: string;
  } | null>(null);

  // Security alert state (new)
  const [selectedSecurityItems, setSelectedSecurityItems] = useState<
    Array<{ type: "upstream" | "downstream"; index: number }>
  >([]);

  const [secondaryCards, setSecondaryCards] = useState<SecondaryCardData[]>([]);

  const [mergedItems, setMergedItems] = useState<MergedItemData[]>([]);

  const [dismissedItems, setDismissedItems] = useState<
    Array<{ type: "upstream" | "downstream"; index: number }>
  >([]);

  // Shared state
  const [savedCardPosition, setSavedCardPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: window.innerWidth * CARD_CONSTANTS.PRIMARY_INITIAL_TOPX,
    y: window.innerHeight * CARD_CONSTANTS.PRIMARY_INITIAL_TOPY,
  });

  const [baseFontSize, setBaseFontSize] = useState(0);

  // Calculate base font size and store in state
  useEffect(() => {
    const size = getBaseFontSizeInPixels();
    setBaseFontSize(size);
  }, []);

  // Subscribe to alert card show events
  useEffect(() => {
    const unsubscribe = onAlertCardShow(async (alertKey, position) => {
      const objectUUID = alertKey.replace("alert_", "");

      // Use saved position if available, otherwise use center position
      const displayPosition = savedCardPosition || position;

      dispatch({
        type: "SHOW_ALERT_CARD",
        payload: { alertKey: objectUUID, position: displayPosition },
      });

      // Get alert data
      const alert = alertData.find((a) => a.objectUUID === objectUUID);
      if (!alert) return unsubscribe;

      // Set initial display for non-security alerts (main item selected by default)
      if (alert.category !== AlertCategory.SECURITY) {
        setCurrentDisplay({
          assetName: alert.assetName,
          location: alert.location,
        });
        setSelectedItem({ type: "main", index: 0 });
      } else {
        // For security alerts, create initial main→main OD line
        const mainCoords = alert.coordinates;
        await addODLines([
          {
            id: "od_main_0",
            coordinates: [mainCoords, mainCoords],
          },
        ]);
        // await focusODLines(["od_main_0"]); //try using focusActors instead
        // focusActors(data:{alert.tileLayerID,alert.objectUUID});
      }

      // X-ray setup
      if (alert.assetName.startsWith("PLGN")) {
        // e.g. PLGN-L1-SY-CAM-21
        const match = alert.assetName.match(/-L(\d+)-/); // this expression searches for level string contained between hyphens e.g. -L12-
        let alertFloor = match ? match[1] : null;
        if (alertFloor) {
          if (alertFloor.length == 1) {
            // if single digit, add a 0 in front to match the tileLayerData layerName convention
            alertFloor = "GN0" + alertFloor;
          } else {
            alertFloor = "GN" + alertFloor;
          }
          let layersToExclude = getLayerIDsByPrefix(alertFloor).concat(
            alert.tileLayerID
          );
          const layersToXray = getLayerIDsExcluding(
            // alert.category,
            layersToExclude
          );
          xrayedLayersRef.current = layersToXray;
          console.log("preparing layers to xray...");
          console.log(
            `alertFloor: ${alertFloor}`,
            `layersToExclude: ${layersToExclude}`,
            `layersToXray: ${layersToXray}`
          );
          setXrayForLayers(true, layersToXray, xrayColor);
        }
      }

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
    savedCardPosition,
    xrayColor,
    addODLines,
    focusODLines,
  ]);

  // ==================== NON-SECURITY HANDLERS ====================

  const handleNonSecurityAffectedItemClick = (
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
    focusActors({ id: item.tileLayerID, objectIds: item.objectUUIDs });

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

  // ==================== SECURITY HANDLERS ====================

  const handleSecurityAffectedItemClick = async (
    item: AffectedItem,
    type: "upstream" | "downstream",
    index: number,
    alert: (typeof alertData)[0]
  ) => {
    console.log(`Clicked security ${type} item:`, item);

    // Check if item is already selected
    const isSelected = selectedSecurityItems.some(
      (selectedItem) =>
        selectedItem.type === type && selectedItem.index === index
    );

    const lineId = `od_${type}_${index}`;

    if (isSelected) {
      // DESELECT: Toggle OFF - Remove from selection and delete OD line
      setSelectedSecurityItems((prev) =>
        prev.filter((s) => !(s.type === type && s.index === index))
      );

      setSecondaryCards((prev) =>
        prev.filter((card) => !(card.type === type && card.index === index))
      );

      // Delete this specific OD line
      await deleteODLines([lineId]);

      // Focus on remaining lines
      const remainingIds = getAllCurrentLineIds(
        selectedSecurityItems.filter(
          (s) => !(s.type === type && s.index === index)
        ),
        mergedItems
      );

      if (remainingIds.length > 0) {
        await focusODLines(remainingIds);
      } else {
        // No lines left, create and focus on main→main
        const mainCoords = alert.coordinates;
        await addODLines([
          {
            id: "od_main_0",
            coordinates: [mainCoords, mainCoords],
          },
        ]);
        await focusODLines(["od_main_0"]);
      }
    } else {
      // SELECT: Toggle ON - Add to selection and create OD line
      setSelectedSecurityItems((prev) => [...prev, { type, index }]);

      // Create new secondary card
      const newCardPosition = calculateSecondaryCardPosition(
        baseFontSize,
        savedCardPosition,
        secondaryCards.length
      );

      const newSecondaryCard: SecondaryCardData = {
        item: { ...item, description: item.description || item.assetName },
        type,
        index,
        position: newCardPosition,
        id: `${type}-${index}`,
      };

      setSecondaryCards((prev) => [...prev, newSecondaryCard]);

      // Create OD line for this new item only
      const mainCoords = alert.coordinates;
      const itemCoords = item.coordinates;

      const startEndPair: number[][] =
        type === "upstream"
          ? [itemCoords, mainCoords] // upstream → main
          : [mainCoords, itemCoords]; // main → downstream

      // Pass custom ID and coordinates to addODLines
      await addODLines([
        {
          id: lineId,
          coordinates: startEndPair,
        },
      ]);

      // Focus on ALL current line IDs (including newly added)
      const allIds = getAllCurrentLineIds(
        [...selectedSecurityItems, { type, index }],
        mergedItems
      );
      await focusODLines(allIds);
    }
  };

  const handleSecondaryCardYes = async (
    item: AffectedItem,
    type: "upstream" | "downstream",
    index: number
  ) => {
    console.log(`Merging ${type} item:`, item);

    const lineId = `od_${type}_${index}`;

    // 1. Add to merged items
    const newMergedItem: MergedItemData = {
      description: item.description || item.assetName,
      type,
      index,
    };
    setMergedItems((prev) => [...prev, newMergedItem]);

    // 2. Change OD line color to green
    await setODLineColor(lineId, OD_LINE_COLOR_GREEN);

    // 3. Remove from selected security items
    setSelectedSecurityItems((prev) =>
      prev.filter((s) => !(s.type === type && s.index === index))
    );

    // 4. Close this secondary card
    setSecondaryCards((prev) =>
      prev.filter((card) => !(card.type === type && card.index === index))
    );

    // Reposition remaining secondary cards
    repositionSecondaryCards();
  };

  const handleSecondaryCardNo = async (
    item: AffectedItem,
    type: "upstream" | "downstream",
    index: number
  ) => {
    console.log(`Dismissing ${type} item:`, item);

    const lineId = `od_${type}_${index}`;

    // 1. Add to dismissed items
    setDismissedItems((prev) => [...prev, { type, index }]);

    // 2. Remove from selected security items
    setSelectedSecurityItems((prev) =>
      prev.filter((s) => !(s.type === type && s.index === index))
    );

    // 3. Delete specific OD line
    await deleteODLines([lineId]);

    // 4. Close this secondary card
    setSecondaryCards((prev) =>
      prev.filter((card) => !(card.type === type && card.index === index))
    );

    // 5. Focus on remaining lines or create main→main if none left
    const remainingIds = getAllCurrentLineIds(
      selectedSecurityItems.filter(
        (s) => !(s.type === type && s.index === index)
      ),
      mergedItems
    );

    if (remainingIds.length > 0) {
      await focusODLines(remainingIds);
    } else {
      // No lines left, create and focus on main→main
      const activeAlert = state.activeAlertCard;
      if (activeAlert) {
        const alert = alertData.find(
          (a) => a.objectUUID === activeAlert.alertKey
        );
        if (alert) {
          const mainCoords = alert.coordinates;
          await addODLines([
            {
              id: "od_main_0",
              coordinates: [mainCoords, mainCoords],
            },
          ]);
          await focusODLines(["od_main_0"]);
        }
      }
    }

    // Reposition remaining secondary cards
    repositionSecondaryCards();
  };

  const repositionSecondaryCards = () => {
    setSecondaryCards((prev) =>
      prev.map((card, index) => ({
        ...card,
        position: calculateSecondaryCardPosition(
          baseFontSize,
          savedCardPosition,
          index
        ),
      }))
    );
  };

  // ==================== SHARED HANDLERS ====================

  const handleAffectedItemClick = (
    item: AffectedItem,
    type: "upstream" | "main" | "downstream",
    index: number
  ) => {
    const activeAlert = state.activeAlertCard;
    if (!activeAlert) return;

    const alert = alertData.find((a) => a.objectUUID === activeAlert.alertKey);
    if (!alert) return;

    // Route to appropriate handler based on category
    if (alert.category === AlertCategory.SECURITY) {
      // Security alerts don't have a "main" button that should be clickable
      if (type !== "main") {
        handleSecurityAffectedItemClick(
          item,
          type as "upstream" | "downstream",
          index,
          alert
        );
      }
    } else {
      handleNonSecurityAffectedItemClick(item, type, index);
    }
  };

  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setSavedCardPosition(newPosition);

    // Reposition secondary cards relative to new primary position
    if (secondaryCards.length > 0) {
      setSecondaryCards((prev) =>
        prev.map((card, index) => ({
          ...card,
          position: calculateSecondaryCardPosition(
            baseFontSize,
            newPosition,
            index
          ),
        }))
      );
    }
  };

  const handleClose = async () => {
    // Clear OD Lines first
    await clearODLines();

    dispatch({ type: "HIDE_ALERT_CARD" });

    // Stop blinking and clear highlights
    stopBlinkingHighlight(highlightTimerRef, true);

    // Reset all state
    setSelectedItem(null);
    setCurrentDisplay(null);
    setSelectedSecurityItems([]);
    setSecondaryCards([]);
    setMergedItems([]);
    setDismissedItems([]);

    // Disable XRAY
    if (xrayedLayersRef.current.length > 0) {
      setXrayForLayers(false, xrayedLayersRef.current, undefined);
      xrayedLayersRef.current = [];
    }

    // Return camera to original position
    setCamera(34738.245, 34043.015312, 93.53667, -14.999996, 130.650467, 0);
  };

  const handleSubmitToIncidentManagement = async () => {
    console.log("Submitting to Incident Management");

    // Clear OD Lines first
    await clearODLines();

    // Open external URL
    window.open(INCIDENT_MANAGEMENT_URL, "_blank");

    // Close the alert card with same logic as handleClose (minus OD line clearing since already done)
    dispatch({ type: "HIDE_ALERT_CARD" });

    // Stop blinking and clear highlights
    stopBlinkingHighlight(highlightTimerRef, true);

    // Reset all state
    setSelectedItem(null);
    setCurrentDisplay(null);
    setSelectedSecurityItems([]);
    setSecondaryCards([]);
    setMergedItems([]);
    setDismissedItems([]);

    // Disable XRAY
    if (xrayedLayersRef.current.length > 0) {
      setXrayForLayers(false, xrayedLayersRef.current, undefined);
      xrayedLayersRef.current = [];
    }

    // Return camera to original position
    setCamera(34738.245, 34043.015312, 93.53667, -14.999996, 130.650467, 0);
  };

  // ==================== RENDER ====================

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
        {/* Primary Alert Card */}
        <PrimaryAlertCard
          alert={alert}
          mainItem={mainItem}
          position={activeAlert.position}
          currentDisplay={currentDisplay}
          selectedItem={selectedItem}
          selectedSecurityItems={selectedSecurityItems}
          mergedItems={mergedItems}
          dismissedItems={dismissedItems}
          onClose={handleClose}
          onAffectedItemClick={handleAffectedItemClick}
          onPositionChange={handlePositionChange}
          onSubmitToIncidentManagement={handleSubmitToIncidentManagement}
        />

        {/* Secondary Alert Cards (Security only) */}
        {alert.category === AlertCategory.SECURITY &&
          secondaryCards.map((card) => (
            <SecondaryAlertCard
              key={card.id}
              item={card.item}
              type={card.type}
              index={card.index}
              position={card.position}
              onYes={handleSecondaryCardYes}
              onNo={handleSecondaryCardNo}
            />
          ))}
      </>
    );
  }

  return null;
};

// ==================== HELPER FUNCTIONS ====================

const calculateSecondaryCardPosition = (
  baseFontSize: number,
  primaryPosition: { x: number; y: number },
  cardIndex: number
): { x: number; y: number } => {
  const gap = 1 * baseFontSize; // 1rem convert to pixels
  const offsetX = 1 * baseFontSize; // 1rem convert to pixels

  return {
    x:
      primaryPosition.x + CARD_CONSTANTS.PRIMARY_WIDTH * baseFontSize + offsetX,
    y:
      primaryPosition.y +
      cardIndex * (CARD_CONSTANTS.SECONDARY_HEIGHT * baseFontSize + gap),
  };
};

/**
 * Get all current OD Line IDs from selected and merged items
 */
const getAllCurrentLineIds = (
  selectedItems: Array<{ type: "upstream" | "downstream"; index: number }>,
  mergedItems: MergedItemData[]
): string[] => {
  const ids: string[] = [];

  // Add selected items (red lines)
  selectedItems.forEach((item) => {
    ids.push(`od_${item.type}_${item.index}`);
  });

  // Add merged items (green lines)
  mergedItems.forEach((item) => {
    ids.push(`od_${item.type}_${item.index}`);
  });

  return ids;
};

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

const getLayerNameByID = (layerID: string): string | undefined => {
  // Iterate through all categories
  for (const category of Object.values(mapCategoryToTilelayerIDs)) {
    // Search through layers in this category
    const layer = category.find((layer) => layer.layerID === layerID);

    if (layer) {
      return layer.layerName;
    }
  }

  // Layer ID not found
  return undefined;
};

/**
 * Get all layer IDs for layers whose names start with a given prefix (e.g., floor prefix)
 * @param prefix - The prefix to search for (e.g., "GN01", "GS02")
 * @returns Array of layer IDs matching the prefix
 *
 * @example
 * getLayerIDsByPrefix("GN01")
 * // Returns all layer IDs for layers starting with "GN01" like:
 * // ["D7D30CC2435CD292CD797AB65B672B2D", "3F8BA494464DD9B8D5CFB2AFE6FB0BDC", "D1436A0344BBCDB1692D69A888B4A2C3"]
 */
const getLayerIDsByPrefix = (prefix: string): string[] => {
  const matchingLayerIDs: string[] = [];

  // Iterate through all categories
  for (const layers of Object.values(mapCategoryToTilelayerIDs)) {
    // Search through layers in this category
    for (const layer of layers) {
      if (layer.layerName.startsWith(prefix)) {
        matchingLayerIDs.push(layer.layerID);
      }
    }
  }

  return matchingLayerIDs;
};

// const getLayerIDsForCategory = (category: AlertCategory): string[] => {
//   const layers = mapCategoryToTilelayerIDs[category];
//   if (!layers) {
//     console.warn(`No layers found for category "${category}"`);
//     return [];
//   }
//   return layers.map((layer) => layer.layerID);
// };

const getLayerIDsExcluding = (excludeLayers: string[]): string[] => {
  const layerIDs: string[] = [];
  for (const [category, layers] of Object.entries(mapCategoryToTilelayerIDs)) {
    for (const layer of layers) {
      //always show the ground level
      if (
        layer.layerName === "GN_GroundLevel" ||
        layer.layerName === "GS_GroundLevel" ||
        excludeLayers.includes(layer.layerID)
      )
        continue;
      layerIDs.push(layer.layerID);
    }
  }
  return layerIDs;
};

const getBaseFontSizeInPixels = (): number => {
  const htmlElement = document.documentElement;
  const computedStyle = window.getComputedStyle(htmlElement);
  const fontSize = computedStyle.getPropertyValue("font-size");
  return parseFloat(fontSize);
};
