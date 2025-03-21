<template>
    <div class="m-sill-list w-card">
        <div class="w-card-title">{{ compareEffect ? getResourceName(compareEffect, { showID: false }) : "-" }}</div>
        <ul class="m-player-list">
            <li>{{ getEntityName(compareEntity[0]) }}</li>
            <li>{{ getEntityName(compareEntity[1]) }}</li>
            <li>{{ getEntityName(compareEntity[2]) }}</li>
            <li>{{ getEntityName(compareEntity[3]) }}</li>
        </ul>
        <div class="m-table-list">
            <ul>
                <li>
                    <p class="u-title">会心</p>
                    <el-table :data="criticalList" class="w-table" :show-header="false">
                        <el-table-column prop="title" label="" width="180"></el-table-column>
                        <el-table-column prop="value1" align="center" label=""></el-table-column>
                        <el-table-column prop="value2" align="center" label=""></el-table-column>
                        <el-table-column prop="value3" align="center" label=""></el-table-column>
                        <el-table-column prop="value4" align="center" label=""></el-table-column>
                    </el-table>
                </li>
            </ul>
            <ul>
                <li>
                    <p class="u-title">命中</p>
                    <el-table :data="hitList" class="w-table" :show-header="false">
                        <el-table-column prop="title" label="" width="180"></el-table-column>
                        <el-table-column prop="value1" align="center" label=""></el-table-column>
                        <el-table-column prop="value2" align="center" label=""></el-table-column>
                        <el-table-column prop="value3" align="center" label=""></el-table-column>
                        <el-table-column prop="value4" align="center" label=""> </el-table-column>
                    </el-table>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { usePve } from "@/pages/jcl/store_pve";
import { getEntityName, getResourceName } from "@/utils/jcl/common";
import { toRefs } from "vue";
const { compareEntity, compareEffect, compareEffectList } = toRefs(usePve());
import { displayPercent } from "@/utils/jcl/commonNoStore";

// 会心列表 会心的技能
const criticalList = computed(() => {
    const data = compareEffectList.value;
    // 会心列表
    const arr1 = data[0] ? data[0].logs.filter((item) => item.isCritical) : [];
    const arr2 = data[1] ? data[1].logs.filter((item) => item.isCritical) : [];
    const arr3 = data[2] ? data[2].logs.filter((item) => item.isCritical) : [];
    const arr4 = data[3] ? data[3].logs.filter((item) => item.isCritical) : [];
    // 最低伤害
    const min1 = arr1.length ? Math.min(...arr1.map((item) => item.value)) : "-";
    const min2 = arr2.length ? Math.min(...arr2.map((item) => item.value)) : "-";
    const min3 = arr3.length ? Math.min(...arr3.map((item) => item.value)) : "-";
    const min4 = arr4.length ? Math.min(...arr4.map((item) => item.value)) : "-";
    // 平均伤害
    const avg1 = arr1.length ? (arr1.reduce((prev, curr) => prev + curr.value, 0) / arr1.length).toFixed(0) : "-";
    const avg2 = arr2.length ? (arr2.reduce((prev, curr) => prev + curr.value, 0) / arr2.length).toFixed(0) : "-";
    const avg3 = arr3.length ? (arr3.reduce((prev, curr) => prev + curr.value, 0) / arr3.length).toFixed(0) : "-";
    const avg4 = arr4.length ? (arr4.reduce((prev, curr) => prev + curr.value, 0) / arr4.length).toFixed(0) : "-";

    // 最高伤害
    const max1 = arr1.length ? Math.max(...arr1.map((item) => item.value)) : "-";
    const max2 = arr2.length ? Math.max(...arr2.map((item) => item.value)) : "-";
    const max3 = arr3.length ? Math.max(...arr3.map((item) => item.value)) : "-";
    const max4 = arr4.length ? Math.max(...arr4.map((item) => item.value)) : "-";

    // 占比
    const rate1 = data[0] ? (arr1.length / data[0].logs.length) * 100 : 0;
    const rate2 = data[1] ? (arr2.length / data[1].logs.length) * 100 : 0;
    const rate3 = data[2] ? (arr3.length / data[2].logs.length) * 100 : 0;
    const rate4 = data[3] ? (arr4.length / data[3].logs.length) * 100 : 0;

    return [
        {
            title: "次数",
            value1: arr1.length ? arr1.length : "-",
            value2: arr2.length ? arr2.length : "-",
            value3: arr3.length ? arr3.length : "-",
            value4: arr4.length ? arr4.length : "-",
        },
        {
            title: "最低伤害",
            value1: min1,
            value2: min2,
            value3: min3,
            value4: min4,
        },
        {
            title: "平均伤害",
            value1: avg1,
            value2: avg2,
            value3: avg3,
            value4: avg4,
        },
        {
            title: "最高伤害",
            value1: max1,
            value2: max2,
            value3: max3,
            value4: max4,
        },
        {
            title: "占比",
            value1: displayPercent(rate1),
            value2: displayPercent(rate2),
            value3: displayPercent(rate3),
            value4: displayPercent(rate4),
        },
    ];
});

