/**
 * This Service is in charge of monitoring and setting the connection status of the app to the DTS Cloud Stream. It logs the progress of ac.min.js
 */

import { useCallback } from "react";

import {
  FDApi,
  LayerTreeResponse,
  AnimationListResponse,
  AnimationImageResponse,
  PlayerConfig,
} from "../types/digitalTwin.types";

export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  INITIALIZING = "initializing",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
  TIMEOUT = "timeout",
  RECONNECTING = "reconnecting",
}

export interface ConnectionState {
  status: ConnectionStatus;
  error: string | null;
  retryCount: number;
  lastConnected: Date | null;
  initStartTime?: Date;
}

type ConnectionListener = (state: ConnectionState) => void;
type DataListener = (type: "layerTree" | "animations", data: any) => void;

class DigitalTwinService {
  private _connectionState: ConnectionState = {
    status: ConnectionStatus.DISCONNECTED,
    error: null,
    retryCount: 0,
    lastConnected: null,
    initStartTime: new Date(),
  };

  private connectionListeners: Set<ConnectionListener> = new Set();
  private dataListeners: Set<DataListener> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  // Timer for initialization timeout
  private initTimer: NodeJS.Timeout | null = null;
  // Console monitoring system
  private originalConsoleLog = console.log;
  private maxRetries = 5;
  private retryDelay = 3000;
  private initTimeout = 10000; // 10 seconds

  get status() {
    return this._connectionState.status;
  }

  get isConnected() {
    return this._connectionState.status === ConnectionStatus.CONNECTED;
  }

  get api(): FDApi | null {
    return this.isConnected ? window.fdapi : null;
  }

  get connectionState() {
    return { ...this._connectionState };
  }

  // Keep both connect() and initialize() methods
  async connect(retryOnFailure = true): Promise<boolean> {
    return this.initialize();
  }

  // Initialize by creating the DigitalTwinPlayer
  async initialize(): Promise<boolean> {
    // Already connected
    if (this._connectionState.status === ConnectionStatus.CONNECTED) {
      console.log("Already connected");
      return true;
    }
    // Already attempting connection
    if (
      this._connectionState.status === ConnectionStatus.INITIALIZING ||
      this._connectionState.status === ConnectionStatus.CONNECTING
    ) {
      return false;
    }

    this.updateConnectionState({
      status: ConnectionStatus.INITIALIZING,
      error: null,
      initStartTime: new Date(),
    });

    try {
      if (!window.HostConfig?.IP || !window.HostConfig?.Port) {
        throw new Error(
          "HostConfig.IP or HostConfig.Port not found. Make sure ac_conf.js is loaded and configured."
        );
      }

      if (!window.DigitalTwinPlayer) {
        throw new Error(
          "DigitalTwinPlayer class not found. Make sure ac.min.js is loaded."
        );
      }

      // Set up console monitoring before creating player
      this.startConsoleMonitoring();

      // CREATE PLAYER
      console.log("Creating Digital Twin Player...");
      const playerConfig: PlayerConfig = {
        domId: "player",
        iid: window.HostConfig.InstanceId || "",
        apiOptions: {
          onReady: this.handlePlayerReady.bind(this),
          onEvent: this.handlePlayerEvent.bind(this),
        },
      };
      let address = window.HostConfig.IP + ":" + window.HostConfig.Port;
      new window.DigitalTwinPlayer(address, playerConfig);

      console.log("Digital Twin Player created successfully");

      // Set timeout in case connection fails
      this.initTimer = setTimeout(() => {
        if (this._connectionState.status !== ConnectionStatus.CONNECTED) {
          this.handleInitializationTimeout();
        }
      }, this.initTimeout);

      return true;
    } catch (error) {
      this.handleInitializationError(error);
      return false;
    }
  }

