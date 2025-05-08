import { defineStore } from 'pinia';

export const useDigitalTwinStore = defineStore('digitalTwin', {
  state: () => ({
    layerTree: [],
    playerIsReady: false,
    animationList: []
  } as any),
  actions: {
    setReadyState(flag) {
      this.playerIsReady = flag
    },
    setLayerTree(layerTree) {
      this.layerTree = layerTree
    },
    setAnimationList(animationList) {
      this.animationList = animationList
    }
  },
});