<template>
    <div class="page2">
        <LeftBox :delay="0.3">
        </LeftBox>
        <RightBox :delay="0.3">
        </RightBox>
    </div>
</template>

<script lang="ts" setup>
import LeftBox from '@/components/Layout/leftBox/index.vue'
import RightBox from '@/components/Layout/rightBox/index.vue'

</script>
<style lang="scss" scoped>
.page2 {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>