<template>
    <div class="m-data-list">
        <div class="u-tabs" v-if="enableTab">
            <template v-for="(tab, index) in tabs" :key="index">
                <div class="u-tab" :class="{ active: tab.name == active }" @click="active = tab.name">
                    {{ tab.title }}
                </div>
            </template>
        </div>
        <div class="u-search" v-if="enableSearch">
            <el-input v-model="search" placeholder="请输入搜索关键词.." @keyup.enter="getList" :suffix-icon="Search" />
        </div>
        <div class="u-list" v-loading="loading">
            <div class="u-list-data">
                <div class="u-list-empty" v-if="total === 0">暂无数据，上传一个吧 😘</div>
                <div class="u-list-item" v-for="(item, index) in data" :key="index">
                    <!-- 数据类型 -->
                    <span class="u-type" :class="`u-type-${item.subject}`">{{ subjectName(item.subject) }}</span>
                    <div class="u-name" @click="router.push({ name: 'view', query: { id: item.id } })">
                        <!-- 私有、天梯榜等 -->
                        <i class="u-badge u-private" v-if="item.visible != 0"
                            ><img svg-inline src="@/assets/img/jcl/works/draft.svg" alt=""
                        /></i>
                        <i class="u-badge u-star" v-if="item.rank_id"><i>★</i>天梯榜</i>
                        <i class="u-badge u-checked" v-if="item.is_checked"
                            ><img svg-inline src="@/assets/img/jcl/works/checked.svg"
                        /></i>
                        <!-- 名称 -->
                        <span>{{ item.title }}</span>
                    </div>
                    <!-- 私人数据操作 -->
                    <span class="u-opr" v-if="mine">
                        <el-button link :icon="Edit" @click.stop="editDialog.open(item)" />
                        <el-popconfirm
                            width="220"
                            confirm-button-text="确定"
                            title="😱此操作将永久删除数据, 是否继续?"
                            effect="dark"
                            popper-class="m-del-confirm"
                            :icon="null"
                            @confirm="delData(item)"
                        >
                            <template #reference>
                                <el-button link :icon="Delete" />
                            </template>
                        </el-popconfirm>
                    </span>
                    <span class="u-update">
                        <span>更新：</span>
                        <span>{{ item.updated_at }}</span>
                    </span>
                </div>
            </div>

            <div v-if="enablePaginate" class="u-list-pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page="page"
                    @update:current-page="page = $event"
                    :total="total"
                    :page-size="pageSize"
                    :hide-on-single-page="true"
                />
            </div>
            <router-link v-if="showMore" class="u-list-more" to="/public">
                查看更多<el-icon><DArrowRight /></el-icon>
            </router-link>
        </div>
        <EditDialog v-if="mine" ref="editDialog" @updated="getList"></EditDialog>
    </div>
</template>

<script setup>
import { Edit, Delete, Search } from "@element-plus/icons-vue";
import EditDialog from "./edit_dialog.vue";
import { getPublicList, deleteBattle, getMyList } from "@/service/jcl/team";

import { ElMessage } from "element-plus";
import { ref, watchPostEffect, toRefs } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// props
const props = defineProps({
    enableTab: {
        type: Boolean,
        default: false,
    },
    enableSearch: {
        type: Boolean,
        default: false,
    },
    mine: {
        type: Boolean,
        default: false,
    },
    pageSize: {
        type: Number,
        default: 12,
    },
    enablePaginate: {
        type: Boolean,
        default: false,
    },
    showMore: {
        type: Boolean,
        default: false,
    },
});
const { enableTab, enableSearch, enablePaginate, mine, showMore, pageSize } = toRefs(props);

// data
const active = ref("team");
const tabs = [
    {
        name: "team",
        title: "团队分析",
    },
    {
        name: "boss",
        title: "首领分析",
    },
    {
        name: "pvp",
        title: "竞技多维",
    },
];
const editDialog = ref(null);

const search = ref("");
const loading = ref(false);
const data = ref([]);
const page = ref(1);
const total = ref(0);

