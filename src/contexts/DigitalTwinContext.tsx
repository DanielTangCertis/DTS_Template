import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AnimationItem } from "@/components/AnimatedTours/AnimatedTours";
import { LayerTreeItem } from "@/components/LayerTree/LayerTree";
import { Coordinates } from "@/types/digitalTwin.types";

interface DigitalTwinState {
  playerIsReady: boolean;
  layerTree: LayerTreeItem[];
  animationList: AnimationItem[];
  isCameraInOrbit: boolean;
  coordsForCameraOrbit: [number, number, number];
  xrayColor: [number, number, number, number];
  isAlertMarkersShown: boolean;
  alertCoordinates: Coordinates[];
  // alertData: {
  //   title: string, // equipment name or one-line description of the incident
  //   status: string,
  //   location: Coordinates
  // }
}

// Export the action type so digitalTwinUtils can use it
export type DigitalTwinAction =
  | { type: "SET_READY_STATE"; payload: boolean }
  | { type: "SET_LAYER_TREE"; payload: LayerTreeItem[] }
  | { type: "SET_ANIMATION_LIST"; payload: AnimationItem[] }
  | { type: "SET_CAMERA_ORBIT"; payload: boolean }
  | {
      type: "SET_COORDINATES";
      payload: [number, number, number];
    }
  | { type: "SET_ALERT_MARKERS"; payload: boolean };

const initialState: DigitalTwinState = {
  playerIsReady: false,
  layerTree: [],
  animationList: [],
  isCameraInOrbit: true,
  coordsForCameraOrbit: [34518, 33786.525, 2.95], //[34532, 33716.5, 60]
  xrayColor: [0, 0, 1, 0.25], //blue， alt blue: [0.29019607843137253, 0.2725490196078431, 1, 0.005]
  isAlertMarkersShown: false,
  alertCoordinates: [
    { x: 34490.62890625, y: 33713.26171875, z: 21.485000610351562 },
    { x: 34551.42, y: 33715.58, z: 34.07 },
    { x: 34518.91, y: 33708.69, z: 46.67 },
    { x: 34543.19, y: 33721.3, z: 59.89 },
  ],
  //add sample alert data here
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
    case "SET_COORDINATES":
      return { ...state, coordsForCameraOrbit: action.payload };
    case "SET_ALERT_MARKERS":
      return { ...state, isAlertMarkersShown: action.payload };
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
