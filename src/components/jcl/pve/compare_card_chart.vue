<template>
    <template v-if="show">
        <empty-guide :rotate="-180" :tips="['请选择单位']" :grow="false"></empty-guide>
    </template>
    <div v-else class="m-pie-card">
        <div class="m-pie-info">
            <p>总{{ title }}</p>
            <p class="u-value">{{ total }}</p>
            <p>
                平均 {{ displayDigits(vps) }}/s 会心
                {{ displayPercent(critRate) }}
            </p>
        </div>
        <div class="u-pie-list" v-loading="loading">
            <div class="u-pie">
                <v-chart ref="echart" theme="dark" :option="teamOption" autoresize />
                <p class="u-title">团队占比</p>
            </div>
            <div class="u-pie">
                <v-chart ref="echart" theme="dark" :option="entityOption" autoresize />
                <p class="u-title">单位对比</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import "echarts/lib/component/title";
import EmptyGuide from "@/components/jcl/common/empty_guide.vue";

import { ref, watchPostEffect } from "vue";
import getWorkerResponse from "@/utils/jcl/worker";
import { usePve } from "@/pages/jcl/store_pve";
import { displayDigits, displayPercent } from "@/utils/jcl/commonNoStore";

use([CanvasRenderer, PieChart, TooltipComponent]);

const { compareEntity } = toRefs(usePve());
// data
const loading = ref(false);
const total = ref(0);
const vps = ref(0);
const critRate = ref(0);
const echart = ref(null);

const show = computed(() => {
    // 是否有选中的
    return compareEntity.value.filter((item) => item).length == 0;
});

const props = defineProps({
    statType: {
        type: String,
        required: true,
    },
});

const entityOption = ref({
    backgroundColor: "#282828",
    title: {
        text: "",
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
            data: [],
            // selectedMode: "multiple",
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
});
const teamOption = ref({
    backgroundColor: "#282828",

    title: {
        text: "",
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
            data: [],
            // selectedMode: "multiple",
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
    return tabs.find((tab) => tab.name === props.statType).title || "-";
});

const getItemColor = (id) => {
    const index = compareEntity.value.findIndex((item) => item === id);
    switch (index) {
        case 0:
            return "rgba(255, 97, 97, 1)";
        case 1:
            return "rgba(40, 207, 90, 1)";
        case 2:
            return "rgba(65, 105, 225, 1)";
        case 3:
            return "rgba(232, 204, 58, 1)";
        default:
            return "rgba(28, 28, 28, 0.8)";
    }
};
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_compare_pie", {
        statType: props.statType,
        compareEntity: compareEntity.value.join(","),
    }).then(({ result, total: _total, vps: _vps, critRate: _critRate, teamTotal }) => {
        total.value = _total;
        vps.value = _vps;
        critRate.value = _critRate;
        const data = result.map((item) => {
            return {
                ...item,
                itemStyle: {
                    color: getItemColor(item.id),
                },
            };
        });
        if (data.length) {
            entityOption.value.series[0].data = data;
        } else {
            entityOption.value.series[0].data = [
                { itemStyle: { color: "rgba(28, 28, 28, 0.8)" }, name: "暂无数据", value: 0 },
            ];
        }

        const teamValue = teamTotal - data.reduce((acc, cur) => acc + cur.value, 0);

        const teamData = [
            ...data,
            { id: "team", itemStyle: { color: "rgba(28, 28, 28, 0.8)" }, name: "团队", value: teamValue },
        ];

        teamOption.value.series[0].data = teamData;

        loading.value = false;
    });
};

watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-pie-info {
    .fz(14px,18px);
    .flex;
    .mb(20px);
    flex-direction: column;
    gap: 4px;
    color: #fff;
    font-weight: 600;
    .u-value {
        .fz(24px,30px);
    }
}
.m-pie-card {
    .flex;
    gap: 10px;
    flex-direction: column;
    .u-pie-list {
        display: flex;
        gap: 20px;
    }
    .u-pie {
        width: 100px;
        height: 100px;
        .u-title {
            padding-top: 10px;
            text-align: center;
        }
    }
}
</style>
