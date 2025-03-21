<template>
    <div class="m-overview-chart">
        <div class="w-card m-top-items">
            <div class="u-top-item">
                <p class="u-label">重伤</p>
                <p class="u-value">{{ data.deathTotal }}</p>
            </div>
            <div class="u-top-item">
                <p class="u-label">特殊BUFF</p>
                <p class="u-value">{{ data.buffTotal }}</p>
            </div>
            <div class="u-top-item" v-for="buff in data.buffs" :key="buff.name">
                <p class="u-label">{{ buff.name }}</p>
                <p class="u-value">{{ buff.count }}</p>
            </div>
        </div>

        <div class="m-chart-box">
            <div class="u-filter-items">
                <div
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :class="{ 'is-active': statType == tab.name }"
                    @click="switchType(tab.name)"
                    class="u-filter-item"
                >
                    {{ tab.title }}
                </div>
            </div>
            <v-chart
                class="u-chart"
                ref="echart"
                theme="dark"
                :option="option"
                autoresize
                @legendselectchanged="handleSelect"
                @datazoom="handleDatazoom"
            />
        </div>
    </div>
</template>

<script setup>
import VChart from "vue-echarts";
import { computed, ref, toRefs, watchPostEffect } from "vue";
import { useStore } from "@/pages/jcl/store";
import { usePve } from "@/pages/jcl/store_pve";
import getWorkerResponse from "@/utils/jcl/worker";
import { debounce } from "lodash-es";
import { getResourceName } from "@/utils/jcl/common";

const store = useStore();
const {
    result: { end: _end },
} = useStore();
const { statType, timeRange, focusEntitieName } = toRefs(usePve());

// tab切换相关逻辑
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

const switchType = (tab) => {
    if (tab === statType.value) return;
    statType.value = tab;
};

const data = computed(() => {
    const { player_death, buff_blame } = store.result;
    const buffObj = {};

    for (const player_id in buff_blame) {
        for (const buff_id in buff_blame[player_id]) {
            if (buffObj[buff_id]) {
                buffObj[buff_id].count += 1;
            } else {
                let name = getResourceName(`buff:${buff_id}`);
                const sp = name.split("_");
                if (sp.length > 1) {
                    name = sp[1];
                }
                buffObj[buff_id] = {
                    name: name,
                    count: 1,
                };
            }
        }
    }
    // 取前三个 并且转为数组
    const buffs = Object.values(buffObj)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    return {
        deathTotal: player_death ? Object.values(player_death).length : 0,
        buffTotal: buff_blame ? Object.values(buff_blame).length : 0,
        buffs,
    };
}, [store.result]);

// 被选中的人的名字
const loading = ref(false);
const xData = ref([]);
const yData = ref([]);
// legend的名字
const legendNames = computed(() => {
    return yData.value?.map((x) => x.name) || [];
}, [yData]);
// 图的option
const option = computed(() => {
    return {
        tooltip: {
            trigger: "axis",
            order: "valueDesc",
        },
        legend: {
            show: true,
            icon: "roundRect",
            type: "scroll",
            orient: "horizontal",
            top: 10,
            data: legendNames.value,
            selected: legendNames.value.reduce((obj, name) => {
                if (focusEntitieName.value == null) {
                    if (name === "【全局】") obj[name] = true;
                    else obj[name] = false;
                } else {
                    if (focusEntitieName.value == name) obj[name] = true;
                    else obj[name] = false;
                }
                return obj;
            }, {}),
        },
        backgroundColor: "#282828",
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
        dataZoom: [
            {
                type: "slider",
                filterMode: "filter",
                bottom: 15,
                start: 0,
                end: 10,
            },
        ],
        series: yData.value,
        grid: {
            top: 55,
            left: 75,
            right: 0,
        },
    };
}, [xData, yData, focusEntitieName]);

const handleSelect = ({ name, selected }) => {
    for (const key in selected) {
        if (key !== name) {
            selected[key] = false;
        }
    }

    if (name == "【全局】") {
        focusEntitieName.value = null;
    } else {
        focusEntitieName.value = name;
    }
};

// 缩放/时间范围逻辑
const endMicro = computed(() => _end?.micro || 0);

const handleDatazoom = debounce(
    (e) => {
        const { start, end } = e;
        timeRange.value = [(start * endMicro.value) / 100, (end * endMicro.value) / 100];
    },
    500,
    { leading: true }
);

// 数据更新逻辑
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_overview_chart", { statType: statType.value }).then((data) => {
        xData.value = data.xData;
        yData.value = data.yData;
        loading.value = false;
        timeRange.value = [0, endMicro.value];
    });
};
watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-top-items {
    .flex;
    gap: 10px;

    color: #939393;
    margin-bottom: 30px;
    .u-top-item {
        flex: 1;
        background: #1c1c1c;
        border-radius: 16px;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
        .u-label {
            white-space: nowrap;
        }
        .u-value {
            .fz(32px, 42px);
            font-weight: bold;
            color: #fff;
        }
    }
}

.m-chart-box {
    height: 390px;
    padding: 20px;
    border-radius: 16px;
    background: #282828;
    display: flex;
    flex-direction: column;
    .u-filter-items {
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
