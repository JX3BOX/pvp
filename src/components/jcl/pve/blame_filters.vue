<template>
    <div class="m-blame-filters">
        <!-- <div class="w-card u-filters">
            <div class="w-card-title">筛选器</div>
            <div class="w-tabs">
                <div
                    class="u-tab"
                    v-for="(filter, index) in filterList"
                    :key="index"
                    :class="{ 'is-active': filters[filter.name] }"
                    @click="filters[filter.name] = !filters[filter.name]"
                >
                    {{ filter.title }}
                </div>
            </div>
        </div> -->
        <div class="w-card u-menu">
            <div class="w-card-title">
                <div>事件列表</div>
                <div class="u-filters">
                    <div
                        class="u-tab"
                        :class="{ 'is-active': filters[filter.name] }"
                        v-for="(filter, index) in filterList"
                        :key="index"
                        @click="filters[filter.name] = !filters[filter.name]"
                    >
                        {{ filter.title }}
                    </div>
                </div>
            </div>
            <el-table class="u-table w-table" :data="currentData" :border="false">
                <el-table-column label="时间" width="100">
                    <template #default="{ row }">
                        <div v-if="row.time < 60">
                            <span>{{ ~~row.time }}秒</span>
                        </div>
                        <div v-else>
                            <span>{{ ~~(row.time / 60) }}分{{ ~~(row.time % 60) }}秒</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="玩家">
                    <template #default="{ row }">
                        <jcl-entity :entity="row.playerId"></jcl-entity>
                    </template>
                </el-table-column>
                <el-table-column label="事件" width="80">
                    <template #default="{ row }">
                        <span>{{ row.event }}</span>
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
    </div>
</template>

<script setup>
import { toRefs, onMounted, ref } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import JclEntity from "../common/jcl_entity.vue";

import { usePaginate } from "@/utils/jcl/uses/usePaginate";

const props = defineProps({
    data: Array,
});
const { data } = toRefs(props);
const pageSize = ref(18);
const { currentPage, currentData, total } = usePaginate(data, pageSize);

// 单位过滤器相关
const filters = toRefs(usePve()).blame_filters;
const filterList = [
    {
        name: "death",
        title: "重伤",
    },
    {
        name: "buff",
        title: "非正常BUFF",
    },
];

// 点击触发右侧跳转
onMounted(() => {
    filterList.forEach((filter) => {
        filters[filter.name] = true;
    });
});
</script>

<style lang="less" scoped>
.w-card-title {
    display: flex;
    justify-content: space-between;
    .u-filters {
        .flex;
        .fz(14px,18px);
        font-weight: normal;
        color: rgba(255, 255, 255, 0.3);
        .u-tab {
            cursor: pointer;
            margin-left: 10px;
            text-align: center;
            &.is-active {
                color: #fff;
            }
        }
    }
}
.m-blame-filters {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 20px;
    .size(360px, 760px);
    .w-card {
        gap: 10px;
        position: relative; /* Add this */
    }

    .w-tabs {
        display: flex;
        flex-wrap: wrap;
        .mt(10px);
        .mb(-10px);

        .u-tab {
            .mb(10px);
            &.is-active {
                background-color: #0c759e;
            }
        }
    }

    .u-menu {
        position: relative; /* Add this */
        flex-grow: 1;
        flex-shrink: 0;
    }
    .w-pagination {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}
</style>
