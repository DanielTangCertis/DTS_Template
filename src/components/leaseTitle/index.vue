<template>
  <div class="alease_title_left">
    <Icon :icon="icon" :fontSize="24" class="title_icon" />
    <div class="title-text">
      <slot>设备状态</slot>
      <div class="title-text-bottom">
        <slot name="slot-bottom">Equipment state</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  left?: number
  icon?: string
}>(), {
  icon: 'tucengshu'
})
</script>

<style lang="scss" scoped>
.alease_title_left {
  position: relative;
  font-family: Oppo;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @include Width(350);
  @include hHeight(50);
  @include FontSize(16);
  @include MarginBottom(5);
  overflow: hidden;
  background: url("./tiltle_s@2x.png") no-repeat;
  background-size: 100% 100%;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  .title_icon {
    display: flex;
    justify-content: center;
    align-items: center;
    @include Width(32);
    @include wHeight(32);
  }

  .title-text {
    flex: 1;
    @include MarginLeft(9);
    position: relative;
    @include Top(1);
    width: fit-content;

    .title-text-bottom {
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      color: #ffffff80;
      @include FontSize(10);
    }
  }
}
</style>