// methods
const getList = () => {
    const params = {
        type: "jcl",
        subject: active.value,
        page: page.value,
        pageSize: pageSize.value,
    };
    if (search.value) {
        if (search.value.match(/^zhcn_.+::.+::\d+::\d+::\d+\/\d+/)) {
            params.battle_id = search.value;
        } else {
            params.title = search.value;
        }
    }
    if (mine.value) {
        delete params.subject;
    }
    loading.value = true;
    const res = mine.value ? getMyList(params) : getPublicList(params);
    if (res) {
        res.then((res) => {
            if (res.data?.code === 0) {
                let {
                    list: _data,
                    page: { total: _total },
                } = res.data.data;
                data.value = _data;
                total.value = _total;
            } else {
                ElMessage.error(res.data.msg ?? "获取数据失败");
            }
        })
            .catch((e) => {
                console.warn(e);
                ElMessage.error("获取数据失败");
            })
            .finally(() => {
                loading.value = false;
            });
    }
};
const delData = (item) => {
    deleteBattle(item.id).then((res) => {
        if (res.data?.code === 0) {
            ElMessage.success("删除成功");
            getList();
        } else {
            ElMessage.error(res.data.msg ?? "删除失败");
        }
    });
};

const subjectName = (subject) => {
    return (
        {
            boss: "首领行为",
            team: "团队行为",
            pvp: "竞技多维",
        }[subject] ?? "JCL数据"
    );
};
// watch
watchPostEffect(getList);
</script>

<style lang="less">
.m-del-confirm {
    padding: 16px;
}
.m-data-list {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    min-height: 500px;

    .u-tabs {
        display: flex;
        gap: 10px;
        .mb(20px);
        .u-tab {
            user-select: none;
            cursor: pointer;
            flex-grow: 1;

            color: white;
            background: #554d77;
            border-radius: 30px;
            height: 40px;

            .bold;
            .fz(14px, 40px);
            .x;
            transition: flex-grow 0.2s ease-in-out;

            &.active {
                flex-grow: 2;
                background: linear-gradient(90deg, #fa5fa6 0%, #1d95f8 100%);
            }
        }
    }
    .u-search {
        .el-input__inner {
            color: #bfb0ff;
            &::placeholder {
                color: #554d77;
            }
        }

        .el-input__wrapper {
            background: #121019;
            box-shadow: none;
            border: 3px dashed #554d77;
            border-radius: 10px;
        }

        .mb(20px);
    }
    .u-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        background: #121019;
        border: 3px dashed #554d77;
        border-radius: 10px;
        padding: 20px;
        .fz(14px, 17px);
        .color(#BFB0FF);
    }
    .u-list-empty {
        .x;
        padding: 60px;
        height: 100%;
    }
    .u-list-data {
        flex-grow: 1;
    }
    .u-list-item {
        .color(#BFB0FF);
        display: flex;
        align-items: center;
        // height: 40px;

        &:not(:last-child) {
            border-bottom: 1px solid rgba(191, 176, 255, 0.2);
        }

        .u-type {
            color: white;
            background: #24a4cc;
            border-radius: 10px;
            width: 69px;
            height: 18px;
            .x;
            .mr(10px);
            .fz(12px, 18px);
            &.u-badge-team {
                background: #42a28b;
            }
            &.u-badge-boss {
                background: #8472d2;
            }
            &.u-badge-pvp {
                background: #812e13;
            }
        }
        .badge-color(@color: #f360a8) {
            i {
                .mr(1px);
                color: @color;
            }
            border: 1px solid @color;
            color: @color;
        }
        .u-badge {
            .db;
            &.u-private {
                .mt(4px);
            }

            &.u-star {
                .badge-color(#f360a8);
                padding: 0 3px;
                font-style: normal;
                font-size: 12px;
                border-radius: 2px;
                transform: scale(0.8);
                flex-shrink: 0;

                &:hover {
                    .badge-color(#2892f4);
                }
            }

            &.u-checked svg {
                .size(16px);
                .pr;
                top: 1px;
            }
        }
        .u-name {
            .pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            flex-grow: 1;
            padding: 10px 0;

            &:hover {
                filter: brightness(1.5);
            }
        }
        .u-opr {
            padding: 0 14px;

            .el-button {
                color: #bfb0ff;
                transition: all 0.2s ease-in-out;
                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }
    .u-list-pagination {
        .el-pagination {
            justify-content: center;

            li,
            button {
                color: white;
                background-color: #554d77;

                &.is-active {
                    background: linear-gradient(90deg, #fa5fa6 0%, #1d95f8 100%);
                }
            }
        }
    }
    .u-list-more {
        .flex;
        justify-content: center;
        align-items: center;
        color: #bfb0ff;
    }
}
</style>
