<template>
    <div class="m-pve-overview">
        <div class="u-info">
            <overview-info> </overview-info>
        </div>
        <div class="m-pve-overview__content">
            <div class="m-pve-overview__left">
                <overview-chart />
            </div>
            <div class="m-pve-overview__right">
                <overview-entity-list />
                <overview-focus-list />
            </div>
        </div>
    </div>
</template>

<script setup>
import overviewInfo from "@/components/jcl/pve/overview_info.vue";
import overviewChart from "@/components/jcl/pve/overview_chart.vue";

import OverviewEntityList from "@/components/jcl/pve/overview_entity_list.vue";
import OverviewFocusList from "@/components/jcl/pve/overview_focus_list.vue";
</script>

<style lang="less" scoped>
.m-pve-overview {
    .u-info {
        margin-bottom: 34px;
    }
    .m-pve-overview__content {
        display: flex;
        gap: 30px;
    }
    .m-pve-overview__left {
        flex: 1;
    }
    .m-pve-overview__right {
        .flex;
        gap: 30px;
    }
}
</style>
