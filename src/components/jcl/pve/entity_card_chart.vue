<template>
    <div class="m-pie-card">
        <div class="u-pie" v-loading="loading">
            <v-chart ref="echart" theme="dark" :option="option" autoresize />
        </div>
        <div class="m-pie-info">
            <p class="u-title">总{{ title }}</p>
            <p class="u-value">{{ overview.value || "-" }}</p>
            <p>{{ displayDigits(overview.vps) }}/s 会心 {{ displayPercent(overview.critRate) }}</p>
        </div>
    </div>
</template>

<script setup>
import VChart from "vue-echarts";
import { use } from "echarts/core";
import "echarts/lib/component/title";
import getWorkerResponse from "@/utils/jcl/worker";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { toRefs, ref, watchPostEffect } from "vue";
import { displayDigits, displayPercent } from "@/utils/jcl/commonNoStore";

import { usePve } from "@/pages/jcl/store_pve.js";
import { useStore } from "@/pages/jcl/store";

use([CanvasRenderer, PieChart, TooltipComponent]);

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
});

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

const title = computed(() => {
    return tabs.find((tab) => tab.name === props.type).title || "-";
});
// data
const loading = ref(false);
const { entity } = toRefs(usePve());

const option = computed(() => {
    const overviewValue = overview.value.value || "0";
    const value = overviewValue ? parseInt(overviewValue.replace(/,/g, ""), 10) : 0;
    const total = totalValue.value - value;
    const percentage = value ? ((value / total) * 100).toFixed(2) : "0.00";

    return {
        backgroundColor: "#282828",
        title: {
            text: `${percentage}`,
            x: "center",
            y: "center",
            textStyle: {
                fontSize: "14px",
                fontWeight: "normal",
                color: "#fff",
            },
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
            {
                name: "数值占比",
                type: "pie",
                radius: ["50%", "90%"],
                center: ["50%", "50%"],
                data: [
                    { value: total, name: `团队${title.value}`, itemStyle: { color: "#404040" } },
                    { value: value, name: `单位${title.value}`, itemStyle: { color: "#FF69B4" } },
                ],
                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
                itemStyle: {
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: "#282828",
                },
            },
        ],
    };
});

const store = useStore();

const totalValue = computed(() => {
    const { stats, entities } = store.result;
    if (!entities) return [];
    // 求目标NPC，应该是承伤最高的那个
    for (let entity in stats.beDamaged) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") continue;
    }
    // 求全团伤害
    let totalDamage = 0;
    let totalTreat = 0;
    let totalBeDamaged = 0;
    let totalBeTreat = 0;
    for (let entity in stats.damage) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalDamage += stats.damage[entity].value;
        }
    }
    for (let entity in stats.treat) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalTreat += stats.treat[entity].value;
        }
    }
    for (let entity in stats.beDamaged) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalBeDamaged += stats.beDamaged[entity].value;
        }
    }
    for (let entity in stats.beTreated) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalBeTreat += stats.beTreated[entity]?.value ?? 0;
        }
    }
    switch (props.type) {
        case "damage":
            return totalDamage;
        case "treat":
            return totalTreat;
        case "beDamaged":
            return totalBeDamaged;
        case "beTreated":
            return totalBeTreat;
        default:
            break;
    }
});

const overview = ref([]);

const echart = ref(null);
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_entity_stat_chart", {
        entity: entity.value,
        entityTab: props.type,
    }).then((data) => {
        overview.value = data.overview;
        loading.value = false;
    });
};
watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-pie-card {
    .flex;
    gap: 10px;
    align-items: center;
    .u-pie {
        width: 100px;
        height: 100px;
    }
    .m-pie-info:not(.u-title) {
        .fz(14px,18px);
        .flex;
        flex-direction: column;
        gap: 4px;
        color: #fff;
        font-weight: 600;
        .u-value {
            .fz(24px,30px);
        }
    }
}
</style>
