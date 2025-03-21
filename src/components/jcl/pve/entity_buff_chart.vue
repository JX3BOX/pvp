<template>
    <div class="m-entity-buff-chart w-card">
        <div class="w-card-title">
            <span>时间轴</span>
            <span class="u-entity-infos">
                <span class="u-entity-info">{{ getEntityName(entity) }}</span>
                <span class="u-entity-info">ID {{ entity }}</span>
                <span class="u-entity-info">参战时长 {{ displayDuration(end.sec) }}</span>
            </span>
            <div class="u-buff-help">
                <el-icon :size="16"><InfoFilled /></el-icon>
                条形图上的数字表示层数变化，*号表示非自然消失，鼠标悬浮可查看详细信息
            </div>
        </div>
        <div class="u-chart" v-loading="loading">
            <v-chart v-if="items.length" autoresize theme="dark" :option="option" class="u-chart"></v-chart>
            <span v-else class="u-empty">上侧选择需要查看的BUFF</span>
        </div>
    </div>
</template>

<script setup>
import { graphic } from "echarts/core";
import VChart from "vue-echarts";
import { getEntityName } from "@/utils/jcl/common";
import { displayDuration } from "@/utils/jcl/commonNoStore";
import { toRefs, computed, ref, watchPostEffect } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store";
import getWorkerResponse from "@/utils/jcl/worker";
import { cloneDeep } from "lodash";

const store = useStore();
const { entity, selectedBuffs } = toRefs(usePve());
const { end } = store.result;

const renderItem = (params, api) => {
    let children = [];
    // 绘制矩形
    const categoryIndex = api.value(3);
    const start = api.coord([api.value(1), categoryIndex]);
    const end = api.coord([api.value(2), categoryIndex]);
    const itemHeight = Math.min(api.size([0, 1])[1] * 0.6, 30);
    const visibleRect = params.coordSys;
    const rectShape = graphic.clipRectByRect(
        {
            x: start[0],
            y: start[1] - itemHeight / 2,
            width: end[0] - start[0],
            height: itemHeight,
        },
        visibleRect
    );
    children.push({
        type: "rect",
        shape: rectShape,
        style: {
            fill: api.visual("color"),
        },
    });
    // 根据stackLogs在矩形上绘制层数变化
    const stackLogs = JSON.parse(api.value(4));
    let lastLeft = Number.MIN_SAFE_INTEGER;
    for (let time in stackLogs) {
        const stackNum = stackLogs[time];
        if (stackNum === 1) continue;
        const point = api.coord([time, categoryIndex]);
        const showText = point[0] > visibleRect.x && point[0] < visibleRect.x + visibleRect.width;
        if (showText && point[0] - lastLeft > 12) {
            lastLeft = point[0];
            children.push({
                type: "text",
                style: {
                    text: stackNum,
                    x: point[0] + 3.5,
                    y: point[1] + 10,
                    textAlign: "center",
                    textVerticalAlign: "middle",
                    textShadowColor: "#000",
                    textShadowBlur: 2,
                    fill: "#fff",
                },
            });
        }
    }
    // 如果是被驱散的在矩形后面绘制icon
    const isDelete = api.value(5);
    const showDelete = end[0] > visibleRect.x && end[0] < visibleRect.x + visibleRect.width;
    if (isDelete && showDelete) {
        children.push({
            type: "text",
            style: {
                text: "*",
                x: end[0] + 3.5,
                y: end[1],
                textAlign: "center",
                textVerticalAlign: "middle",
                textShadowColor: "#000",
                textShadowBlur: 2,
                fill: "#fff",
            },
        });
    }
    return {
        type: "group",
        diffChildrenByName: true,
        children,
    };
};

const option = computed(() => ({
    backgroundColor: "transparent",
    theme: "dark",
    tooltip: {
        formatter: function (params) {
            let { detail } = params.data;
            const duration = ((detail.end - detail.start) / 1000).toFixed(1);
            const start = (detail.start / 1000).toFixed(1);
            const end = (detail.end / 1000).toFixed(1);
            return `${params.marker} ${params.name} <br />
                            BUFF ID: ${detail.id} <br />
                            BUFF来源: ${getEntityName(detail.source)} <br />
                            ${detail.deleteBy ? `BUFF卸除者: ${getEntityName(detail.deleteBy)} <br />` : ""}
                            开始时间: ${start} 秒 <br />
                            结束时间: ${end} 秒 <br />
                            BUFF持续时间: ${duration} 秒`;
        },
    },
    dataZoom: [
        {
            type: "slider",
            filterMode: "weakFilter",
            showDataShadow: false,
            labelFormatter: "",
        },
        {
            type: "inside",
            filterMode: "weakFilter",
        },
    ],
    xAxis: {
        min: end.sec,
        scale: true,
        position: "top",
        axisLabel: {
            formatter: function (val) {
                return (val / 1000).toFixed(1) + " s";
            },
        },
    },
    yAxis: {
        data: categories.value,
        axisTick: {
            show: false,
        },
        axisLabel: {
            formatter: function (val, index) {
                return `{paddingRight|${val}}{icon${index}|}`;
            },
            rich: iconStyles.value,
        },
    },
    series: [
        {
            type: "custom",
            renderItem,
            itemStyle: {
                opacity: 0.8,
            },
            encode: {
                x: [1, 2],
                y: 0,
            },
            data: items.value,
        },
    ],
}));

// 数据相关
const loading = ref(false);
const data = ref([]);
const iconStyles = ref({});
const categories = ref([]);
const items = ref([]);
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_entity_buff_chart", {
        entity: entity.value,
        selectedBuffs: cloneDeep(selectedBuffs.value),
    }).then((result) => {
        data.value = result.data;
        iconStyles.value = result.iconStyles;
        categories.value = result.categories;
        items.value = result.items;
        loading.value = false;
    });
};
watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-entity-buff-chart {
    .flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    .u-entity-infos {
        .ml(8px);

        .fz(14px, 18px);
        .bold;
        color: #8b96a2;

        .u-entity-info {
            .mr(24px);
        }
    }
    .u-buff-help {
        .flex-center;
        gap: 12px;
        flex: 1;
        .fz(14px, 18px);
        float: right;
        color: #d3efff;
    }

    .u-chart {
        flex-grow: 1;
        .flex-center;
    }

    .u-empty {
        color: #b3b3b3;
        .fz(14px, 18px);
        .bold;
    }

    :deep(.vue-echarts-inner) {
        width: 100% !important;
        height: 100% !important;
    }
}
</style>
