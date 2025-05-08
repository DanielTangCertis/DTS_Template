<template>
    <transition
      appear
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__faster animate__fadeInLeft"
      leave-active-class="animate__animated animate__faster animate__fadeOutLeft"
      @before-enter="beforeEnter">
      <div class="layerTree">
        <el-tree
          class="layerTree-item"
          :data="layerTree"
          node-key="index"
          :props="defaultProps"
          show-checkbox
          :default-checked-keys="defaultCheckedList"
          :default-expanded-keys="[0]"
          @check="handleCheckChange"
        />
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useDigitalTwinStore } from '@/stores/digitalTwinStore'
  import { formatInfoTree } from './methods/formatInfoTree'
  
  const digitalTwinStore = useDigitalTwinStore()
  
  const defaultCheckedList = ref<number[]>([])
  const defaultProps = {
    children: 'children',
    label: 'label',
  }
  
  const layerTree = computed(() => formatInfoTree(digitalTwinStore.layerTree))
  
  watch(layerTree, (newVal) => {
    defaultCheckedList.value = getLayerTreeChecked(newVal)
  })
  
  const handleCheckChange = async (data: any, { checkedKeys }: any) => {
    checkedKeys.includes(data.index) ? await fdapi.infoTree.show(data.id) : await fdapi.infoTree.hide(data.id)
  }

  const getLayerTreeChecked = (root: any) => {
    return root.flatMap(item => item.children ? getLayerTreeChecked(item.children) : item.visiblity && item.index)
  }

  const beforeEnter = (el: HTMLElement) => { 
    el.style.animationDelay = '0.3s'
  }
  </script>
  
  <style lang="scss" scoped>
  .layerTree {
    position: absolute;
    height: 70vh;
    @include Width(300);
    @include Margin(50, 0, 50, 50);
    overflow-y: auto;
  
    .layerTree-item {
      @include MarginBottom(10);
      background: none !important;
      color: rgba($color: #ffffff, $alpha: 0.8);
    }
  
    .layerTree-item :hover {
      background: none;
    }
  
    :deep(.el-tree-node:focus > .el-tree-node__content) {
      background: none;
    }
  
    :deep(.el-tree-node__content > .label.el-checkbox) {
      @include PaddingBottom(4);
    }
  
    :deep(.el-checkbox__inner){
      background: none;
    }
  
    :deep(.el-tree-node__label) {
      @include FontSize(14);
    }
  
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
  }
  </style>
  