import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AnimationItem } from "@/components/AnimatedTours/AnimatedTours";
import { LayerTreeItem } from "@/components/LayerTree/LayerTree";

interface DigitalTwinState {
  playerIsReady: boolean;
  layerTree: LayerTreeItem[];
  animationList: AnimationItem[];
  isCameraInOrbit: boolean;
  coordsForCameraOrbit: [number, number, number];
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
    };

const initialState: DigitalTwinState = {
  playerIsReady: false,
  layerTree: [],
  animationList: [],
  isCameraInOrbit: true,
  coordsForCameraOrbit: [34518., 33786.525, 2.95] //[34532, 33716.5, 60]
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
