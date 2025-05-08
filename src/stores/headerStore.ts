import { defineStore } from 'pinia';

export const useHeaderStore = defineStore('headerStore', {
    state: () => ({
        showLayerTree: false,
        showAnimation: false,
        showWeather: false,
        showUI: true
    } as any),
    actions: {
        setShowLayerTree(flag: boolean) {
            this.showLayerTree = flag;
        },
        setShowAnimation(flag: boolean) {
            this.showAnimation = flag;
        },
        setShowWeather(flag: boolean) {
            this.showWeather = flag;
        },
        setShowUI(flag: boolean) {
            this.showUI = flag;
        },
    },
});