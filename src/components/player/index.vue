<!-- 加载视频流组件 -->
<template>
  <div id="player"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { _onReady, _onEvent } from '@/components/player/digtalTwinUtils'

onMounted(() => {
  new DigitalTwinPlayer(HostConfig.Player, {
    domId: 'player',
    apiOptions: {
      onReady: _onReady,
      onEvent: _onEvent
    }
  })
})
</script>

<style lang="scss" scoped>
#player {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 1;
  border: none;
  background: #000;
}
</style>
