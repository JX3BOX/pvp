<template>
    <div class="m-pie-card">
        <div class="u-pie" v-loading="loading">
            <v-chart ref="echart" theme="dark" :option="option" autoresize />
        </div>
        <div class="m-pie-info">
            <p class="u-title">{{ selectedSkill?.name }}</p>
            <p>总次数 {{ selectedSkill?.count }}</p>
            <p class="u-value">
                <span> 命中 {{ selectedSkill?.hit }} </span>
                <span> 运功 {{ selectedSkill?.cast }} </span>
                <span> 偏离 {{ selectedSkill?.miss }} </span>
            </p>
            <p>平均间隔 {{ displayDigits(selectedSkill?.interval) }}/s</p>
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
import { usePve } from "@/pages/jcl/store_pve";
import { displayDigits } from "@/utils/jcl/commonNoStore";

import { ref } from "vue";

const { selectedSkill } = toRefs(usePve());

use([CanvasRenderer, PieChart, TooltipComponent]);

const loading = ref(false);

const option = ref({
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
const echart = ref(null);
const updateData = () => {
    loading.value = true;

    option.value.series[0].data = [
        {
            id: "偏离",
            name: "偏离",
            value: selectedSkill.value?.miss,
        },
        {
            id: "命中",
            name: "命中",
            value: selectedSkill.value?.hit,
        },
        {
            id: "运功",
            name: "运功",
            value: selectedSkill.value?.cast,
        },
    ];
    loading.value = false;
};

watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-pie-card {
    .flex;
    gap: 10px;
    align-items: center;
    .mb(25px);
    .u-pie {
        width: 100px;
        height: 100px;
    }
    .m-pie-info {
        .fz(14px,18px);
        .flex;
        flex-direction: column;
        gap: 4px;
        color: #fff;
        .u-title {
            .fz(16px,24px);
            .bold;
            .mb(4px);
        }
        .u-value {
            .fz(12px,16px);
            span {
                display: inline-block;
                width: 80px;
            }
        }
    }
}
</style>
