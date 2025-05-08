<template>
    <transition
      appear
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__faster animate__fadeInLeft"
      leave-active-class="animate__animated animate__faster animate__fadeOutLeft"
      @before-enter="beforeEnter">
      <div class="animation">
        <div class="list">
          <div
            class="item"
            v-for="item in animationList"
            :key="item.id"
            @click="playAnimation(item.id)"
          >
            <img class="img" :src="item.img" alt="" />
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { watch, computed } from 'vue'
  import { useDigitalTwinStore } from '@/stores/digitalTwinStore'
  import { useHeaderStore } from '@/stores/headerStore'
  
  const digitalTwinStore = useDigitalTwinStore()
  const headerStore = useHeaderStore()
  
  const animationList = computed(() => digitalTwinStore.animationList)
  const animationShow = computed(() => headerStore.showAnimation)
  
  watch(animationShow, (val) => {
    if (!val) fdapi.camera.stopAnimation()
  })
  
  const playAnimation = (id: string | number) => {
    fdapi.camera.playAnimation(id)
  }

  const beforeEnter = (el: HTMLElement) => { 
    el.style.animationDelay = '0.3s'
  }
  </script>
  
  <style lang="scss" scoped>
  .animation {
    position: absolute;
    height: 70vh;
    @include Width(350);
    @include Margin(50, 0, 50, 50);
    overflow-y: auto;
  
    &::-webkit-scrollbar {
      width: 10px;
    }
  
    &::-webkit-scrollbar-track {
      background: rgba($color: #000000, $alpha: 0.1);
    }
  
    &::-webkit-scrollbar-thumb {
      background: rgba($color: #ffffff, $alpha: 0.5);
      border-radius: 5px;
    }
  
    &::-webkit-scrollbar-thumb:hover {
      background: rgba($color: #ffffff, $alpha: 0.8);
    }
  
    .list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
  
      .item {
        @include MarginBottom(15);
  
        .img {
          @include Width(140);
        }
  
        .text {
          @include FontSize(16);
          color: rgba($color: #ffffff, $alpha: 0.7);
        }
      }
    }
  }
  </style>
  