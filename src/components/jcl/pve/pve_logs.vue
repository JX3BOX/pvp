<template>
    <div class="m-pve-logs">
        <logs-filter @apply="list.updateData()"></logs-filter>
        <logs-list ref="list"></logs-list>
    </div>
</template>

<script setup>
import LogsFilter from "./logs_filter.vue";
import LogsList from "./logs_list.vue";
import { ref } from "vue";

const list = ref(null);
</script>

<style lang="less">
.m-pve-logs {
    .mt(20px);
    // width: 1440px;
    display: flex;
    gap: 20px;
}
</style>
