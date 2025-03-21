<template>
    <div class="m-compare-item w-card">
        <div class="u-title">{{ getEntityName(entity) }}</div>
        <el-table
            class="w-table"
            height="370"
            :data="data"
            @sort-change="sortSkill"
            @row-click="selectSkill"
            :row-class-name="rowClass"
        >
            <el-table-column prop="name" label="">
                <template #default="{ row }">
                    <span :title="getResourceName(row.effect, { showID: true })">{{
                        getResourceName(row.effect, { showID: false })
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="count" label="次数" sortable="custom"></el-table-column>
            <el-table-column prop="value" label="伤害/治疗" sortable="custom">
                <template #default="{ row }">
                    <span>{{ row.value }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="avg" label="比重" sortable="custom">
                <template #default="{ row }">
                    <span> {{ displayPercent(row.valueRate) }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
// import EmptyGuide from "@/components/jcl/common/empty_guide.vue";
import { usePve } from "@/pages/jcl/store_pve";
import { getResourceName, getEntityName } from "@/utils/jcl/common";
import { displayPercent } from "@/utils/jcl/commonNoStore";
import { toRefs, ref, computed, watchPostEffect } from "vue";
import getWorkerResponse from "@/utils/jcl/worker";
const { compareEntity, compareMode, compareEffect, compareEffectList } = toRefs(usePve());
// props
const props = defineProps({
    index: {
        type: Number,
        default: 1,
    },
});
const { index } = toRefs(props);
const entity = computed(() => {
    return compareEntity.value[index.value - 1];
});
// data
const loading = ref(false);
const logs = ref([]);

// 技能列表
const overview = ref([]);
const data = ref([]);

const updateData = () => {
    loading.value = true;
    compareEffect.value = null;
    logs.value = [];
    getWorkerResponse("get_pve_compare", {
        compareMode: compareMode.value,
        entity: entity.value,
        timeRange: [0, 1000000000],
    })
        .then((res) => {
            data.value = res.data;
            overview.value = res.overview;
            loading.value = false;
        })
        .catch((err) => {
            console.log(err);
        });
};

const updateCompareEffectList = () => {
    compareEffectList.value[index.value - 1] = data.value.find((item) => item.effect === compareEffect.value) || null;
};

// 各种表格交互/样式
const rowClass = ({ row }) => {
    return row.effect === compareEffect.value ? "is-focus" : "";
};
const selectSkill = (row) => {
    if (compareEffect.value === row.effect) {
        compareEffect.value = null;
        logs.value = [];
    } else {
        compareEffect.value = row.effect;
        logs.value = row.logs;
        logs.value.forEach((item, index) => {
            item.index = index + 1;
        });
    }
};
const sortSkill = ({ prop, order }) => {
    data.value = data.value.sort((a, b) => {
        if (order === "ascending") {
            return a[prop] - b[prop];
        } else {
            return b[prop] - a[prop];
        }
    });
    let index = 1;
    for (let item of data.value) {
        item.index = index++;
    }
};
//watch
watchPostEffect(updateData);
watchPostEffect(updateCompareEffectList);
</script>

<style lang="less" scoped>
.m-compare-item {
    flex: 1;
    overflow-y: auto;
    .u-title {
        .fz(14px,21px);
        .mb(8px);
        text-align: center;
    }
}
</style>
