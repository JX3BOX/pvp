<template>
    <div class="m-entity-view-target">
        <div class="u-left">
            <div class="w-card" v-loading="loading">
                <!-- 为空指引 -->
                <template v-if="currentData.length === 0">
                    <empty-guide
                        text-align="left"
                        to="row"
                        position="flex-start"
                        :grow="false"
                        :tips="['在上方选择一个单位后', '此处会展示该单位施展招式的所有目标列表']"
                    ></empty-guide>
                </template>
                <!-- 表格部分 -->
                <template v-else>
                    <div class="w-card-title">
                        <span>{{ targetLabel }}列表</span>
                    </div>
                    <el-table
                        class="u-table"
                        :data="currentData"
                        :border="false"
                        @sort-change="sort"
                        @row-click="click"
                        :row-class-name="rowClass"
                    >
                        <el-table-column label="心法" width="48" :align="'center'">
                            <template #default="{ row }">
                                <div class="u-mount-icon">
                                    <img :src="getMountIcon(row.target)" alt="" />
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="targetLabel" width="112">
                            <template #default="{ row }">
                                <span>{{ getEntityName(row.target) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="数值" width="148" sortable="custom">
                            <template #default="{ row }">
                                <span>{{ row.value }}</span>
                                <span> ({{ displayPercent(row.valueRate) }})</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="count" label="次数" width="70" sortable="custom"></el-table-column>
                        <el-table-column prop="critRate" label="会心" width="104" sortable="custom">
                            <template #default="{ row }">
                                <span>{{ row.criticalCount }}</span>
                                <span> ({{ displayPercent(row.criticalRate) }})</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="min" label="最小值" width="90" sortable="custom"></el-table-column>
                        <el-table-column prop="max" label="最大值" width="98" sortable="custom"></el-table-column>
                        <el-table-column prop="avg" label="平均值" width="98" sortable="custom">
                            <template #default="{ row }">
                                <span>{{ displayDigits(row.avg) }}</span>
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
                </template>
            </div>
            <!-- 技能详情 -->
            <entity-skill-log-detail></entity-skill-log-detail>
        </div>
        <div class="u-right">
            <!-- 技能日志 -->
            <entity-skill-log></entity-skill-log>
        </div>
    </div>
</template>

<script setup>
import EmptyGuide from "@/components/jcl/common/empty_guide.vue";
import { ref, watch, computed, toRefs, toRaw } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { getMountIcon, getEntityName } from "@/utils/jcl/common";
import { displayDigits, displayPercent } from "@/utils/jcl/commonNoStore";
import getWorkerResponse from "@/utils/jcl/worker";

import EntitySkillLog from "./entity_view_log.vue";
import EntitySkillLogDetail from "./entity_view_log_detail.vue";

const { entityTab, entity, entityTimeRange, target, targetLogs, targetLog } = toRefs(usePve());

// computed
const targetLabel = computed(() => {
    return ["damage", "treat"].includes(entityTab.value) ? "目标" : "来源";
});

// 行点击事件
const click = (row) => {
    if (target.value === row.target) return;
    target.value = row.target;
    targetLogs.value = row.logs;

    targetLog.value = row.logs[0];
    // .log(targetLog.value);
};
// 行样式
const rowClass = ({ row }) => {
    return target.value === row.target ? "is-focus" : "";
};

// 数据相关
const loading = ref(false);
const skipNoNameTarget = ref(false);
const data = ref([]);
const pageSize = ref(9);
const { currentPage, currentData, total } = usePaginate(data, pageSize);
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_entity_view_target", {
        entityTab: entityTab.value,
        entity: entity.value,
        timeRange: toRaw(entityTimeRange.value[entity.value]),
        skipNoNameTarget: skipNoNameTarget.value,
    }).then((result) => {
        data.value = result;
        loading.value = false;
        sort({ prop: "value", order: "descending" });
    });
};
const sort = ({ prop, order }) => {
    data.value = data.value.sort((a, b) => {
        if (order === "ascending") {
            return a[prop] - b[prop];
        } else {
            return b[prop] - a[prop];
        }
    });
};
watch(
    [entity, () => entityTimeRange.value[entity.value], entityTab],
    ([newEntity], [oldEntity]) => {
        if (oldEntity && newEntity != oldEntity) clearLogs();
        updateData();
    },
    { immediate: true, flush: "post" }
);

const clearLogs = () => {
    target.value = "";
    targetLogs.value = [];
    targetLog.value = null;
};
watch(() => data.value, clearLogs, { flush: "post" });
</script>

<style lang="less">
.m-entity-view-target {
    display: flex;
    gap: 20px;
    .size(1440px, 800px);

    & > .u-left {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .size(810px, 760px);

        .w-card-title {
            display: flex;
            gap: 40px;
        }

        & > div:first-of-type {
            height: 410px;
            flex-shrink: 0;
        }

        & > div:last-of-type {
            height: 290px;
        }

        .u-table {
            flex-grow: 1;

            .u-mount-icon {
                .flex-center;
                img {
                    .size(23px);
                }
            }
            .el-table__row {
                cursor: pointer;
            }
            .el-table__row.is-focus {
                .el-table__cell:first-of-type {
                    div.cell {
                        background: transparent;
                    }
                }

                .el-table__cell:nth-of-type(2) {
                    div.cell {
                        border-radius: 6px 0 0 6px;
                    }
                }
            }
        }
    }

    & > .u-right {
        .size(610px, 760px);
        display: flex;

        & > .w-card {
            flex-grow: 1;
        }
    }
}
</style>
