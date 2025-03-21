<template>
    <div class="w-card m-overview-list">
        <p class="u-title">单位详情</p>
        <el-table
            v-loading="loading"
            class="u-table w-table"
            :data="currentData"
            :border="false"
            :fit="false"
            @sort-change="sort"
            @row-click="click"
            :row-class-name="rowClass"
        >
            <el-table-column label="单位" width="140">
                <template #default="{ row }">
                    <div class="u-center" :title="getEntityName(row.id, { showRegion: true })">
                        <img class="u-mount-icon" :src="getMountIcon(row.id)" alt="" />
                        <span class="u-entity-name">{{ getEntityName(row.id) }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="value" label="总数值" width="100" sortable="custom">
                <template #default="{ row }">
                    <span>{{ row.value.toLocaleString() }}</span>
                </template>
            </el-table-column>
            <el-table-column label="秒伤" width="110">
                <template #default="{ row }">
                    <span>{{ row.vps.toFixed(0) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="占比" width="78">
                <template #default="{ row }">
                    {{ displayPercent(row.rate) }}
                    <!-- <div class="u-rate-wrapper">
                            <div class="u-rate-value">{{ displayPercent(row.rate) }}</div>
                        </div> -->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="w-pagination"
            small
            background
            layout="pager"
            :page-size="pageSize"
            :total="total"
            :hide-on-single-page="true"
            :current-page="currentPage"
            @update:currentPage="currentPage = $event"
        />
    </div>
</template>

<script setup>
import { usePve } from "@/pages/jcl/store_pve";
import { getMountIcon, getEntityName } from "@/utils/jcl/common";
import { displayPercent } from "@/utils/jcl/commonNoStore";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { ref, watchPostEffect, toRefs, toRaw } from "vue";
import getWorkerResponse from "@/utils/jcl/worker";

const global = usePve();

// 数据
const loading = ref(false);
const data = ref([]);
const pageSize = 13;
const { focusEntitie, focusEntitieName, statType, timeRange } = toRefs(global);
const { currentPage, currentData, total } = usePaginate(data, ref(pageSize));
// methods
const sort = ({ prop, order }) => {
    data.value = data.value.sort((a, b) => {
        if (order === "ascending") {
            return a[prop] - b[prop];
        } else {
            return b[prop] - a[prop];
        }
    });
};
const click = (row) => {
    focusEntitie.value = row;
    focusEntitieName.value = row.name;
};
const rowClass = ({ row }) => {
    if (focusEntitieName.value == row.name) {
        focusEntitie.value = row;
        return "is-focus";
    }
    return "";
};
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_overview_list", {
        statType: statType.value,
        timeRange: toRaw(timeRange.value),
    }).then((result) => {
        loading.value = false;
        data.value = result;
        sort({ prop: "value", order: "descending" });
        currentPage.value = 1;
    });
};

watchPostEffect(() => {
    if (focusEntitieName.value) {
        const row = data.value.find((item) => item.name === focusEntitieName.value);
        if (row) {
            focusEntitie.value = row;
        } else {
            focusEntitie.value = null;
        }
    } else {
        focusEntitie.value = null;
    }
});

watchPostEffect(updateData);
</script>

<style lang="less" scoped>
@import "@/assets/css/jcl/pve/overview_list.less";
.m-overview-list {
    width: 468px;
    .u-table {
        flex-grow: 1;
        :deep(.el-table__row) {
            cursor: pointer;
        }
    }
}
</style>
