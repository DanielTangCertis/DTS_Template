import {
  FDApi,
  LayerTreeResponse,
  AnimationListResponse,
  AnimationImageResponse,
} from "../types/digitalTwin.types";

export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
  RECONNECTING = "reconnecting",
}

export interface ConnectionState {
  status: ConnectionStatus;
  error: string | null;
  retryCount: number;
  lastConnected: Date | null;
}

type ConnectionListener = (state: ConnectionState) => void;
type DataListener = (type: "layerTree" | "animations", data: any) => void;

class DigitalTwinService {
  private player: any = null;
  private connectionState: ConnectionState = {
    status: ConnectionStatus.DISCONNECTED,
    error: null,
    retryCount: 0,
    lastConnected: null,
  };

  private connectionListeners: Set<ConnectionListener> = new Set();
  private dataListeners: Set<DataListener> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private maxRetries = 5;
  private retryDelay = 3000;

  // Public API
  get status() {
    return this.connectionState.status;
  }

  get isConnected() {
    return this.connectionState.status === ConnectionStatus.CONNECTED;
  }

  get api(): FDApi | null {
    return this.isConnected ? (window as any).fdapi : null;
  }

  // Connection Management
  async connect(retryOnFailure = true): Promise<boolean> {
    if (this.connectionState.status === ConnectionStatus.CONNECTING) {
      return false;
    }

    this.updateConnectionState({
      status: ConnectionStatus.CONNECTING,
      error: null,
    });

    try {
      // Check if HostConfig exists
      if (!window.HostConfig?.Player) {
        throw new Error(
          "HostConfig.Player not found. Make sure ac_conf.js is loaded."
        );
      }

      // ADD THIS LOGIC FROM YOUR PLAYER.tsx:
      console.log("Creating Digital Twin Player...");
      const playerConfig = {
        domId: "player",
        apiOptions: {
          onReady: this.handlePlayerReady.bind(this),
          onEvent: this.handlePlayerEvent.bind(this),
        },
      };

      this.player = new (window as any).DigitalTwinPlayer(
        window.HostConfig.Player,
        playerConfig
      );

      console.log("Digital Twin Player created successfully");

      // Wait for connection with timeout
      await this.waitForConnection(10000);

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown connection error";

      this.updateConnectionState({
        status: ConnectionStatus.ERROR,
        error: errorMessage,
        retryCount: this.connectionState.retryCount + 1,
      });

      console.error("Digital Twin connection failed:", error);

      if (retryOnFailure && this.connectionState.retryCount < this.maxRetries) {
        this.scheduleReconnect();
      }

      return false;
    }
  }
  
  disconnect(): void {
    this.clearReconnectTimer();

    if (this.player?.destroy) {
      try {
        this.player.destroy();
      } catch (error) {
        console.warn("Error destroying player:", error);
      }
    }

    this.player = null;
    this.updateConnectionState({
      status: ConnectionStatus.DISCONNECTED,
      error: null,
      retryCount: 0,
    });
  }

  async reconnect(): Promise<boolean> {
    this.disconnect();
    return this.connect(true);
  }

  // Event Handlers
  private async handlePlayerReady(): Promise<void> {
    try {
      console.log("Digital Twin Player Ready");

      // Reset scene
      await this.safeApiCall(() => (window as any).fdapi.reset(1 | 2 | 4));

      // Load initial data
      await this.loadInitialData();

      this.updateConnectionState({
        status: ConnectionStatus.CONNECTED,
        error: null,
        retryCount: 0,
        lastConnected: new Date(),
      });

      console.log("Digital Twin fully initialized");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Initialization failed";
      this.updateConnectionState({
        status: ConnectionStatus.ERROR,
        error: errorMessage,
      });
    }
  }

  private handlePlayerEvent(eventData: any): void {
    console.log("Digital Twin Event:", eventData);
    // Handle specific events as needed
  }

  // Data Loading
  private async loadInitialData(): Promise<void> {
    try {
      // Load layer tree
      const layerResponse = await this.safeApiCall<LayerTreeResponse>(() =>
        (window as any).fdapi.infoTree.get()
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
        () => (window as any).fdapi.camera.getAnimationList()
      );

      if (animationsResponse?.data) {
        const animationList = [];

        for (const item of animationsResponse.data) {
          try {
            const imageResponse =
              await this.safeApiCall<AnimationImageResponse>(() =>
                (window as any).fdapi.camera.getAnimationImage(item.name)
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

  // Safe API calls with error handling
  private async safeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    if (!this.api) {
      throw new Error("Digital Twin API not available");
    }

    try {
      return await apiCall();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  // Public API methods with error handling
  async playAnimation(id: string | number): Promise<boolean> {
    try {
      await this.safeApiCall(() => this.api!.camera.playAnimation(id));
      return true;
    } catch (error) {
      console.error("Failed to play animation:", error);
      return false;
    }
  }

  async stopAnimation(): Promise<boolean> {
    try {
      await this.safeApiCall(() => this.api!.camera.stopAnimation());
      return true;
    } catch (error) {
      console.error("Failed to stop animation:", error);
      return false;
    }
  }

  async toggleLayer(id: string, visible: boolean): Promise<boolean> {
    try {
      if (visible) {
        await this.safeApiCall(() => this.api!.infoTree.show(id));
      } else {
        await this.safeApiCall(() => this.api!.infoTree.hide(id));
      }
      return true;
    } catch (error) {
      console.error("Failed to toggle layer:", error);
      return false;
    }
  }

  // Event Listeners
  onConnectionChange(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  onDataUpdate(listener: DataListener): () => void {
    this.dataListeners.add(listener);
    return () => this.dataListeners.delete(listener);
  }

  // Private helpers
  private updateConnectionState(updates: Partial<ConnectionState>): void {
    this.connectionState = { ...this.connectionState, ...updates };
    this.notifyConnectionListeners();
  }

  private notifyConnectionListeners(): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(this.connectionState);
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

  private waitForConnection(timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, timeout);

      const checkConnection = () => {
        if (this.connectionState.status === ConnectionStatus.CONNECTED) {
          clearTimeout(timeoutId);
          resolve();
        } else if (this.connectionState.status === ConnectionStatus.ERROR) {
          clearTimeout(timeoutId);
          reject(new Error(this.connectionState.error || "Connection failed"));
        } else {
          setTimeout(checkConnection, 100);
        }
      };

      checkConnection();
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.updateConnectionState({
      status: ConnectionStatus.RECONNECTING,
    });

    const delay =
      this.retryDelay *
      Math.pow(2, Math.min(this.connectionState.retryCount, 5)); // Exponential backoff

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      await this.connect(true);
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Singleton instance
export const digitalTwinService = new DigitalTwinService();

// React Hook for using the service
import { useState, useEffect } from "react";

export const useDigitalTwinService = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    digitalTwinService["connectionState"]
  );

  useEffect(() => {
    const unsubscribe =
      digitalTwinService.onConnectionChange(setConnectionState);
    return unsubscribe;
  }, []);

  return {
    connectionState,
    isConnected: digitalTwinService.isConnected,
    connect: () => digitalTwinService.connect(),
    disconnect: () => digitalTwinService.disconnect(),
    reconnect: () => digitalTwinService.reconnect(),
    playAnimation: digitalTwinService.playAnimation.bind(digitalTwinService),
    stopAnimation: digitalTwinService.stopAnimation.bind(digitalTwinService),
    toggleLayer: digitalTwinService.toggleLayer.bind(digitalTwinService),
    // Add data listener subscription
    onDataUpdate: digitalTwinService.onDataUpdate.bind(digitalTwinService),
  };
};
