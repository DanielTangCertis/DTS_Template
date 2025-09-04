<template>
  <Left_box :delay="0.3">
    <div class="contentBox">
      <Lease_title>Expenditure</Lease_title>
      <div class="row-content">
        <div class="traffic-data">
          <div class="row">
            <div class="traffic-item">
              <IconBox :width="30" :height="30">
                <img src="@/assets/images/panel/icon_gdp@2x.png" />
              </IconBox>
              <div class="traffic-content">
                <div class="label">YTD</div>
                <div class="value">
                  23958.3
                  <div class="suffix">k</div>
                </div>
              </div>
            </div>
            <div class="traffic-item">
              <IconBox :width="30" :height="30">
                <img src="@/assets/images/panel/icon_income@2x.png" />
              </IconBox>
              <div class="traffic-content">
                <div class="label">Monthly Maintenance</div>
                <div class="value">
                  4.639
                  <div class="suffix">k</div>
                </div>
              </div>
            </div>
            <div class="traffic-item">
              <IconBox :width="30" :height="30">
                <img src="@/assets/images/panel/icon_traffic@2x.png" />
              </IconBox>
              <div class="traffic-content">
                <div class="label">Monthly Utilities</div>
                <div class="value">
                  11.744
                  <div class="suffix">k</div>
                </div>
              </div>
            </div>
            <div class="traffic-item">
              <IconBox :width="30" :height="30">
                <img src="@/assets/images/panel/icon_stuck@2x.png" />
              </IconBox>
              <div class="traffic-content">
                <div class="label">Monthly Security</div>
                <div class="value">
                  8.5
                  <div class="suffix">k</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <Lease_title>Incidents Reported by Category (YTD)</Lease_title>
      <Echarts :options="option2()" :height="400" :width="400"></Echarts>
    </div>
    <div class="contentBox">
      <Lease_title>Standard deviation of incidents reported by Category</Lease_title>
      <Echarts :options="option3()" :height="250" :width="350"></Echarts>
    </div>
  </Left_box>
</template>

<script setup>
import Left_box from '@/components/Layout/leftBox/index.vue'
import Lease_title from '@/components/leaseTitle/index.vue'
import Echarts from '@/components/echarts/index.vue'
import IconBox from '@/components/Layout/IconBox/index.vue'
import { option2, option3 } from '../options/index'
</script>

<style lang="scss" scoped>
.box {
  @include MarginBottom(15);
}

.contentBox {
  @include Padding(0, 50, 0, 0);
}

.row-content {
  display: flex;

  .traffic-data {
    @include Padding(16, 0, 0, 0);
    width: 100%;

    .row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      flex-wrap: wrap;
      @include Padding(0, 15, 15, 15);
      justify-content: space-between;

      .traffic-item {
        display: flex;
        @include MarginRight(29);

        &:last-child {
          margin-right: 0;
        }

        .traffic-content {
          display: flex;
          flex-direction: column;
          @include MarginLeft(11);

          .label {
            @include FontSize(14);
            color: #ffffff;
            @include MarginBottom(5);
          }

          .value {
            @include FontSize(18);
            color: #00ffff;
            display: flex;
            font-family: Tencent, serif;

            .suffix {
              @include FontSize(16);
              justify-self: flex-end;
              align-self: flex-end;
              color: #93c0ec;
              @include MarginLeft(12.7);
              font-family: Oppo, serif;
            }
          }
        }
      }

      .traffic-item:first-child {
        @include MarginBottom(25);
      }
    }
  }
}
</style>
