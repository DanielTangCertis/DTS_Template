<template>
  <div class="icon-box">
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    width: {
      type: Number,
      default: 30
    },
    height: {
      type: Number,
      default: 30
    }
  }
}
</script>

<style lang="scss">
.icon-box {
  @include boxWidth(v-bind('width'));
  @include boxwHeight(v-bind('height'));

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
