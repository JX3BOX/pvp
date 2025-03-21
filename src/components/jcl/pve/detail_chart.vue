<template>
    <div class="m-entity-chart">
        <div class="w-card m-chart-box">
            <!-- 切换伤害/治疗/BUFF分析 -->
            <div class="u-filter-items">
                <div
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :class="{ 'is-active': entityTab == tab.name }"
                    @click="switchTab(tab.name)"
                    class="u-filter-item"
                >
                    {{ tab.title }}
                </div>
            </div>
            <template v-if="entityTab === 'buff'">
                <entity-buff-table></entity-buff-table>
            </template>
            <template v-else-if="entityTab === 'skill'">
                <entity-skill-chart></entity-skill-chart>
            </template>
            <template v-else>
                <!-- 单位图表以及总览 -->
                <entity-chart></entity-chart>
            </template>
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { usePve } from "@/pages/jcl/store_pve";

import EntityChart from "./entity_view_chart.vue";

import EntityBuffTable from "./entity_buff_table.vue";

const { entityTab } = toRefs(usePve());

const tabs = [
    {
        name: "damage",
        title: "伤害",
    },
    {
        name: "treat",
        title: "治疗",
    },
    {
        name: "beDamaged",
        title: "承伤",
    },
    {
        name: "beTreated",
        title: "承疗",
    },
];
const switchTab = (tab) => {
    if (tab === entityTab.value) return;
    entityTab.value = tab;
};
</script>

<style lang="less">
.m-chart-box {
    height: 390px;
    padding: 20px;
    border-radius: 16px;
    background: #282828;
    display: flex;
    flex-direction: column;
    .u-filter-items {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
        height: 26px;
        .u-filter-item {
            cursor: pointer;
            .fz(20px,26px);
            color: rgba(255, 255, 255, 0.3);
            font-weight: bold;
            &.is-active {
                color: #fff;
            }
        }
    }
    .m-chart {
        flex: 1;
    }
}
</style>
