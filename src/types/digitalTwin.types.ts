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

export interface World2ScreenResponse {
  callbackIndex: number;
  command: string;
  commandIndex: number;
  result: number;
  resultMessage: string;
  screenPosition: [number, number]; // [x, y]
  timestamp: number;
}

//use this after sorting out the response type
export interface getObjectIDsResponse {
  id: string;
  objectIds: string[];
}
[];

export enum MarkerType {
  ALERT = "ALERT",
  CAMERA = "CAMERA",
}

export enum AlertStatus {
  UNASSIGNED = "UNASSIGNED",
  RESOLVING = "RESOLVING",
}

export enum AlertCategory {
  SECURITY = "SECURITY",
  ELECTRICAL = "ELECTRICAL",
  LIFT = "LIFT",
  IRRIGATION = "IRRIGATION",
  ACMV = "ACMV",
  PLUMBING = "PLUMBING",
  SANITARY = "SANITARY",
  SIPHONIC_RWDP = "SIPHONIC_RWDP",
  FIRE_PROTECTION = "FIRE_PROTECTION",
}

export type AlertCardListener = (
  alertKey: string,
  position: { x: number; y: number }
) => void;

// Digital Twin API Interface
export interface FDApi {
  tileLayer: {
    focus: (
      ids: string[] | string,
      distance?: number,
      flyTime?: number,
      rotation?: number[]
    ) => Promise<void>;
    focusActors: (
      data: {
        id: string;
        objectIds: string[];
      },
      distance?: number,
      flyTime?: number,
      rotation?: number[]
    ) => Promise<void>;
    focusActor: (
      id: string,
      objectId: string,
      distance?: number,
      flyTime?: number,
      rotation?: number[]
    ) => Promise<void>;
    highlightActorWithColor: (
      id: string,
      objectId: string | string[],
      color: number[],
      wireframe: boolean
    ) => Promise<void>;
    stopHighlightAllActors: () => Promise<void>;
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
    getObjectIDs: (ids: string[] | string) => Promise<{ data: any }>;
    getActorInfoFromDB: (
      data: {
        tileLayerId: string;
        objectIds: string[] | string;
      }[]
    ) => Promise<{ data: any }>;
    getActorInfo: (data: {
      id: string;
      objectIds: string[] | string;
    }) => Promise<{ data: any }>;
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
    stop: () => Promise<void>;
    set: (
      x: number,
      y: number,
      z: number,
      pitch: number,
      yaw: number,
      flyTime: number
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
  marker: {
    clear: () => Promise<void>;
    hide: (ids: string[]) => Promise<void>;
    show: (ids: string[]) => Promise<void>;
    add: (...args: any[]) => Promise<void>;
    focus: (
      ids: string | string[],
      distance?: number,
      flyTime?: number,
      rotation?: number[]
    ) => Promise<void>;
    showPopupWindow: (ids: string | string[]) => Promise<void>;
  };
  odline: {
    delete: (ids: string | string[]) => Promise<void>;
    clear: () => Promise<void>;
    add: (...args: any[]) => Promise<void>;
    focus: (
      ids: string | string[],
      distance?: number,
      flyTime?: number,
      rotation?: number[]
    ) => Promise<void>;
    setColor: (id: string, newVal: string) => Promise<void>;
  };
  // coord: {
  //   //https://sdk.freedo3d.com/doc/api/Coord.html
  //   world2Screen: (
  //     x: number,
  //     y: number,
  //     z: number
  //   ) => Promise<World2ScreenResponse>; //screen coordinates
  // };
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
      IP: string;
      Port: string;
      InstanceId?: string;
      Path?: string;
      UseHttps?: boolean;
      Quality?: string;
      AutoPlay?: boolean;
      Debug?: boolean;
    };
  }
}
