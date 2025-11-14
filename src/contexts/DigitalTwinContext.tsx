import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AnimationItem } from "@/components/AnimatedTours/AnimatedTours";
import { LayerTreeItem } from "@/components/LayerTree/LayerTree";

interface DigitalTwinState {
  playerIsReady: boolean;
  layerTree: LayerTreeItem[];
  animationList: AnimationItem[];
  isCameraInOrbit: boolean;
  coordsForCameraOrbit: [number, number, number];
  xrayColor: [number, number, number, number];
  isAlertMarkersShown: boolean;
  isCCTVMarkersShown: boolean;
  activeAlertCard: {
    alertKey: string;
    position: { x: number; y: number };
  } | null;
  camOrbitTimer: any;
  alertIDs: string[];
  CCTVIDs: string[];
}

export type DigitalTwinAction =
  | { type: "SET_READY_STATE"; payload: boolean }
  | { type: "SET_LAYER_TREE"; payload: LayerTreeItem[] }
  | { type: "SET_ANIMATION_LIST"; payload: AnimationItem[] }
  | { type: "SET_CAMERA_ORBIT"; payload: boolean }
  | {
      type: "SET_CCTV_IDs";
      payload: string[];
    }
  | {
      type: "SET_ALERT_IDs";
      payload: string[];
    }
  | { type: "SET_ALERT_MARKERS"; payload: boolean }
  | { type: "SET_CCTV_MARKERS"; payload: boolean }
  | {
      type: "SHOW_ALERT_CARD";
      payload: { alertKey: string; position: { x: number; y: number } };
    }
  | { type: "HIDE_ALERT_CARD" }
  | { type: "SET_ORBIT_TIMER"; payload: any };

const initialState: DigitalTwinState = {
  playerIsReady: false,
  layerTree: [],
  animationList: [],
  isCameraInOrbit: true,
  coordsForCameraOrbit: [34518, 33786.525, 2.95], //[34532, 33716.5, 60]
  xrayColor: [1, 1, 1, 0.005], // blue: [0, 0, 1, 0.25]， alt blue: [0.29019607843137253, 0.2725490196078431, 1, 0.005]
  isAlertMarkersShown: false,
  isCCTVMarkersShown: false,
  activeAlertCard: null,
  camOrbitTimer: 1000000,
  alertIDs: [],
  CCTVIDs: [],
};

const digitalTwinReducer = (
  state: DigitalTwinState,
  action: DigitalTwinAction
): DigitalTwinState => {
  switch (action.type) {
    case "SET_READY_STATE":
      return { ...state, playerIsReady: action.payload };
    case "SET_LAYER_TREE":
      return { ...state, layerTree: action.payload };
    case "SET_ANIMATION_LIST":
      return { ...state, animationList: action.payload };
    case "SET_CAMERA_ORBIT":
      return { ...state, isCameraInOrbit: action.payload };
    case "SET_ALERT_MARKERS":
      return { ...state, isAlertMarkersShown: action.payload };
    case "SET_CCTV_MARKERS":
      return { ...state, isCCTVMarkersShown: action.payload };
    case "SHOW_ALERT_CARD":
      return { ...state, activeAlertCard: action.payload };
    case "HIDE_ALERT_CARD":
      return { ...state, activeAlertCard: null };
    case "SET_ORBIT_TIMER":
      return { ...state, camOrbitTimer: action.payload };
    case "SET_ALERT_IDs":
      return { ...state, alertIDs: action.payload };
    case "SET_CCTV_IDs":
      return { ...state, CCTVIDs: action.payload };
    default:
      return state;
  }
};

const DigitalTwinContext = createContext<{
  state: DigitalTwinState;
  dispatch: React.Dispatch<DigitalTwinAction>;
} | null>(null);

export const DigitalTwinProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(digitalTwinReducer, initialState);

  return (
    <DigitalTwinContext.Provider value={{ state, dispatch }}>
      {children}
    </DigitalTwinContext.Provider>
  );
};

export const useDigitalTwinContext = () => {
  const context = useContext(DigitalTwinContext);
  if (!context) {
    throw new Error(
      "useDigitalTwinContext must be used within a DigitalTwinProvider"
    );
  }
  return context;
};
