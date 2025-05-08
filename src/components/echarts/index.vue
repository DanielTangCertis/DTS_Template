<template>
  <div class="container" :id="container" ref="chartRef"></div>
</template>

<script lang="ts" setup>
import {
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import * as charts from "echarts";
// export default defineComponent({
const props = withDefaults(defineProps<{
  options: any;
  width?: number;
  height?: number;
  top?: number;
  isFirst?: boolean;
  container?: string;
}>(), {
  height: 200,
  top: 0,
  isFirst: false,
  container: 'container'
})
const chartRef = ref();
const Aecharts: any = reactive({ value: "" });

const changeEcharts = (options: any) => {
  Aecharts.value.setOption(options);
  if (props.isFirst) {
    let index = 0;
    Aecharts.value.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: 0,
    });
    Aecharts.value.on("mouseover", (e: any) => {
      if (e.dataIndex !== index) {
        Aecharts.value.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: index,
        });
      } else {
        Aecharts.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      }
    });
    Aecharts.value.on("mouseout", (e: any) => {
      index = e.dataIndex;
      Aecharts.value.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: e.dataIndex,
      });
    });
  }
};

watch(
  () => props.options,
  (newval) => {
    changeEcharts(newval);
  },
  {
    deep: true,
  }
);

watch(
  () => props.container,
  (newval) => {
    nextTick(() => {
      if (chartRef.value) {
        Aecharts.value = markRaw(charts.init(chartRef.value));
      }
      changeEcharts(props.options);
    });
  },
  {
    // deep: true,
    immediate: true,
  }
);
const Resize = () => {
  console.log(Aecharts.value, "Aechartsresize");
  Aecharts.value.resize();
};

onMounted(() => {
  window.addEventListener("resize", Resize);
});
onUnmounted(() => {
  window.removeEventListener("resize", Resize);
});
</script>

<style lang="scss" scoped>
.container {
  @include boxWidth(v-bind("props.width"));

  @include boxhHeight(v-bind("props.height"));

  @include boxMarginTop(v-bind("props.top"));
  //   background: #000;
  @include BorderRadius(8);
}
</style>