  private async handlePlayerReady(): Promise<void> {
    try {
      console.log("Digital Twin Player Ready");

      // Wait a moment for fdapi to be available
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!window.fdapi) {
        throw new Error("fdapi not available in onReady callback");
      }

      // Initialize API and load data
      await this.initializeAPI();

      this.updateConnectionState({
        status: ConnectionStatus.CONNECTED,
        error: null,
        retryCount: 0,
        lastConnected: new Date(),
      });

      console.log("Digital Twin fully initialized and ready");
    } catch (error) {
      console.error("Failed in handlePlayerReady:", error);
      this.handleConnectionError(error);
    }
  }

  private async handlePlayerEvent(eventData?: any): Promise<void> {
    console.log("Digital Twin Event:", eventData);
    switch (eventData.eventtype) {
      case "LeftMouseButtonClick":
        //markers
        if (eventData.Type == "marker") {
          let mouseCoords: number[] = eventData.MouseClickPoint;
          try {
            let response = await this.safeApiCall(() => {
              return window.fdapi.coord.world2Screen(
                mouseCoords[0],
                mouseCoords[1],
                mouseCoords[2]
              );
            });
            if (response.result === 0 && response.screenPosition) {
              const [screenX, screenY] = response.screenPosition;
              console.log(`Screen coordinates: x=${screenX}, y=${screenY}`);

              // Create react component at the location (screenX, screenY)
              // ...
            }
          } catch (error) {
            console.error(
              "Failed to convert world to screen coordinates:",
              error
            );
          }
        }
        break;
    }
  }

  // Enhanced disconnect with console restoration
  disconnect(): void {
    this.clearTimers();
    this.restoreConsoleLog();

    this.updateConnectionState({
      status: ConnectionStatus.DISCONNECTED,
      error: null,
      retryCount: 0,
    });
  }

  async reconnect(): Promise<boolean> {
    this.clearTimers();
    return this.initialize();
  }

  // PUBLIC API METHODS
  async playAnimation(id: string | number): Promise<boolean> {
    try {
      await this.safeApiCall(() => window.fdapi!.camera.playAnimation(id));
      return true;
    } catch (error) {
      console.error("Failed to play animation:", error);
      return false;
    }
  }

  async stopAnimation(): Promise<boolean> {
    try {
      await this.safeApiCall(() => window.fdapi!.camera.stopAnimation());
      return true;
    } catch (error) {
      console.error("Failed to stop animation:", error);
      return false;
    }
  }

  async toggleLayer(id: string, visible: boolean): Promise<boolean> {
    try {
      if (visible) {
        await this.safeApiCall(() => window.fdapi!.infoTree.show(id));
      } else {
        await this.safeApiCall(() => window.fdapi!.infoTree.hide(id));
      }
      return true;
    } catch (error) {
      console.error("Failed to toggle layer:", error);
      return false;
    }
  }

  // EVENT LISTENER METHODS
  onConnectionChange(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  onDataUpdate(listener: DataListener): () => void {
    this.dataListeners.add(listener);
    return () => this.dataListeners.delete(listener);
  }

  // Helper methods for UI components
  getElapsedTime(): number {
    const startTime = this._connectionState.initStartTime || new Date();
    return Math.round((Date.now() - startTime.getTime()) / 1000);
  }

  getStatusMessage(): string {
    const elapsed = this.getElapsedTime();

    switch (this._connectionState.status) {
      case ConnectionStatus.INITIALIZING:
        return "Initializing Digital Twin...";
      case ConnectionStatus.CONNECTING:
        return `Establishing connection... (${elapsed}s)`;
      case ConnectionStatus.CONNECTED:
        return "Connected! Loading complete.";
      case ConnectionStatus.TIMEOUT:
        return "Connection timeout";
      case ConnectionStatus.ERROR:
        return `Connection error: ${this._connectionState.error}`;
      case ConnectionStatus.RECONNECTING:
        return `Reconnecting... (attempt ${this._connectionState.retryCount})`;
      default:
        return "Disconnected";
    }
  }

  // Basic console monitoring (mainly for debugging)
  private startConsoleMonitoring(): void {
    console.log = (...args: any[]) => {
      const message = args.join(" ");

      // Just log ac.min.js messages for debugging - don't act on them
      if (
        message.includes("host:") ||
        message.includes("Connected!") ||
        message.includes("**ice_connection:") ||
        message.includes("video: loading")
      ) {
        // ac.min.js is working - but we'll handle success via onReady callback
      }

      // Call original console.log
      this.originalConsoleLog.apply(console, args);
    };
  }

  private async initializeAPI(): Promise<void> {
    if (!window.fdapi) {
      throw new Error("Digital Twin API not available");
    }

    try {
      console.log("DigitalTwinService: Resetting scene...");
      // Reset scene
      await window.fdapi.reset(1 | 2 | 4);

      console.log("DigitalTwinService: Loading initial data...");
      // Load initial data
      await this.loadInitialData();

      console.log("DigitalTwinService: API initialization complete");
    } catch (error) {
      console.error("DigitalTwinService: Failed to initialize API:", error);
      throw error;
    }
  }

  private async loadInitialData(): Promise<void> {
    try {
      // Load layer tree
      const layerResponse = await this.safeApiCall<LayerTreeResponse>(() =>
        window.fdapi!.infoTree.get()
      );

      if (layerResponse?.infotree) {
        const layerTree = layerResponse.infotree.map((item: any) => ({
          id: item.iD || item.id,
          name: item.name,
          visibility: item.visiblity || false,
          index: item.index,
          parentIndex: item.parentIndex,
          color: item.color || "#ffffff",
          style: item.style || 0,
          type: item.type || "default",
        }));

        this.notifyDataListeners("layerTree", layerTree);
      }

      // Load animations
      const animationsResponse = await this.safeApiCall<AnimationListResponse>(
        () => window.fdapi!.camera.getAnimationList()
      );

      if (animationsResponse?.data) {
        const animationList = [];

        for (const item of animationsResponse.data) {
          try {
            const imageResponse =
              await this.safeApiCall<AnimationImageResponse>(() =>
                window.fdapi!.camera.getAnimationImage(item.name)
              );

            animationList.push({
              id: item.id,
              name: item.name,
              img: imageResponse?.image
                ? `data:image/png;base64,${imageResponse.image}`
                : "",
            });
          } catch (imageError) {
            console.warn(
              `Failed to load image for animation ${item.name}:`,
              imageError
            );
            animationList.push({
              id: item.id,
              name: item.name,
              img: "",
            });
          }
        }

        this.notifyDataListeners("animations", animationList);
      }
    } catch (error) {
      console.error("Failed to load initial data:", error);
      throw error;
    }
  }

  // Handle connection errors
  private handleConnectionError(error: any): void {
    this.clearInitTimer();

    const errorMessage = error instanceof Error ? error.message : String(error);

    this.updateConnectionState({
      status: ConnectionStatus.ERROR,
      error: errorMessage,
      retryCount: this._connectionState.retryCount + 1,
    });

    console.error("Digital Twin connection failed:", error);

    if (this._connectionState.retryCount < this.maxRetries) {
      this.scheduleReconnect();
    }
  }

  // Handle initialization errors
  private handleInitializationError(error: any): void {
    this.clearInitTimer();

    const errorMessage = error instanceof Error ? error.message : String(error);

    this.updateConnectionState({
      status: ConnectionStatus.ERROR,
      error: `Initialization error: ${errorMessage}`,
      retryCount: this._connectionState.retryCount + 1,
    });

    console.error("Digital Twin initialization failed:", error);
  }

  // Handle initialization timeout with basic diagnostics
  private handleInitializationTimeout(): void {
    this.clearInitTimer();

    this.updateConnectionState({
      status: ConnectionStatus.TIMEOUT,
      error: "Digital Twin initialization timed out after 10 seconds",
    });

    console.warn("Digital Twin initialization timeout");
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.updateConnectionState({ status: ConnectionStatus.RECONNECTING });

    const delay =
      this.retryDelay *
      Math.pow(2, Math.min(this._connectionState.retryCount, 5));

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      await this.initialize();
    }, delay);
  }

  // Enhanced timer management
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.initTimer) {
      clearTimeout(this.initTimer);
      this.initTimer = null;
    }
  }

  private clearInitTimer(): void {
    if (this.initTimer) {
      clearTimeout(this.initTimer);
      this.initTimer = null;
    }
  }

  // Console restoration
  private restoreConsoleLog(): void {
    console.log = this.originalConsoleLog;
  }

  // PRIVATE HELPERS
  private async safeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    if (!window.fdapi) {
      throw new Error("Digital Twin API not available");
    }

    try {
      return await apiCall();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  private updateConnectionState(updates: Partial<ConnectionState>): void {
    this._connectionState = { ...this._connectionState, ...updates };
    this.notifyConnectionListeners();
  }

  private notifyConnectionListeners(): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(this._connectionState);
      } catch (error) {
        console.error("Error in connection listener:", error);
      }
    });
  }

  private notifyDataListeners(
    type: "layerTree" | "animations",
    data: any
  ): void {
    this.dataListeners.forEach((listener) => {
      try {
        listener(type, data);
      } catch (error) {
        console.error("Error in data listener:", error);
      }
    });
  }
}

