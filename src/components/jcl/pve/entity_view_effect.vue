<template>
    <div class="m-entity-view-effect">
        <div class="u-left w-card" v-loading="loading">
            <template v-if="currentData.length === 0">
                <empty-guide
                    text-align="left"
                    to="row"
                    position="flex-start"
                    :grow="false"
                    :tips="['在上方选择一个单位后', '此处会展示该单位的详细技能数']"
                ></empty-guide>
            </template>
            <template v-else>
                <div class="w-card-title">
                    <span>{{ targetLabel }}列表</span>
                    <div class="u-filters">
                        <div class="u-tab" :class="{ 'is-active': viewType == 'effect' }" @click="viewType = 'effect'">
                            技能
                        </div>
                        <div class="u-tab" :class="{ 'is-active': viewType == 'target' }" @click="viewType = 'target'">
                            目标
                        </div>
                    </div>
                </div>
                <el-table
                    class="u-table w-table"
                    :data="currentData"
                    :border="false"
                    @sort-change="sort"
                    @row-click="click"
                    :row-class-name="rowClass"
                >
                    <el-table-column v-if="viewType == 'target'" :label="targetLabel" width="112">
                        <template #default="{ row }">
                            <div class="u-effect-title">
                                <img class="u-effect-icon" :src="getMountIcon(row.target)" alt="" />
                                <span class="u-effect-name" :title="getEntityName(row.target, { showRegion: true })">{{
                                    getEntityName(row.target)
                                }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-else label="招式" width="130">
                        <template #default="{ row }">
                            <div class="u-effect-title">
                                <img class="u-effect-icon" :src="getResourceIcon(row.effect)" alt="" />
                                <span class="u-effect-name" :title="getResourceName(row.effect, { showID: true })">{{
                                    getResourceName(row.effect, { showID: flase })
                                }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="count" label="次数" width="80" sortable="custom"></el-table-column>
                    <el-table-column prop="value" label="数值" width="158" sortable="custom">
                        <template #default="{ row }">
                            <span>{{ row.value }}</span>
                            <span> ({{ displayPercent(row.valueRate) }})</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="critRate" label="会心" width="120" sortable="custom">
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
        <div class="u-right">
            <entity-skill-log></entity-skill-log>
            <entity-skill-log-detail></entity-skill-log-detail>
        </div>
    </div>
</template>

<script setup>
import EmptyGuide from "@/components/jcl/common/empty_guide.vue";
import { ref, watch, toRefs, toRaw } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { getResourceIcon, getResourceName } from "@/utils/jcl/common";
import { displayDigits, displayPercent } from "@/utils/jcl/commonNoStore";
import getWorkerResponse from "@/utils/jcl/worker";
import { getMountIcon, getEntityName } from "@/utils/jcl/common";

import EntitySkillLog from "./entity_view_log.vue";
import EntitySkillLogDetail from "./entity_view_log_detail.vue";
// 注入的属性
const { entityTab, viewType, entity, entityTimeRange, effect, effectLogs, effectLog, target, targetLog, targetLogs } =
    toRefs(usePve());

// 行点击事件
const click = (row) => {
    if (viewType.value == "target") {
        if (target.value === row.target) return;
        target.value = row.target;
        targetLogs.value = row.logs;

        targetLog.value = row.logs[0];
    } else {
        if (effect.value === row.effect) return;
        effect.value = row.effect;
        effectLogs.value = row.logs;
        effectLog.value = row.logs[0];
    }
};

// computed
const targetLabel = computed(() => {
    return viewType.value == "target" ? "目标" : "招式";
});

// 行样式
const rowClass = ({ row }) => {
    if (viewType.value == "effect") {
        return effect.value === row.effect ? "is-focus" : "";
    } else {
        return target.value === row.target ? "is-focus" : "";
    }
};
// 数据相关
const loading = ref(false);
const data = ref([]);
const pageSize = ref(8);
const { currentPage, currentData, total } = usePaginate(data, pageSize);

// 数据更新逻辑
const updateData = () => {
    loading.value = true;
    data.value = [];
    const fun = viewType.value === "effect" ? "get_pve_entity_view_effect" : "get_pve_entity_view_target";
    getWorkerResponse(fun, {
        entityTab: entityTab.value,
        entity: entity.value,
        timeRange: toRaw(entityTimeRange.value[entity.value]),
        skipNoNameTarget: true,
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
    let index = 1;
    for (let item of data.value) {
        item.index = index++;
    }
};
watch(
    [entity, () => entityTimeRange.value[entity.value], entityTab, viewType],
    ([newEntity], [oldEntity]) => {
        if (oldEntity && newEntity !== oldEntity) clearLogs();
        updateData();
    },
    { immediate: true, flush: "post" }
);

const clearLogs = () => {
    effect.value = null;
    effectLogs.value = [];
    effectLog.value = null;

    target.value = null;
    targetLogs.value = [];
    targetLog.value = null;

    if (data.value.length) {
        click(data.value[0]);
    }
};
watch(() => data.value, clearLogs, { flush: "post" });
</script>

<style lang="less">
.m-entity-view-effect {
    display: flex;
    gap: 20px;
    height: 426px;
    .w-card-title {
        display: flex;
        justify-content: space-between;
        .u-filters {
            .flex;
            .fz(14px,18px);
            font-weight: normal;
            color: rgba(255, 255, 255, 0.3);
            .u-tab {
                .w(40px);
                text-align: center;
                &.is-active {
                    color: #fff;
                }
            }
        }
    }

    & > .u-left {
        width: 534px;
        display: flex;
        flex-direction: column;
        .w-card-title {
            display: flex;
            gap: 40px;
        }
        .u-table {
            .u-effect-title {
                .flex;
                align-items: center;
                .u-effect-icon {
                    .size(18px);
                    margin-right: 10px;
                }
                .u-effect-name {
                    .ellipsis;
                }
            }

            .el-table__row {
                cursor: pointer;
            }
        }
        .u-window-tip {
            .flex-center;
            gap: 8px;
        }
        .u-clear-window {
            .pointer;
        }
    }
    & > .u-right {
        display: flex;
        gap: 20px;
        flex: 1;

        & > div:first-of-type {
            width: 293px;
        }
        & > div:last-of-type {
            flex: 1;
        }
    }
}
</style>
