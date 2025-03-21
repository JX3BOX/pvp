<template>
    <div class="m-entity-buff-table">
        <!-- :row-class-name="rowClass" -->
        <el-table class="u-table w-table" :data="currentData" :border="false" @sort-change="sort" @row-click="click">
            <el-table-column prop="index" label="#" align="center" :width="36"></el-table-column>
            <el-table-column label="BUFF">
                <template #default="{ row }">
                    <div class="u-center">
                        <img class="u-buff-icon" :src="iconLink(row.icon)" alt="" />
                        <span class="u-buff-name">{{ getResourceName("buff:" + row.id, { showID: false }) }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="覆盖率" sortable="custom" prop="coverage">
                <template #default="{ row }">
                    <span>{{ displayPercent(row.coverage) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="获得次数" sortable="custom" prop="getCount">
                <template #default="{ row }">
                    <span>{{ row.getCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="卸除次数" sortable="custom" prop="deleteCount">
                <template #default="{ row }">
                    <span>{{ row.deleteCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="最大层数" sortable="custom" prop="maxStack">
                <template #default="{ row }">
                    <span>{{ row.maxStack }}</span>
                </template>
            </el-table-column>
            <el-table-column label="最短持续" sortable="custom" prop="minDuration">
                <template #default="{ row }">
                    <span>{{ displayDigits(row.minDuration) }} s</span>
                </template>
            </el-table-column>
            <el-table-column label="最长持续" sortable="custom" prop="maxDuration">
                <template #default="{ row }">
                    <span>{{ displayDigits(row.maxDuration) }} s</span>
                </template>
            </el-table-column>
            <el-table-column label="平均持续" sortable="custom" prop="aveDuration">
                <template #default="{ row }">
                    <span>{{ displayDigits(row.aveDuration) }} s</span>
                </template>
            </el-table-column>
            <el-table-column label="" width="35">
                <template #default="{ row }">
                    <div class="u-check-icon">
                        <el-checkbox :checked="selectedBuffs.includes(row.id)" :key="selectedBuffs.length" />
                    </div>
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
        ></el-pagination>
    </div>
</template>

<script setup>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getResourceName } from "@/utils/jcl/common";
import { displayPercent, displayDigits } from "@/utils/jcl/commonNoStore";
import { ref, toRefs, watchPostEffect } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { sortBy } from "lodash-es";
import getWorkerResponse from "@/utils/jcl/worker";

const { entity, selectedBuffs } = toRefs(usePve());

// 表格样式/交互
// const rowClass = ({ row }) => {
//     if (selectedBuffs.value.includes(row.id)) {
//         return "is-focus";
//     }
//     return "";
// };
const click = (row) => {
    if (selectedBuffs.value.includes(row.id)) {
        selectedBuffs.value = selectedBuffs.value.filter((id) => id !== row.id);
    } else {
        selectedBuffs.value.push(row.id);
        const sortList = data.value.map((x) => x.id).reverse();
        selectedBuffs.value = sortBy(selectedBuffs.value, (element) => sortList.indexOf(element));
    }
};
const sort = ({ prop, order }) => {
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

// 数据处理相关
const loading = ref(false);
const data = ref([]);
const pageSize = ref(18);
const { currentPage, currentData, total } = usePaginate(data, pageSize);
const updateData = () => {
    loading.value = true;
    selectedBuffs.value = [];
    getWorkerResponse("get_pve_entity_buff", { entity: entity.value }).then((result) => {
        data.value = result;
        sort({ prop: "icon", order: "descending" });
        if (selectedBuffs.value.length === 0) {
            selectedBuffs.value = data.value.slice(0, 8).map((x) => x.id);
        }
        loading.value = false;
    });
};

watchPostEffect(updateData);
</script>

<style lang="less">
.m-entity-buff-table {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    .u-table {
        flex-grow: 1;
        .u-center {
            display: flex;
            align-items: center;
        }
        .u-buff-icon {
            .size(18px, 18px);
            margin-right: 10px;
        }
        .u-buff-name {
            flex: 1;
            .ellipsis;
        }
    }
}
</style>
