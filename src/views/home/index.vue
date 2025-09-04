<template>
    <div class="container">
        <Header v-if="playerIsReady" />
        <Player />
        <LeftBox v-show="showUI && (showLayerTree || showAnimation)">
            <Lease_title :icon="'tucengshu'">Menu</Lease_title>
            <layerTree v-show="showLayerTree" />
            <animation v-show="showAnimation" />
        </LeftBox>
        <Weather v-show="showUI && showWeather" />
        <RouterNav v-if="playerIsReady" v-show="showUI && !(showLayerTree || showAnimation || showWeather)" />
        <router-view v-if="showUI && !(showLayerTree || showAnimation || showWeather)" />
    </div>
</template>
<script lang="ts" setup>
import Player from '@/components/player/index.vue'
import LeftBox from "@/components/Layout/leftBox/index.vue"
import Header from '@/components/header/index.vue'
import Weather from "@/components/weather/index.vue"
import Lease_title from "@/components/leaseTitle/index.vue"
import RouterNav from "@/components/routerNav/index.vue"
import {useDigitalTwinStore} from '@/stores/digitalTwinStore'
import { useHeaderStore } from '@/stores/headerStore'
import { computed } from 'vue'
const DigitalTwinStore = useDigitalTwinStore()
const headerStore = useHeaderStore()
const playerIsReady = computed(() => DigitalTwinStore.playerIsReady)
const showLayerTree = computed(() => headerStore.showLayerTree)
const showWeather = computed(() => headerStore.showWeather)
const showAnimation = computed(() => headerStore.showAnimation)
const showUI = computed(() => headerStore.showUI)
</script>
<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    background: black;
}
</style>
