<template>
    <div>
        <div class="m-main">
            <div class="m-setting-wrap">
                <div class="w-card m-main-setting">
                    <p class="m-main-subtitle">设定</p>
                    <div class="m-seeting-item" v-for="(filter, index) in filterList" :key="index">
                        <p class="u-title">{{ filter.title }}</p>
                        <p class="u-seeting-action">
                            <span
                                :class="{ 'is-active': filters.includes(filter.name) }"
                                @click="switchFilter(filter.name)"
                            >
                                隐藏
                            </span>
                            <span
                                :class="{ 'is-active': !filters.includes(filter.name) }"
                                @click="switchFilter(filter.name)"
                            >
                                显示
                            </span>
                        </p>
                    </div>
                </div>
                <div class="u-btn" @click="click">分析</div>
            </div>
            <!-- 玩家列表 -->
            <div class="w-card m-main-player">
                <p class="m-main-subtitle">玩家</p>
                <div class="m-player-list">
                    <div
                        class="m-player-item"
                        :class="{
                            // 'is-disabled': true,
                            'is-active': entityList.includes(item.id),
                        }"
                        v-for="(item, index) in playerList"
                        :key="index"
                        :title="getEntityName(item.id, { showRegion: true })"
                        @click="selectEntity(item)"
                    >
                        <img class="u-mount-icon" :src="getMountIcon(item.id)" alt="" />
                        <p class="u-name">{{ getEntityName(item.id) }}</p>
                        <p class="u-timer">{{ item.timer }}</p>
                        <p class="u-timer">{{ formatTime(item.firstAppear ? item.firstAppear.micro : null) }}</p>
                    </div>
                </div>
            </div>
            <!-- npc列表 -->
            <div class="w-card m-main-npc">
                <p class="m-main-subtitle">NPC</p>
                <div>
                    <div class="m-npc-list">
                        <div
                            class="m-npc-item"
                            :class="{
                                'is-disabled': isCompare,
                                'is-active': !isCompare && entityList.includes(item.id),
                            }"
                            :key="index"
                            v-for="(item, index) in currentData"
                            @click="selectEntity(item)"
                        >
                            <div class="m-npc-item__left">
                                <img class="u-mount-icon" :src="getMountIcon(item.id)" alt="" />
                                <p class="u-name">{{ getEntityName(item.id) }}</p>
                            </div>
                            <p class="u-timer">{{ formatTime(item.firstAppear ? item.firstAppear.micro : null) }}</p>
                        </div>
                    </div>
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
        </div>
    </div>
</template>

<script setup>
import moment from "moment";
import { getMountIcon, getEntityName } from "@/utils/jcl/common";
import { useStore } from "@/pages/jcl/store";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";
import { ElMessage } from "element-plus";

const store = useStore();

const pageSize = 22;

const props = defineProps({
    onSelected: Function,
    onSelectEntity: Function,
    entityList: {
        tyep: Array,
        default: () => [],
    },
    max: Number,
    isCompare: {
        type: Boolean,
        default: false,
    },
});

const { entityList, max, isCompare } = toRefs(props);

const npcList = ref([]);
const playerList = ref([]);
const filters = ref(["hideBelong", "hideNoName", "hideSameTemplate"]);

const filterList = [
    {
        name: "hideBelong",
        title: "有归属的单位",
    },
    {
        name: "hideNoName",
        title: "无名的单位",
    },
    {
        name: "hideSameTemplate",
        title: "同模板的单位",
    },
];

// 切换筛选
const switchFilter = (filter) => {
    if (filters.value.includes(filter)) {
        filters.value = filters.value.filter((f) => f !== filter);
    } else {
        filters.value.push(filter);
    }
};

// 选择单位事件
const selectEntity = (row) => {
    if (entityList.value.includes(row.id)) {
        entityList.value = entityList.value.filter((id) => id !== row.id);
        props.onSelectEntity && props.onSelectEntity(row, false);
    } else {
        const len = entityList.value.filter((item) => item != null).length;
        if (max.value && len >= max.value) {
            ElMessage("最多选中" + max.value + "个实体");
            return;
        }
        entityList.value = [...entityList.value, row.id];
        props.onSelectEntity && props.onSelectEntity(row, true);
    }
};
// 点击分析
const click = () => {
    props.onSelected && props.onSelected(entityList.value);
};

