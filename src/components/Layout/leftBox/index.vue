<template>
  <transition
    appear
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__faster  animate__fadeInLeft "
    leave-active-class="animate__animated animate__faster animate__fadeOutLeft "
    @before-enter="beforeEnter"
  >
    <div v-if="playerIsReady" class="left_box">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useDigitalTwinStore } from '@/stores/digitalTwinStore'
import { computed, defineProps } from 'vue'

const props = withDefaults(defineProps<{ delay: number }>(), { delay: 0 })

const playerIsReady = computed(() => {
  return useDigitalTwinStore().playerIsReady
})

const beforeEnter = (el) => { 
  el.style.animationDelay = props.delay + 's'
}
</script>

<style lang="scss" scoped>
.left_box {
  position: absolute;
  @include Width(480);
  height: 100%;
  background: url("@/assets/images/基础/left_bg_dark@2x.png") no-repeat;
  background-size: 100% 100%;
  @include Top(0);
  @include Left(0);
  box-sizing: border-box;

  @include Padding(80, 0, 40, 24);
  z-index: 9;

  .content {
    width: 100%;
    height: 100%;
    // border: 1px solid rgba(255, 255, 255, 0.527);
    box-sizing: border-box;
    position: relative;
  }
}
</style>
