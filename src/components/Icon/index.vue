<template>
  <i v-if="isElementUiIcon" :class="iconName"> </i>
  <span :title="title" v-else>
    <svg class="svg-icon" aria-hidden="true">
      <use :xlink:href="iconName"></use>
    </svg>
  </span>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from "vue";

const props = withDefaults(defineProps<{
  title?: string;
  icon?: string;
  fontSize?: number;
  color?: string;
}>(), {
  icon: "",
  fontSize: 16,
  color: "#fff",
});

const iconName = computed(() => {
  if (!props.icon) return "";
  return props.icon.includes("el-icon") ? props.icon : `#icon-${props.icon}`;
});

const isElementUiIcon = ref(false);

watchEffect(() => {
  isElementUiIcon.value = (iconName.value ?? "").includes("el-icon");
});
</script>

<style lang="scss" scoped>
i {
  font-size: calc(1vw * #{$heightRatio} * v-bind(fontSize));
  color: v-bind(color);
}

span {
  font-size: calc(1vw * #{$heightRatio} * v-bind(fontSize));
  color: v-bind(color);
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
}
</style>