// SINGLETON INSTANCE
export const digitalTwinService = new DigitalTwinService();

import { useState, useEffect } from "react";

export const useDigitalTwinService = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    digitalTwinService.connectionState
  );

  useEffect(() => {
    const unsubscribe =
      digitalTwinService.onConnectionChange(setConnectionState);
    return unsubscribe;
  }, []);

  //Memoize functions so they don't cause re-renders
  const connect = useCallback(() => digitalTwinService.connect(), []);
  const initialize = useCallback(() => digitalTwinService.initialize(), []);
  const disconnect = useCallback(() => digitalTwinService.disconnect(), []);
  const reconnect = useCallback(() => digitalTwinService.reconnect(), []);

  return {
    connectionState,
    isConnected: digitalTwinService.isConnected,
    connect,
    initialize,
    disconnect,
    reconnect,
    playAnimation: digitalTwinService.playAnimation.bind(digitalTwinService),
    stopAnimation: digitalTwinService.stopAnimation.bind(digitalTwinService),
    toggleLayer: digitalTwinService.toggleLayer.bind(digitalTwinService),
    onDataUpdate: digitalTwinService.onDataUpdate.bind(digitalTwinService),
    // Helper methods for UI components
    getStatusMessage: () => digitalTwinService.getStatusMessage(),
    getElapsedTime: () => digitalTwinService.getElapsedTime(),
  };
};
