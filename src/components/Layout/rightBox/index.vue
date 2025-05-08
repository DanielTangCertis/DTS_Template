<template>
  <transition
    appear
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__faster  animate__fadeInRight "
    leave-active-class="animate__animated animate__faster animate__fadeOutRight "
    @before-enter="beforeEnter"
  >
    <div v-if="playerIsReady" class="right_box">
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
.right_box {
  position: absolute;
  @include Width(480);
  height: 100%;
  @include Top(0);
  @include Right(0);

  z-index: 9;
  background: url("@/assets/images/基础/right_bg_dark@2x.png") no-repeat;
  @include Padding(80, 20, 40, 30);
  box-sizing: border-box;

  .content {
    width: 100%;
    height: 100%;
    // border: 1px solid rgba(255, 255, 255, 0.527);
  }
}
</style>
