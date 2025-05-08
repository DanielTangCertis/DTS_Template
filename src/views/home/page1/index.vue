<template>
    <div class="page1">
        <Left></Left>
        <Right></Right>
    </div>
</template>

<script setup>
import Left from './/Panel/left/index.vue'
import Right from './/Panel/right/index.vue'
</script>

<style lang="scss" scoped>
.page1 {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>