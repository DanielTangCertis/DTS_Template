<template>
    <transition appear name="custom-classes-transition" enter-active-class="animate__animated   animate__fadeInUp"
        leave-active-class="animate__animated  animate__fadeOutDown">
        <div class="footer">
            <div class="footer_link">
                <div @click="LinkClick(item)" :class="PagePath.indexOf(item.path) !== -1 ? 'link isactive' : 'link'"
                    v-for="item in Link" :key="item.key">
                    <div class="link-img">
                        <transition appear name="custom-classes-transition"
                            enter-active-class="animate__animated    animate__fadeIn"
                            leave-active-class="animate__animated   animate__fadeOut">
                            <img :src="item.activeImg" alt="" v-if="PagePath.indexOf(item.path) !== -1" />
                        </transition>
                        <transition appear name="custom-classes-transition"
                            enter-active-class="animate__animated    animate__fadeIn"
                            leave-active-class="animate__animated   animate__fadeOut">
                            <img :src="item.img" alt="" v-if="PagePath.indexOf(item.path) === -1" />
                        </transition>
                    </div>
                    <div class="link_name">
                        <span>
                            {{ item.name }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import img1Default from '@/assets/images/link/1级菜单_icon3_默认.png'
import img1Active from '@/assets/images/link/1级菜单_icon3_选中.png'
import img2Default from '@/assets/images/link/1级菜单_icon5_默认.png'
import img2Active from '@/assets/images/link/1级菜单_icon5_选中.png'
import img3Default from '@/assets/images/link/1级菜单_icon1_默认.png'
import img3Active from '@/assets/images/link/1级菜单_icon1_选中.png'
// 路由监听
onBeforeRouteUpdate(to => {
  PagePath.value = to.path
})

// 路由信息
const Link = reactive([
  {
    name: 'Module1',
    key: 1,
    path: '/home/page1',
    icon: 'jianceyujing',
    img: img1Default,
    activeImg: img1Active
  },
  {
    name: 'Module2',
    key: 2,
    path: '/home/page2',
    icon: 'rengongzhinengdanao',
    img: img2Default,
    activeImg: img2Active
  },
  {
    name: 'Module3',
    key: 3,
    path: '/home/page3',
    icon: 'rengongzhinengdanao',
    img: img3Default,
    activeImg: img3Active
  }
])
const Router = useRouter()
const Route = useRoute()
const PagePath = ref('')
// 一级路由点击
const LinkClick = (val: { name: string; key: number; path: string; icon: string }) => {
  Router.push({
    path: val.path
  })
  PagePath.value = val.path
}
const rain: any = ref([])
const link_icon = ref()
onMounted(() => {
  PagePath.value = Route.path
})
</script>

<style lang="scss" scoped>
.footer {
    position: absolute;
    @include Bottom(40);
    @include Width(700);
    left: 0;

    right: 0;
    margin: auto;
    z-index: 10;
    @include wHeight(102);

    .footer_link {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        // top: 0;
        @include Top(120);
        margin: auto;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;

        .link {
            @include Width(152);
            @include wHeight(38);
            @include Margin(0, 27, 0, 27);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            cursor: pointer;
            @include FontSize(18);
            transition: all 0.5s;

            .link-img {
                @include Width(152);
                position: relative;
                transition: all 0.3s;
                height: 100%;
                display: flex;
                justify-content: center;

                img {
                    // @include wHeight(82);

                    @include Width(130);
                    transition: all 0.3s;
                    position: absolute;
                    transform: translate(0, -90%);
                }
            }

            &.isactive {
                background-size: 100% 100%;
                color: #ffffff;
                @include LetterSpacing(1);
            }

            &.link::before {
                content: '';
                position: absolute;
                @include Width(22);
                @include wHeight(22);
                //background: url("~@/assets/images/基础/header/point@2x.png") no-repeat center/cover;
                @include Left(-37);
            }

            &.link:nth-of-type(1)::before {
                content: '';
                position: absolute;
                @include Width(94);
                @include wHeight(10);
                //background: url("~@/assets/images/基础/header/menuleft@2x.png") no-repeat center/cover;
                @include Left(-94);
            }

            &.link:last-child::after {
                content: '';
                position: absolute;
                @include Width(94);
                @include wHeight(10);
                //background: url("~@/assets/images/基础/header/menuright@2x.png") no-repeat center/cover;
                // @include Left(94);
                left: 100%;
            }

            .link_name {
                position: absolute;
                @include Bottom(55);
                @include Width(130);
                @include wHeight(40);
                @include FontSize(18);
                @include LetterSpacing(5);
                font-family: Oppo, serif;
                color: rgba($color: #ffffff, $alpha: 0.8);

                left: 0;
                right: 0;
                margin: auto;
                @include MarginTop(10);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .toplinks {
                position: fixed;
                @include Bottom(105);
                left: 0;
                right: 0;
                margin: auto;
                @include Width(800);
                @include wHeight(40);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10;

                .toplink {
                    @include Width(140);
                    @include wHeight(40);
                    @include Margin(0, 20, 0, 20);
                    @include FontSize(18);
                    color: #ffffff98;
                    display: flex;
                    font-family: Oppo;

                    justify-content: center;
                    align-items: center;

                    background-size: 100% 100%;

                    &.toplink_active {
                        //background: url("~@/assets/images/基础/header/btn_当前选中@2x.png") no-repeat center/cover;
                        background-size: 100% 100%;
                        color: #98deff;

                        .svg_left {
                            // font-size: 3000px;
                            color: #ffffff;
                            transform: scale(5);
                        }
                    }
                }
            }
        }
    }

    .link_icon {
        position: absolute;
        @include Width(36);
        @include wHeight(38);
        @include Bottom(-19);
        @include CalcLeft(v-bind(Key));
        transition: left 0.5s;

        img {
            width: 100%;
        }
    }
}
</style>
