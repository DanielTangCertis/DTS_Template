<!-- header -->
<template>
  <transition appear name="custom-classes-transition"
    enter-active-class="animate__animated animate__faster  animate__fadeInDown "
    leave-active-class="animate__animated animate__faster animate__fadeOutUp ">
    <div v-show="UIShow" class="header">
      <div class="logo">
        <!-- <div class="title">CERTIS</div> -->
        <img src="/src/assets/images/certis_logo/certis-logo-white.png" alt="logo" class="logo-img" />
      </div>
      <div class="tool">
        <div @click="showLayerTree()">
          <el-tooltip class="box-item" effect="dark" content="Layer Tree" placement="bottom">
            <Icon :color="layerTreeShow ? '#7afafe' : '#fff'" :font-size="30" icon="tucengshu" />
          </el-tooltip>
        </div>
        <div @click="showAnimation()">
          <el-tooltip class="box-item" effect="dark" content="Animated Tours" placement="bottom">
            <Icon :color="animationShow ? '#7afafe' : '#fff'" :font-size="26" icon="xunimanyou" />
          </el-tooltip>
        </div>
        <div @click="showWeather()">
          <el-tooltip class="box-item" effect="dark" content="Weather" placement="bottom">
            <Icon :color="weatherShow ? '#7afafe' : '#fff'" :font-size="30" icon="qixiangjiance" />
          </el-tooltip>
        </div>
        <div @click="showUI()">
          <el-tooltip class="box-item" effect="dark" content="Toggle HUD" placement="bottom">
            <Icon :color="UIShow ? '#7afafe' : '#fff'" :font-size="26" icon="tiankonghe" />
          </el-tooltip>
        </div>
      </div>
      <div class="time">
        <span>
          {{ time }}
        </span>
      </div>
    </div>
  </transition>
  <transition appear name="custom-classes-transition"
    enter-active-class="animate__animated animate__faster  animate__fadeInDown "
    leave-active-class="animate__animated animate__faster animate__fadeOutUp ">
    <div v-show="!UIShow" class="showUI" @click="showUI()">
      <el-tooltip effect="dark" content="Toggle HUD" placement="bottom">
        <Icon :color="UIShow ? '#7afafe' : '#fff'" :font-size="26" icon="tiankonghe" />
      </el-tooltip>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import Dayjs from 'dayjs'
import { onMounted, onUnmounted, ref } from 'vue'
import { useHeaderStore } from '@/stores/headerStore'
import Icon from '@/components/Icon/index.vue'

const weatherShow = ref(false);
const layerTreeShow = ref(false);
const animationShow = ref(false);
const UIShow = ref(true);
const headerStore = useHeaderStore()
let timer = ref(null)
// 天气显示-点击事件
const showWeather = () => {
  weatherShow.value = !weatherShow.value;
  layerTreeShow.value = false;
  animationShow.value = false;
  headerStore.setShowLayerTree(layerTreeShow.value);
  headerStore.setShowAnimation(animationShow.value);
  headerStore.setShowWeather(weatherShow.value);
}
const showLayerTree = () => {
  layerTreeShow.value = !layerTreeShow.value;
  weatherShow.value = false;
  animationShow.value = false;
  headerStore.setShowWeather(weatherShow.value);
  headerStore.setShowAnimation(animationShow.value);
  headerStore.setShowLayerTree(layerTreeShow.value);
}
const showAnimation = () => {
  animationShow.value = !animationShow.value;
  layerTreeShow.value = false;
  weatherShow.value = false;
  headerStore.setShowWeather(weatherShow.value);
  headerStore.setShowLayerTree(layerTreeShow.value);
  headerStore.setShowAnimation(animationShow.value);
}
const showUI = () => {
  UIShow.value = !UIShow.value;
  headerStore.setShowUI(UIShow.value)
  fdapi.settings.setMainUIVisibility(!UIShow.value)
}
// 获取当前时间
const date: any = ref('')
const time: any = ref('')
const get_Date_Time = () => {
  let date_time = Dayjs().format('YYYY-MM-DD/HH:mm:ss').split('/')
  date.value = date_time[0]
  time.value = date_time[1]
}

let timeInterval = ref(null)
onMounted(async () => {
  get_Date_Time()
  timeInterval.value = setInterval(() => {
    get_Date_Time()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timeInterval.value)
  clearTimeout(timer.value)
})
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  @include wHeight(60);
  justify-content: center;
  background: rgba(0, 0, 0, 0.541);
  top: 0;
  @include FontSize(12);
  z-index: 10;
  @include MarginBottom(-60);

  .logo {
    @include Width(400);
    @include wHeight(60);
    @include LineHeight(60);
    text-align: center;
    position: absolute;
    @include Left(0);
    right: 0;
    top: 0;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .logo-img {
      @include Width(150);
      @include MarginRight(10);
    }

    .title {
      @include FontSize(24);
      @include LetterSpacing(3);
      @include wHeight(40);
      font-family: Oppo, serif;
      @include MarginBottom(20);
      font-weight: 1000;
      color: #fff
    }

    .titeng {
      @include FontSize(14);
    }
  }

  .tool {
    position: absolute;
    @include wHeight(60);
    top: 0;
    z-index: 10;
    @include Right(120);
    @include Width(130);
    font-family: SJyunhei, serif;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    @include FontSize(20);
    cursor: pointer;

    img {
      @include Width(30);

      transition: transform 0.3s;
    }

    img:hover {
      transform: scale(1.2);
    }
  }

  .time {
    position: absolute;
    color: rgba($color: #ffffff, $alpha: 0.8);
    @include wHeight(60);
    @include Top(0);
    @include Right(20);
    @include FontSize(16);
    font-family: SJyunhei;
    display: flex;
    justify-content: center;
    align-items: center;

    span:nth-of-type(1) {
      display: inline-block;
      @include MarginRight(10);
    }
  }
}
.showUI {
  position: absolute;
  @include Top(17);
  @include Right(138);
  z-index: 999;
  pointer-events: auto;
  opacity: 0.4;
  transform: opacity 0.8s;
}
.showUI:hover {
  opacity: 1;
}
</style>