// 命中列表 没会心的技能
const hitList = computed(() => {
    const data = compareEffectList.value;
    // 命中列表
    const arr1 = data[0] ? data[0].logs.filter((item) => !item.isCritical) : [];
    const arr2 = data[1] ? data[1].logs.filter((item) => !item.isCritical) : [];
    const arr3 = data[2] ? data[2].logs.filter((item) => !item.isCritical) : [];
    const arr4 = data[3] ? data[3].logs.filter((item) => !item.isCritical) : [];
    // 最低伤害 防止arr 为空的情况
    const min1 = arr1.length ? Math.min(...arr1.map((item) => item.value)) : "-";
    const min2 = arr2.length ? Math.min(...arr2.map((item) => item.value)) : "-";
    const min3 = arr3.length ? Math.min(...arr3.map((item) => item.value)) : "-";
    const min4 = arr4.length ? Math.min(...arr4.map((item) => item.value)) : "-";

    // 平均伤害
    const avg1 = arr1.length ? (arr1.reduce((prev, curr) => prev + curr.value, 0) / arr1.length).toFixed(0) : "-";
    const avg2 = arr2.length ? (arr2.reduce((prev, curr) => prev + curr.value, 0) / arr2.length).toFixed(0) : "-";
    const avg3 = arr3.length ? (arr3.reduce((prev, curr) => prev + curr.value, 0) / arr3.length).toFixed(0) : "-";
    const avg4 = arr4.length ? (arr4.reduce((prev, curr) => prev + curr.value, 0) / arr4.length).toFixed(0) : "-";

    // 最高伤害
    const max1 = arr1.length ? Math.max(...arr1.map((item) => item.value)) : "-";
    const max2 = arr2.length ? Math.max(...arr2.map((item) => item.value)) : "-";
    const max3 = arr3.length ? Math.max(...arr3.map((item) => item.value)) : "-";
    const max4 = arr4.length ? Math.max(...arr4.map((item) => item.value)) : "-";

    // 占比
    const rate1 = data[0] ? (arr1.length / data[0].logs.length) * 100 : 0;
    const rate2 = data[1] ? (arr2.length / data[1].logs.length) * 100 : 0;
    const rate3 = data[2] ? (arr3.length / data[2].logs.length) * 100 : 0;
    const rate4 = data[3] ? (arr4.length / data[3].logs.length) * 100 : 0;
    return [
        {
            title: "次数",
            value1: arr1.length ? arr1.length : "-",
            value2: arr2.length ? arr2.length : "-",
            value3: arr3.length ? arr3.length : "-",
            value4: arr4.length ? arr4.length : "-",
        },
        {
            title: "最低伤害",
            value1: min1,
            value2: min2,
            value3: min3,
            value4: min4,
        },
        {
            title: "平均伤害",
            value1: avg1,
            value2: avg2,
            value3: avg3,
            value4: avg4,
        },
        {
            title: "最高伤害",
            value1: max1,
            value2: max2,
            value3: max3,
            value4: max4,
        },
        {
            title: "占比",
            value1: displayPercent(rate1),
            value2: displayPercent(rate2),
            value3: displayPercent(rate3),
            value4: displayPercent(rate4),
        },
    ];
});
</script>

<style lang="less" scoped>
.m-player-list {
    .flex;
    gap: 30px;
    margin-left: 180px;
    li {
        .fz(14px, 30px);
        flex: 1;
        border-radius: 4px;
        text-align: center;
        &:nth-of-type(1) {
            background: rgba(255, 97, 97, 0.5);
        }
        &:nth-of-type(2) {
            background: rgba(40, 207, 90, 0.5);
        }
        &:nth-of-type(3) {
            background: rgba(65, 105, 225, 0.5);
        }
        &:nth-of-type(4) {
            background: rgba(232, 204, 58, 0.5);
        }
    }
}
.m-table-list {
    .flex;
    flex-direction: column;
    gap: 30px;
    .u-title {
        .fz(14px,18px);
        .bold;
        .mb(10px);
    }
}
</style>
