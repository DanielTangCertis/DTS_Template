<template>
    <Right_box :delay="0.3">
        <div class="div">
            <div class="contentBox">
                <Lease_title>Crowd Flow</Lease_title>
                <Echarts :options="option1()" :height="250" :width="350"></Echarts>
            </div>
            <div class="contentBox">
                <Lease_title>Personnel Overview</Lease_title>
                <div class="info_list">
                    <div class="item" v-for="item in personInfoList" :key="item.info">
                        <div class="info">
                            <img class="img" src="@/assets/images/panel/in.png" alt="" />
                            <span>{{ item.info }}</span>
                        </div>
                        <div class="count">
                            {{ item.count }}
                            <span>{{ item.unit }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contentBox">
                <Lease_title>Add Label Here</Lease_title>
                <Echarts :options="option4()" container="emergencylbox2" :height="300" :width="350"></Echarts>
            </div>
        </div>
    </Right_box>
</template>

<script setup>
import Lease_title from '@/components/leaseTitle/index.vue'
import Right_box from '@/components/Layout/rightBox/index.vue'
import Echarts from '@/components/echarts/index.vue'

import { option1, option4 } from '../options/index'
import { reactive } from 'vue'

const personInfoList = reactive([
    {
        count: 57,
        info: 'Staff',
        unit: '%'
    },
    {
        count: 21.8,
        info: 'Visitors',
        unit: '%'
    },
    {
        count: 5.5,
        info: 'Contractors',
        unit: '%'
    },
    {
        count: 9.3,
        info: 'Security',
        unit: '%'
    },
    {
        count: 6.4,
        info: 'Maintenance',
        unit: '%'
    }
])
</script>
<style lang="scss" scoped>
.div {
    @include MarginBottom(15);
}

.contentBox {
    @include Width(350);
    @include Padding(0, 0, 0, 90);
}

.info_list {
    @include MarginBottom(10);
    @include MarginLeft(10);
    @include Width(350);

    .item {
        display: flex;
        @include Width(350);
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ffffff2a;
        @include Padding(8, 5, 8, 5);

        .info {
            @include FontSize(14);
            display: flex;
            align-items: center;

            .img {
                margin-right: 5px;
            }
        }

        .count {
            @include FontSize(18);
            font-family: PangMenZhengDao;
            color: #00ffff;
        }
    }
}
</style>
