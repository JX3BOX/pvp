<template>
    <div class="m-logs-list w-card" v-loading="loading">
        <div class="w-card-title">列表</div>
        <el-table class="u-table w-table" :data="currentData" :border="false">
            <el-table-column prop="index" label="#" width="60"> </el-table-column>
            <el-table-column label="时间" width="60">
                <template #default="{ row }">
                    <span>{{ displayDigits(row.micro / 1000) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="typeDesc" label="事件类型" width="120"></el-table-column>
            <el-table-column prop="subtype" label="子类型" width="80"> </el-table-column>
            <el-table-column label="事件来源">
                <template #default="{ row }">
                    <jcl-entity v-if="row.source.t === 'entity'" :entity="row.source.v"></jcl-entity>
                </template>
            </el-table-column>
            <el-table-column label="事件内容">
                <template #default="{ row }">
                    <jcl-effect
                        v-if="['skill', 'buff'].includes(row.content.t)"
                        :type="row.content.t"
                        :effect="row.content.v"
                    ></jcl-effect>
                    <div v-else-if="row.content.t === 'str'" :title="row.content.v">
                        {{ row.content.v }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="事件目标">
                <template #default="{ row }">
                    <jcl-entity v-if="row.target.t === 'entity'" :entity="row.target.v"></jcl-entity>
                </template>
            </el-table-column>
            <el-table-column label="数值">
                <template #default="{ row }">
                    <el-tooltip v-if="showEventValue(row)" placement="top">
                        <template #content>
                            <div>
                                <span v-for="(value, type) in row.value" :key="type">
                                    {{ type }}: {{ value }}<br />
                                </span>
                            </div>
                        </template>
                        <span>{{ Object.values(row.value)[0] }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template #default="{ row }">
                    {{ row.remark }}
                </template>
            </el-table-column>
            <el-table-column width="24">
                <template #default="{ row }">
                    <el-button
                        v-show="logDebug"
                        @click="consoleLog(row)"
                        size="small"
                        link
                        :icon="InfoFilled"
                    ></el-button>
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
import JclEntity from "@/components/jcl/common/jcl_entity.vue";
import JclEffect from "@/components/jcl/common/jcl_effect.vue";

import { InfoFilled } from "@element-plus/icons-vue";

import { displayDigits } from "@/utils/jcl/commonNoStore";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { ref, toRefs, watchPostEffect, onMounted } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import { cloneDeep, throttle } from "lodash";
import getWorkerResponse from "@/utils/jcl/worker";

// 数据相关
const { logs, logFilter, logAutoApply, logDebug } = toRefs(usePve());
const loading = ref(false);
const pageSize = ref(30);
const { currentPage, total, currentData } = usePaginate(logs, pageSize);
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_logs", { logFilter: cloneDeep(logFilter.value) })
        .then((res) => {
            logs.value = res;
        })
        .finally(() => {
            loading.value = false;
        });
};
const throttleUpdateData = throttle(updateData, 1000);

defineExpose({ updateData });

// 组件方法
const consoleLog = (row) => console.log(cloneDeep(row));
const showEventValue = (row) => {
    if (row.type != 21) return false;
    if (Object.values(row.value).every((x) => !x)) return false;
    return true;
};

// 监听logFilter变化自动更新
watchPostEffect(() => {
    if (logAutoApply.value) {
        throttleUpdateData();
    }
});
onMounted(() => {
    if (logs.value.length === 0) {
        updateData();
    }
});
</script>

<style lang="less">
.m-logs-list {
    // height: 1060px;
    flex-grow: 1;

    .u-table {
        flex-grow: 1;

        .el-table__row {
            transition: all 0.2s ease-in-out;
        }
        .el-table__row:hover {
            background-color: #7650f8aa;
        }
    }
}
</style>
