import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Export interfaces so digitalTwinUtils can use them
export interface AnimationItem {
  id: string | number;
  name: string;
  img: string;
}

export interface LayerTreeItem {
  id: string;
  name: string;
  visibility: boolean;
  index: number;
  parentIndex: number;
  color: string;
  style: number;
  type: string;
  children?: LayerTreeItem[];
}

interface DigitalTwinState {
  playerIsReady: boolean;
  layerTree: LayerTreeItem[];
  animationList: AnimationItem[];
}

// Export the action type so digitalTwinUtils can use it
export type DigitalTwinAction =
  | { type: 'SET_READY_STATE'; payload: boolean }
  | { type: 'SET_LAYER_TREE'; payload: LayerTreeItem[] }
  | { type: 'SET_ANIMATION_LIST'; payload: AnimationItem[] };

const initialState: DigitalTwinState = {
  playerIsReady: false,
  layerTree: [],
  animationList: [],
};

const digitalTwinReducer = (state: DigitalTwinState, action: DigitalTwinAction): DigitalTwinState => {
  switch (action.type) {
    case 'SET_READY_STATE':
      return { ...state, playerIsReady: action.payload };
    case 'SET_LAYER_TREE':
      return { ...state, layerTree: action.payload };
    case 'SET_ANIMATION_LIST':
      return { ...state, animationList: action.payload };
    default:
      return state;
  }
};

const DigitalTwinContext = createContext<{
  state: DigitalTwinState;
  dispatch: React.Dispatch<DigitalTwinAction>;
} | null>(null);

export const DigitalTwinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(digitalTwinReducer, initialState);

  return (
    <DigitalTwinContext.Provider value={{ state, dispatch }}>
      {children}
    </DigitalTwinContext.Provider>
  );
};

export const useDigitalTwin = () => {
  const context = useContext(DigitalTwinContext);
  if (!context) {
    throw new Error('useDigitalTwin must be used within a DigitalTwinProvider');
  }
  return context;
};