export interface DigitalTwinPlayer {
  init: (config: PlayerConfig) => void;
  destroy: () => void;
}

export interface PlayerConfig {
  domId: string;
  iid: string;
  apiOptions: {
    onReady: () => void | Promise<void>;
    onEvent: (event: any) => void;
  };
}

// API Response Types (from Digital Twin SDK)
export interface LayerTreeApiItem {
  iD: string; // Note: API uses 'iD' not 'id'
  name: string;
  visiblity: boolean; // Note: API uses 'visiblity' not 'visibility'
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

export interface LayerTreeResponse {
  infotree: LayerTreeApiItem[];
}

export interface AnimationListResponse {
  data: AnimationListItem[];
}

export interface AnimationImageResponse {
  image: string;
}

// Digital Twin API Interface
export interface FDApi {
  tileLayer: {
    focus: (
      ids: string[] | string,
      distance?: number,
      flyTime?: number,
      rotation?: number[]
    ) => Promise<void>;
    enableXRay: (ids: string[] | string, color: number[]) => Promise<void>;
    disableXRay: (ids: string[] | string) => Promise<void>;
    setStyle: (
      tileLayerIds: string[] | string,
      style: number,
      color: number[],
      saturation?: number,
      brightness?: number,
      contrast?: number,
      contrastBase?: number
    ) => Promise<void>;
  };
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
    flyAround: (
      location: number[],
      rotation: number[],
      distance: number,
      time: number
    ) => Promise<void>;
  };
  weather: {
    setDateTime: (
      year?: number | null,
      month?: number | null,
      day?: number | null,
      hour?: number,
      minute?: number
    ) => Promise<void>;
    setDarkMode: (enabled: boolean) => Promise<void>;
    disableRainSnow: () => Promise<void>;
    setCloudDensity: (density: number) => Promise<void>;
    setSunIntensity: (intensity: number) => Promise<void>;
    setRainParam: (params: (number | string)[]) => Promise<void>;
    setSnowParam: (params: (number | string)[]) => Promise<void>;
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
    DigitalTwinPlayer: {
      new (
        serverUrl: string,
        options: {
          domId: string;
          iid?: string;
          apiOptions: {
            onReady: () => void | Promise<void>;
            onEvent: (event: any) => void;
          };
        }
      ): DigitalTwinPlayer;
    };
    HostConfig: {
      Player: string;
      InstanceId?: string;
      Path?: string;
      UseHttps?: boolean;
      Quality?: string;
      AutoPlay?: boolean;
      Debug?: boolean;
    };
  }
}
