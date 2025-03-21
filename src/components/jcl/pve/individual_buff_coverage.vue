<template>
    <div class="w-card m-individual-buff-coverage">
        <p class="w-card-title">个人增益详情</p>
        <div>
            <el-select
                v-model="selectedBuff"
                placeholder="选择一个增益"
                filterable
                style="width: 400px; margin-bottom: 5px"
                value-key="key"
            >
                <el-option
                    v-for="buff in filteredBuffs"
                    :key="buff.id"
                    :label="`${buff.id} : ${buff.level} - ${buff.name}`"
                    :value="buff"
                >
                    <img
                        :src="getResourceIcon(buff.key)"
                        alt=""
                        style="width: 24px; vertical-align: middle; margin-right: 8px"
                    />
                    {{ `${buff.id} - ${buff.level} - ${buff.name}` }}
                </el-option>
            </el-select>
            <el-button @click="submitBuff" style="margin-left: 10px; margin-bottom: 5px">提交</el-button>
        </div>

        <el-table
            v-loading="loading"
            class="u-table w-table"
            :data="currentData"
            :border="false"
            @sort-change="sort"
            @row-click="click"
            :row-class-name="rowClass"
        >
            <el-table-column label="" width="48" :align="'center'">
                <template #default="{ row }">
                    <img class="u-buff-icon" :src="getResourceIcon(row.query_key)" alt="" />
                </template>
            </el-table-column>
            <el-table-column label="增益名称" width="120">
                <template #default="{ row }">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="average_stack" label="平均层数" width="90" sortable="true"></el-table-column>
            <el-table-column prop="average_times_per_player" label="平均作用次数" sortable="true"></el-table-column>
            <el-table-column prop="min_stack" label="单次最小层数" width="130" sortable="true"></el-table-column>
            <el-table-column prop="max_stack" label="单次最大层数" width="130" sortable="custom"></el-table-column>
            <el-table-column prop="average_coverage" label="覆盖率" sortable="custom"></el-table-column>
            <el-table-column label="覆盖率(百分比)">
                <template #default="{ row }">
                    <div class="u-rate-wrapper">
                        <div class="u-rate-value">{{ displayPercent(row.average_coverage * 100) }}</div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="w-pagination"
            small
            background
            layout="pager"
            :page-size="10"
            :total="total"
            :hide-on-single-page="true"
            :current-page="currentPage"
            @update:currentPage="currentPage = $event"
        />
    </div>
</template>

<script setup>
import { displayPercent } from "@/utils/jcl/commonNoStore";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { getResourceIcon } from "@/utils/jcl/common";
import { ref, watchPostEffect, toRefs, computed } from "vue";
import { buffs_coverage_constants } from "@/assets/data/jcl/buff_coverage_constant";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store";
import getWorkerResponse from "@/utils/jcl/worker";

// 数据
const loading = ref(false);
const final_data = ref([]);
const selectedBuff = ref(null); // 定义 selectedBuff
const query_buff_list = buffs_coverage_constants.individual_buffs;
const store = useStore();
// 定义字典
let resource = store.result.resources;
if (resource == undefined) {
    resource = {};
}

const { currentPage, currentData, total } = usePaginate(final_data, ref(10));

// 注入的属性
const { individual_selected_buff, individual_selected_buff_log } = toRefs(usePve());

// 行点击事件
const click = (row) => {
    if (individual_selected_buff.value === row.query_key) {
        return;
    }

    individual_selected_buff.value = row.query_key;
    individual_selected_buff_log.value = row;
};
// 行样式
const rowClass = ({ row }) => {
    return individual_selected_buff.value === row.query_key ? "is-focus" : "";
};
// 过滤符合条件的增益
const filteredBuffs = computed(() => {
    return Object.keys(resource)
        .filter((key) => key.startsWith("buff") && resource[key].name !== null)
        .map((key) => ({ ...resource[key], key: key }));
});

// methods
const sort = ({ prop, order }) => {
    final_data.value = final_data.value.sort((a, b) => {
        if (order === "ascending") {
            return a[prop] - b[prop];
        } else {
            return b[prop] - a[prop];
        }
    });
};

const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_individual_buff_coverage", { query_buff_list }).then((result) => {
        loading.value = false;
        final_data.value = result;
        sort({ prop: "average_coverage", order: "descending" });
        currentPage.value = 1;
    });
};
// watch
watchPostEffect(updateData);
// 监控 selectedBuff 的变化
const submitBuff = () => {
    if (selectedBuff.value) {
        query_buff_list[selectedBuff.value.id] = selectedBuff.value.level;
        updateData();
    }
};
</script>

<style lang="less">
.m-individual-buff-coverage {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 520px;
    flex: 1;

    .u-table {
        flex-grow: 1;
        .mb(4px);
        width: 100%;
        .u-buff-icon {
            .size(24px);
            .mr(4px);
            margin-top: 5px;
        }
        .el-table__row {
            cursor: pointer;
        }
    }
}
</style>
