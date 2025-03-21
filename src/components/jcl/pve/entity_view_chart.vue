<template>
    <div class="m-entity-chart" v-loading="loading">
        <div v-if="xData.length === 0" class="u-empty-tip">该单位没有相关数据</div>
        <template v-else>
            <div class="u-chart">
                <v-chart ref="echart" theme="dark" :option="option" autoresize @datazoom="handleDatazoom" />
            </div>
            <!-- <div class="u-overview">
                <span v-if="overview.name" class="u-overview-item">{{ overview.name }}</span>
                <span class="u-overview-item">ID {{ overview.id }}</span>
                <span class="u-overview-item">参战时长 {{ displayDuration(overview.duration) }}</span>
                <span class="u-overview-item">总次数 {{ overview.count || "-" }}</span>
                <span class="u-overview-item">总数值 {{ overview.value || "-" }}</span>
                <span class="u-overview-item">每秒数值 {{ displayDigits(overview.vps) }}</span>
                <span class="u-overview-item">会心率 {{ displayPercent(overview.critRate) }}</span>
            </div> -->
        </template>
    </div>
</template>

<script setup>
import { graphic } from "echarts/core";
import VChart from "vue-echarts";

import { debounce } from "lodash-es";
import { computed, toRefs, ref } from "vue";
import { getEntityColor } from "@/utils/jcl/common";
// import { displayDuration, displayDigits, displayPercent } from "@/utils/jcl/commonNoStore";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store";
import getWorkerResponse from "@/utils/jcl/worker";

const { end: _end } = useStore().result;
const { entity, entityTab, entityTimeRange } = toRefs(usePve());

const entityColor = computed(() => getEntityColor(entity.value));

// 缩放/时间范围逻辑
const endMicro = computed(() => _end?.micro || 0);
const handleDatazoom = debounce(
    (e) => {
        const { start, end } = e;
        entityTimeRange.value[entity.value] = [(start * endMicro.value) / 100, (end * endMicro.value) / 100];
    },
    500,
    { leading: true }
);

// 图表数据处理、更新
const loading = ref(false);
const xData = ref([]);
const yData = ref([]);
const option = computed(() => {
    return {
        grid: {
            x: 60,
            y: 20,
            right: 0,
            // x2: 40,
            // y2: 40,
        },
        backgroundColor: "transparent",
        tooltip: {
            trigger: "axis",
            formatter: `每秒数值: {c}`,
            position: function (pt) {
                return [pt[0], 0.1];
            },
        },
        xAxis: {
            type: "category",
            boundaryGap: [0.1, 0.1],
            data: xData.value,
            triggerEvent: true,
        },
        yAxis: {
            type: "value",
            boundaryGap: [0, 0.2],
        },
        series: [
            {
                type: "line",
                showSymbol: false,
                itemStyle: {
                    color: entityColor.value,
                },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: `${entityColor.value}66`,
                        },
                        {
                            offset: 1,
                            color: `${entityColor.value}ff`,
                        },
                    ]),
                },
                data: yData.value,
            },
        ],
        dataZoom: [
            {
                type: "slider",
                filterMode: "filter",
                bottom: 10,
            },
        ],
    };
});

const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_entity_stat_chart", {
        entity: entity.value,
        entityTab: entityTab.value,
    }).then((data) => {
        xData.value = data.xData;
        yData.value = data.yData;
        loading.value = false;
    });
};
watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-entity-chart {
    flex-grow: 1;
    gap: 20px;
    display: flex;
    flex-direction: column;

    .u-chart {
        flex-grow: 1;
    }
    .u-overview {
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #8b96a2;
        .fz(14px, 18px);
    }

    .u-empty-tip {
        flex-grow: 1;
        .flex-center;
        .bold;
        color: #b3b3b3;
    }
}
</style>
