<template>
    <transition
      appear
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__faster animate__fadeInDown"
      leave-active-class="animate__animated animate__faster animate__fadeOutUp"
    >
      <div class="weather">
        <div class="set-box">
          <div class="weather-items">
            <div
              class="item"
              v-for="(item, index) in weatherItems"
              :key="index"
              @click="setWeather(item.options)"
            >
              <img class="img" :src="item.icon" alt="" />
              <span class="text">{{ item.name }}</span>
            </div>
          </div>
          <div class="slider__content">
            <div class="slider--time">{{ sliderFormat(currentTime) }}</div>
            <el-slider
              v-model="currentTime"
              :max="86380"
              :min="1"
              :step="60 * 10"
              :show-tooltip="false"
              class="elSlider"
              @change="changeTimeSilde"
            />
          </div>
          <div class="flex">
            <div class="open-dark">
              <div class="dark-item">
                <span>黑暗模式:</span>
                <el-switch
                  v-model="isDark"
                  @change="changeDarkMode"
                  class="ml-2"
                  style="--el-switch-on-color: #0c0c0c; --el-switch-off-color: #ccc"
                />
              </div>
            </div>
            <div class="init"><span @click="weatherInit">初始化</span></div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { changeWeather } from './methods/changeWeather'
  import sunnyIcon from './img/晴天.png'
import cloudyIcon from './img/多云.png'
import rainIcon from './img/下雨.png'
import snowIcon from './img/下雪.png'
  const currentTime = ref(8 * 60 * 60 + 53 * 60)
  const isDark = ref(false)
  
  const weatherItems = [
    {
      name: '晴天',
      icon: sunnyIcon,
      options: {
        cloudDensity: 0.1,
        SunIntensity: 15,
      },
    },
    {
      name: '多云',
      icon: cloudyIcon,
      options: {
        cloudDensity: 0.8,
        cloudParam: [[0.6, 0.6, 0.6, 1], 3],
        lowCloud: [0.7, 0.5, 0.2, 5, 0],
        SunIntensity: 7,
      },
    },
    {
      name: '下雨',
      icon: rainIcon,
      options: {
        cloudDensity: 0.8,
        cloudParam: [[0.6, 0.6, 0.6, 1], 3],
        lowCloud: [0.7, 0.5, 0.2, 5, 0],
        sunIntensity: 8,
        rainParam: [0.2, 0.2, 0.2, null, 0.2, 0.05],
      },
    },
    {
      name: '下雪',
      icon: snowIcon,
      options: {
        cloudDensity: 0.8,
        cloudParam: [[0.6, 0.6, 0.6, 1], 3],
        lowCloud: [0.7, 0.5, 0.2, 5, 0],
        sunIntensity: 8,
        snowParam: [0.2, 0.2, 0.2, null, 0.2, 0.05],
      },
    },
  ]
  
  function setWeather(options: any) {
    changeWeather(options)
  }
  
  function sliderFormat(time: number): string {
    const [hour, minute] = getHourMinute(time)
    return `${hour}:${minute}`
  }
  
  function changeTimeSilde(time: number) {
    const [hour, minute] = getHourMinute(time)
    fdapi.weather.setDateTime(null, null, null, Number(hour), Number(minute))
  }
  
  function getHourMinute(time: number): [string, string] {
    const [hourStr, fraction] = (time / 60 / 60).toFixed(2).split('.')
    const hour = hourStr
    const minutes = Math.floor(Number('0.' + fraction) * 60)
      .toString()
      .padStart(2, '0')
    return [hour, minutes]
  }
  
  function changeDarkMode(flag: boolean) {
    fdapi.weather.setDarkMode(flag)
  }
  
  function weatherInit() {
    fdapi.reset(2 | 4)
    isDark.value = false
    currentTime.value = 8 * 60 * 60 + 53 * 60
  }
  </script>
  <style lang="scss" scoped>
  .weather {
      position: absolute;
      @include Width(260);
      @include Top(80);
      @include Right(40);
      @include Padding(10, 10, 10, 10);
      border-radius: 2%;
      margin: auto;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 10;
      background: rgba(0, 0, 0, 0.331);
          font-family: Tencent;
      .set-box {
          display: grid;
          grid-template-rows: 2fr 1fr 1fr;
          .weather-items {
              display: flex;
              @include MarginBottom(10);
              .item {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  @include Padding(10, 15, 10, 15);
                  cursor: pointer;
          
                  .img {
                      @include Width(30);
                      @include wHeight(30);
                  }
          
                  .text {
                      color: rgba($color: #ffffff, $alpha: 0.8);
                      @include FontSize(14);
                      @include MarginTop(5);
                  }
              }
          }
          .slider__content {
              display: flex;
              align-items: center;
              @include wHeight(30);
              @include Padding(0, 25, 0, 15);
  
              .slider--time {
                  color: #fff;
                  @include Width(40);
                  @include FontSize(14);
              }
  
              .elSlider {
                  @include Width(160);
                  @include MarginLeft(10);
                  border-radius: 50%;
  
                  ::v-deep(.el-slider__bar) {
                      animation: liuguang 2s infinite linear;
                  }
  
                  ::v-deep(.el-slider__runway) {
                      background-color: rgba(0, 0, 0, 0.258);
                  }
  
                  ::v-deep(.el-slider__button) {
                      @include Width(15);
                      @include wHeight(15);
                      @include MarginLeft(8);
                      border-color: rgb(102, 221, 255);
                      background: radial-gradient(rgba(102, 221, 255, 0.9), rgba(0, 0, 0, 0.8));
                  }
              }
          }
          .flex {
              display: flex;
              .open-dark {
                  display: flex;
                  justify-content: space-between;
                  @include FontSize(16);
                  @include Padding(0, 25, 0, 12);
          
                  .dark-item {
                      display: flex;
                      align-items: center;
                  }
          
                  span {
                      color: rgba($color: #ffffff, $alpha: 0.8);
                      @include MarginRight(10);
                  }
              }
          
              .init {
                  cursor: pointer;
                  @include FontSize(16);
                  @include MarginTop(8);
                  @include MarginLeft(10);
          
                  span {
                      border: 1px solid #fff;
                      border-radius: 5px;
                      color: rgba($color: #ffffff, $alpha: 0.8);
                      @include Padding(3, 5, 3, 5);
          
                      &:hover {
                          color: #409eff;
                      }
                  }
              }
          }
      }
  }
  </style>