<template>
    <div>
        <div class="m-entity-skill">
            <div class="u-left w-card">
                <div class="w-card-title">主动招式</div>
                <EntityCardPie />
                <el-table
                    v-loading="loading"
                    class="u-table w-table"
                    :data="currentData"
                    :border="false"
                    :show-header="false"
                    @sort-change="sort"
                    @row-click="click"
                    :row-class-name="rowClass"
                >
                    <el-table-column label="招式" width="140">
                        <template #default="{ row }">
                            <div class="u-center">
                                <!-- <img class="u-mount-icon" :src="getResourceIcon(row.icon)" alt="" /> -->
                                <span class="u-entity-name">{{ row.name }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="占比">
                        <template #default="{ row }">
                            {{ displayPercent(row.rate) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="selection" width="35" aligin="right">
                        <template #default="{ row }">
                            <el-checkbox
                                :key="selectedSkills[row.name].stat"
                                :checked="selectedSkills[row.name].stat.length > 0"
                            />
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
            <div class="u-right">
                <EntitySkillTimeline />
            </div>
        </div>
    </div>
</template>

<script setup>
import EntityCardPie from "./entity_skill_pie.vue";
import EntitySkillTimeline from "./entity_skill_timeline.vue";
import { usePve } from "@/pages/jcl/store_pve";

// import getWorkerResponse from "@/utils/jcl/worker";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { displayPercent } from "@/utils/jcl/commonNoStore";
// import { getResourceIcon } from "@/utils/jcl/common";

import { useStore } from "@/pages/jcl/store";
import { getResource } from "@/utils/jcl/common";

import getWorkerResponse from "@/utils/jcl/worker";
const { entity, selectedSkills, selectedSkill } = toRefs(usePve());
const pageSize = ref(10);
const store = useStore();
const loading = ref(false);

// 获取可供选择的数据
const updateData = () => {
    loading.value = true;
    getWorkerResponse("get_pve_entity_skill", {
        entity: entity.value,
    }).then((result) => {
        const _selected = result.selectedSkills;
        let i = 0;
        for (let d of result.data) {
            if (i == 0) {
                _selected[d.name].stat = ["cast", "hit", "miss"];
                // _selected[d.name].stat = ["cast"];
            } else {
                _selected[d.name].stat = [];
            }
            i++;
        }
        selectedSkills.value = _selected;
        loading.value = false;
    });
};

const click = (row) => {
    const { name } = row;

    if (selectedSkills.value[name].stat.length > 0) {
        selectedSkills.value[name].stat = [];
    } else {
        selectedSkills.value[name].stat = ["cast", "hit", "miss"];
    }
    selectedSkill.value = row;
};

// 获取选中的用户表格数据
const tableData = computed(() => {
    const source = store.result.skill?.[entity.value]?.logs;
    if (!source) return [];
    const result = {};
    const idNameMap = {};
    for (let log of source) {
        if (!idNameMap[log.id]) {
            const name = getResource("skill:" + log.id).name;
            if (!name) continue;
            idNameMap[log.id] = name;
        }
        const name = idNameMap[log.id];
        const _selectedSkill = selectedSkills.value[name];

        if (!_selectedSkill) continue;
        if (!result[name]) {
            result[name] = {
                name: name,
                cast: 0,
                hit: 0,
                miss: 0,
                count: 0,
                interval: 0,
                _last: 0,
            };
        }
        result[name][log.skillType]++;
        result[name].count++;

        if (result[name].count != 0) {
            result[name].interval =
                (result[name].interval * (result[name].count - 1) + (log.time - result[name]._last)) /
                result[name].count;
            result[name]._last = log.time;
        }
    }
    const res = Object.values(result);

    selectedSkill.value = res[0];
    return res;
});

const { currentPage, currentData, total } = usePaginate(tableData, pageSize);

watchPostEffect(updateData);
</script>

<style lang="less" scoped>
@import "@/assets/css/jcl/pve/overview_list.less";
.m-entity-skill {
    .flex;
    gap: 30px;
    > .u-left {
        width: 360px;
        .u-table {
            height: 350px;
            .u-center {
                display: flex;
                align-items: center;
            }
            .u-mount-icon {
                .size(18px, 18px);
                margin-right: 10px;
            }
            .u-entity-name {
                flex: 1;
                .ellipsis;
            }
        }
    }
    > .u-right {
        flex: 1;
    }
}
</style>
