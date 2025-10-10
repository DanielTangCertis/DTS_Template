import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface HeaderState {
  showLayerTree: boolean;
  showAnimation: boolean;
  showWeather: boolean;
  showUI: boolean;
}

type HeaderAction =
  | { type: 'SET_SHOW_LAYER_TREE'; payload: boolean }
  | { type: 'SET_SHOW_ANIMATION'; payload: boolean }
  | { type: 'SET_SHOW_WEATHER'; payload: boolean }
  | { type: 'SET_SHOW_UI'; payload: boolean }

const initialHeaderState: HeaderState = {
  showLayerTree: false,
  showAnimation: false,
  showWeather: false,
  showUI: true,
};

const headerReducer = (state: HeaderState, action: HeaderAction): HeaderState => {
  switch (action.type) {
    case 'SET_SHOW_LAYER_TREE':
      return { ...state, showLayerTree: action.payload };
    case 'SET_SHOW_ANIMATION':
      return { ...state, showAnimation: action.payload };
    case 'SET_SHOW_WEATHER':
      return { ...state, showWeather: action.payload };
    case 'SET_SHOW_UI':
      return { ...state, showUI: action.payload };
    default:
      return state;
  }
};

const HeaderContext = createContext<{
  state: HeaderState;
  dispatch: React.Dispatch<HeaderAction>;
} | null>(null);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(headerReducer, initialHeaderState);

  return (
    <HeaderContext.Provider value={{ state, dispatch }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};