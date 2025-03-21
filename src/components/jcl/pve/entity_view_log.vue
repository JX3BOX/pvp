<!--
 * @Author: X3ZvaWQ x3zvawq@gmail.com
 * @Date: 2023-03-22 08:47:25
 * @LastEditors: X3ZvaWQ x3zvawq@gmail.com
 * @LastEditTime: 2023-03-22 16:00:19
 * @FilePath: /jcl/src/components/pve/entity_view_log.vue
-->

<template>
    <div class="m-entity-skill-log w-card">
        <template v-if="currentData.length === 0">
            <empty-guide
                v-if="viewType === 'effect'"
                :rotate="-90"
                :tips="['在左侧选择一个技能后', '此处会展示该技能的所有释放记录']"
            ></empty-guide>
            <empty-guide
                v-if="viewType === 'target'"
                text-align="left"
                position="flex-start"
                :rotate="-90"
                to="row"
                :grow="false"
                :tips="['在左侧选择一个目标后', '此处会展示对目标施展的所有技能']"
            ></empty-guide>
        </template>
        <template v-else>
            <div v-if="viewType === 'target'" class="w-card-title">
                <!-- 目标为 <span class="u-light"> -->
                {{ titleName }}
                <!-- </span> 的技能列表 -->
            </div>
            <div v-else-if="viewType === 'effect'" class="w-card-title">
                <!-- 招式 -->
                <span class="u-light">{{ titleName }}</span>
                <!-- 的结算记录 -->
            </div>
            <div v-else class="w-card-title">-</div>
            <el-table
                class="u-table w-table"
                :data="currentData"
                :border="false"
                :row-class-name="rowClass"
                @row-click="selectLog"
            >
                <el-table-column prop="index" width="50" label="#" align="center"></el-table-column>
                <el-table-column label="时间" width="75">
                    <template #default="{ row }">
                        <span>{{ displayDigits(row.micro / 1000) + "s" }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="viewType === 'target'" label="图标" align="center">
                    <template #default="{ row }">
                        <div class="u-effect-icon">
                            <img :src="getResourceIcon(row.effect)" alt="" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="viewType === 'effect'" label="目标">
                    <template #default="{ row }">
                        <span>{{ getEntityName(row.target) }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="75" label="实际数值">
                    <template #default="{ row }">
                        <span>{{ row.value }}</span>
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
</template>

<script setup>
import EmptyGuide from "@/components/jcl/common/empty_guide.vue";
import { displayDigits } from "@/utils/jcl/commonNoStore";
import { getResource, getEntityName, getResourceIcon } from "@/utils/jcl/common";
import { computed, toRefs } from "vue";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { usePve } from "@/pages/jcl/store_pve";
// data
const { viewType, target, effect, targetLogs, targetLog, effectLogs, effectLog } = toRefs(usePve());

const pageSize = ref(8);
// computed
const titleName = computed(() => {
    if (viewType.value === "target") {
        return `${getEntityName(target.value)}`;
    } else if (viewType.value === "effect") {
        const resource = getResource(effect.value);
        return `${resource.name ?? resource.remark}`;
    } else return "";
});
const data = computed(() => {
    const source = [];
    if (viewType.value === "target") source.push(...targetLogs.value);
    else if (viewType.value === "effect") source.push(...effectLogs.value);
    if (!source.length) return [];
    let index = 0;
    for (let log of source) {
        log.index = ++index;
    }
    return source;
});

const { total, currentPage, currentData } = usePaginate(data, pageSize);

const selectLog = (row) => {
    if (viewType.value === "target") targetLog.value = row;
    else if (viewType.value === "effect") effectLog.value = row;
};
const rowClass = ({ row }) => {
    if (viewType.value === "target") {
        if (row.index === targetLog.value?.index) return "is-focus";
    } else if (viewType.value === "effect") {
        if (row.index === effectLog.value?.index) return "is-focus";
    }
};
</script>

<style lang="less" scoped>
.m-entity-skill-log {
    width: 400px;

    .u-light {
        color: white;
    }
    .u-effect-icon {
        .size(18px);
        .db;
        margin: auto;
    }

    .u-table {
        flex-grow: 1;
    }
}
</style>
