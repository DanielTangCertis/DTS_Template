// src/types/digitalTwin.types.ts

// Player Configuration Types
export interface DigitalTwinPlayer {
  init: (config: PlayerConfig) => void;
  destroy: () => void;
}

export interface PlayerConfig {
  domId: string;
  apiOptions: {
    onReady: () => void | Promise<void>;
    onEvent: (event: any) => void;
  };
}

// API Response Types (from Digital Twin SDK)
export interface LayerTreeApiItem {
  iD: string;           // Note: API uses 'iD' not 'id'
  name: string;
  visiblity: boolean;   // Note: API uses 'visiblity' not 'visibility'
  index: number;
  parentIndex: number;
  color?: string;
  style?: number;
  type: string;
}

export interface AnimationListItem {
  id: string | number;
  name: string;
}

// Digital Twin API Interface
export interface FDApi {
  infoTree: {
    get: () => Promise<{ infotree: LayerTreeApiItem[] }>;
    show: (id: string) => Promise<void>;
    hide: (id: string) => Promise<void>;
  };
  camera: {
    getAnimationList: () => Promise<{ data: AnimationListItem[] }>;
    getAnimationImage: (name: string) => Promise<{ image: string }>;
    playAnimation: (id: string | number) => Promise<void>;
    stopAnimation: () => Promise<void>;
  };
  weather: {
    setDateTime: (year?: number | null, month?: number | null, day?: number | null, hour?: number, minute?: number) => Promise<void>;
    setDarkMode: (enabled: boolean) => Promise<void>;
    disableRainSnow: () => Promise<void>;
    setCloudDensity: (density: number) => Promise<void>;
    setSunIntensity: (intensity: number) => Promise<void>;
    setRainParam: (params: (number|string)[]) => Promise<void>;
    setSnowParam: (params: (number|string)[]) => Promise<void>;
  };
  reset: (flags: number) => Promise<void>;
  settings: {
    setMainUIVisibility: (visible: boolean) => void;
  };
}

// Global Window Interface Extensions  
declare global {
  interface Window {
    fdapi: FDApi;
    DigitalTwinPlayer: new (serverUrl: string, options: any) => {
      getAPI?(): FDApi;  // Optional method for React-compliant approach
      destroy?(): void;
    };
    HostConfig: {
      Player: string;
      Path?: string;
      UseHttps?: boolean;
      Quality?: string;
      AutoPlay?: boolean;
      Debug?: boolean;
    };
  }
}