// 获取列表数据
const data = computed(() => {
    const { entities } = store.result;
    let _templateExist = {};
    let index = 1;
    let entitiesArr = Object.values(entities).filter((e) => {
        if (!e.id) return;
        if (filters.value.includes("hideBelong") && e.belongID) return false;
        if (filters.value.includes("hideNoName") && !e.name) return false;
        if (filters.value.includes("hideSameTemplate") && e.type === "npc") {
            if (_templateExist[e.templateID] === true) return false;
            _templateExist[e.templateID] = true;
        }
        e.index = index++;

        return true;
    });
    const playerList = entitiesArr.filter((item) => item.type === "player");
    const npcList = entitiesArr.filter((item) => item.type === "npc");

    return {
        playerList,
        npcList,
    };
}, [store.result]);

// 监听 data 的变化
watch(
    data,
    (newVal) => {
        npcList.value = newVal.npcList;
        playerList.value = newVal.playerList;
    },
    { deep: true, immediate: true }
);

const { currentPage, currentData, total } = usePaginate(npcList, ref(pageSize));

const formatTime = (microseconds) => {
    if (!microseconds) {
        return "-";
    }
    return moment.utc(microseconds).format("HH:mm:ss");
};
</script>

<style lang="less" scoped>
.m-main {
    .flex;
    gap: 30px;
    .m-main-subtitle {
        .fz(20px,26px);
        .mb(20px);
        .bold;
    }
    .m-setting-wrap {
        .m-main-setting {
            .mb(30px);
            .flex;
            gap: 20px;
            flex-direction: column;
            width: 360px;
            .m-main-subtitle {
                .mb(0);
            }
            .m-seeting-item {
                .flex;
                justify-content: space-between;
                .fz(14px,18px);
                .bold;
                .u-seeting-action {
                    .flex;
                    gap: 20px;
                    color: #939393;
                    span {
                        cursor: pointer;
                        // &:hover {
                        //     color: #fff;
                        // }
                    }
                    .is-active {
                        color: #fff;
                    }
                }
            }
        }
        .u-btn {
            .fz(20px,52px);
            .bold;
            border-radius: 16px;
            background: #282828;
            text-align: center;
            cursor: pointer;
            &:hover {
                color: #000;
                background: #b6c4cc;
            }
            &:active {
                color: #000;
                background: #d3efff;
            }
        }
    }

    .m-main-player {
        flex: 1;
    }
    .m-main-npc {
        flex: 1;
    }
}

.m-player-list {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(5, 1fr);
    @media screen and (max-width: 1600px) {
        grid-template-columns: repeat(4, 1fr);
    }

    .m-player-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        text-align: center;
        padding: 10px 14px;
        border-radius: 8px;
        background: #535353;
        cursor: pointer;
        color: #fff;
        justify-content: space-between;
        // &:hover {
        //     background: #b6c4cc;
        //     color: #000;
        // }
        &.is-active {
            background: #b6c4cc;
            color: #000;
        }
        &.is-disabled {
            background: rgba(83, 83, 83, 0.6);
            color: rgba(255, 255, 255, 0.1);
            cursor: default;
            .u-timer {
                color: rgba(255, 255, 255, 0.1);
            }
        }

        .u-mount-icon {
            .size(18px, 18px);
        }
        .u-name {
            flex: 1;
            font-size: 14px;
            display: -webkit-box;
            line-clamp: 2; /* 限制显示的行数 */
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
        }
        .u-timer {
            .fz(10px, 13px);
            color: #939393;
        }
    }
}

.m-npc-list {
    .mb(10px);
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, 1fr);
    .m-npc-item {
        padding: 10px 14px;
        border-radius: 8px;
        background: #535353;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        // &:hover {
        //     background: #b6c4cc;
        //     color: #000;
        // }
        &.is-active {
            background: #b6c4cc;
            color: #000;
        }
        &.is-disabled {
            cursor: default;
            background: rgba(83, 83, 83, 0.6);
            color: rgba(255, 255, 255, 0.1);
            .u-timer {
                color: rgba(255, 255, 255, 0.1);
            }
        }
        .m-npc-item__left {
            display: flex;
            gap: 10px;
            .u-mount-icon {
                width: 18px;
                height: 18px;
            }
            .u-name {
                font-size: 14px;
            }
        }

        .u-timer {
            .fz(10px,13px);
            color: #939393;
        }
    }
}
</style>
