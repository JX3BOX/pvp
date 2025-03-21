<template>
    <div class="m-overview-list__box" tag="div">
        <empty-guide
            class="w-card"
            v-if="!entityID"
            :rotate="-90"
            :tips="['在左侧选择一个实体后', '此处会展示该实体的详细技能数']"
        ></empty-guide>
        <div class="w-card m-overview-list" v-else>
            <p class="u-title">
                <img class="u-entity-icon" :src="getMountIcon(entityID)" alt="" />
                {{ getEntityName(entityID) }}
            </p>
            <div class="m-list-info">
                <div class="u-li">
                    <p>
                        <span class="u-label">招式数</span>
                        <span class="u-value">{{ focusEntitie?.count }}</span>
                    </p>
                    <p>
                        <span class="u-label">会心数</span>
                        <span class="u-value">{{ focusEntitie?.criticalCount }}</span>
                    </p>
                </div>
                <div class="u-li">
                    <p>
                        <span class="u-label">单次最小</span>
                        <span class="u-value">{{ focusEntitie?.min }}</span>
                    </p>
                    <p>
                        <span class="u-label">单次最大</span>
                        <span class="u-value">{{ focusEntitie?.max }}</span>
                    </p>
                </div>
                <div class="u-li">
                    <p>
                        <span class="u-label">总数值</span>
                        <span class="u-value">{{ focusEntitie?.value }}</span>
                    </p>
                    <p>
                        <span class="u-label">秒伤</span>
                        <span class="u-value">{{ displayDigits(focusEntitie?.vps) }}/s</span>
                    </p>
                </div>
            </div>
            <el-table
                v-if="currentData.length <= pageSize"
                v-loading="loading"
                class="u-table w-table"
                :data="currentData"
                :border="false"
                :row-class-name="rowClass"
            >
                <el-table-column label="招式" :align="'left'">
                    <template #default="{ row }">{{ row.name }}</template>
                </el-table-column>
                <el-table-column prop="count" label="命中"></el-table-column>
                <el-table-column prop="criticalCount" label="会心"></el-table-column>
                <el-table-column label="占比">
                    <template #default="{ row }">{{ displayPercent(row.rate) }}</template>
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
    </div>
</template>

<script setup>
import { usePve } from "@/pages/jcl/store_pve";
import { displayPercent, displayDigits } from "@/utils/jcl/commonNoStore";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import EmptyGuide from "@/components/jcl/common/empty_guide.vue";
import { ref, watchPostEffect, toRefs, toRaw } from "vue";
import getWorkerResponse from "@/utils/jcl/worker";
import { getMountIcon, getEntityName } from "@/utils/jcl/common";

const global = usePve();
const { focusEntitie } = toRefs(usePve());

const loading = ref(false);
const data = ref([]);
const pageSize = ref(11);
const { statType, timeRange } = toRefs(global);
const { currentPage, currentData, total } = usePaginate(data, pageSize);
// methods

const entityID = ref(focusEntitie.value?.id);

watchPostEffect(() => {
    entityID.value = focusEntitie.value?.id;
});

const updateData = () => {
    if (!entityID.value) return;
    loading.value = true;
    getWorkerResponse("get_pve_overview_focus", {
        statType: statType.value,
        entityID: entityID.value,
        timeRange: toRaw(timeRange.value),
    }).then((result) => {
        data.value = result;
        loading.value = false;
    });
};
watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-overview-list__box {
    min-width: 386px;
}
@import "@/assets/css/jcl/pve/overview_list.less";
</style>
