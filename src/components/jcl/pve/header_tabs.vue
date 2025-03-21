<template>
    <div class="m-pve-tabs">
        <div
            class="u-tab"
            v-for="(tab, index) in showTab"
            :key="index"
            :class="{ 'is-active': mainTab === tab.name, [tab.name]: true }"
            @click="switchTab(tab.name, tab)"
        >
            <img v-show="mainTab === tab.name" class="u-tab-icon" :src="tab.activedIcon" :draggable="false" />
            <img v-show="mainTab !== tab.name" class="u-tab-icon" :src="tab.icon" :draggable="false" />
            <!-- <div class="u-tab-title">{{ tab.title }}</div> -->
        </div>
    </div>
</template>

<script setup>
import { raid_analysis_constant } from "@/assets/data/jcl/raid_constant";
import { workerBusy } from "@/utils/jcl/worker";
import { ElMessage } from "element-plus";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store";
const { mainTab } = toRefs(usePve());
const store = useStore();

const tabList = [
    {
        name: "overview",
        icon: require("@/assets/img/jcl/pve/header_overview_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_overview_actived.svg"),
        title: "全局总览",
    },
    {
        name: "detail",
        icon: require("@/assets/img/jcl/pve/header_detail_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_detail_actived.svg"),
        title: "单位详情",
    },
    {
        name: "compare",
        icon: require("@/assets/img/jcl/pve/header_compare_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_compare_actived.svg"),
        title: "单位对比",
    },
    {
        name: "blame",
        icon: require("@/assets/img/jcl/pve/header_compare_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_compare_actived.svg"),
        title: "团员分析",
    },
    {
        name: "time_line",
        icon: require("@/assets/img/jcl/pve/header_timer_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_timer_actived.svg"),
        title: "首领技能轴",
    },
    {
        name: "buff_coverage_main",
        icon: require("@/assets/img/jcl/pve/header_buff_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_buff_actived.svg"),
        title: "团队增益",
    },
    {
        name: "video",
        icon: require("@/assets/img/jcl/pve/header_video_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_video_actived.svg"),
        title: "视频回放",
    },
    {
        name: "logs",
        icon: require("@/assets/img/jcl/pve/header_logs_default.svg"),
        activedIcon: require("@/assets/img/jcl/pve/header_logs_actived.svg"),
        title: "全部记录",
    },
    {
        name: "upload",
        icon: require("@/assets/img/jcl/common/upload.svg"),
        title: "云端保存",
    },
];

const showTab = computed(() => {
    return tabList.filter((tab) => {
        //if (tab.name === "blame") return false;
        if (tab.name === "upload" && store.info.title) return false;
        if (tab.name === "video" && !store.info.video_identifier) return false;
        if (
            tab.name == "blame" &&
            (!raid_analysis_constant.blame_enable_mapId.includes(store.result.map) || store.result.client == "origin")
        )
            return false;
        if (
            tab.name == "time_line" &&
            (!raid_analysis_constant.timeline_enable_mapId.includes(store.result.map) ||
                store.result.client == "origin")
        ) {
            return false;
        }

        return true;
    });
});

const switchTab = (tab) => {
    // 检查是否有worker在处理数据
    if (workerBusy()) return ElMessage.error("当前页面正在处理数据，请稍后再试");
    if (mainTab.value == tab) return;
    mainTab.value = tab;
};
</script>

<style lang="less" scoped>
.m-pve-tabs {
    display: flex;
    gap: 25px;
    .u-tab {
        .pointer;
        user-select: none;
        .flex-center;
        flex-direction: column;
        gap: 4px;
        .colorful-text(linear-gradient(90deg, #fa5fa6 0%, #1d95f8 100%));
        transition: all 0.2s ease-in-out;

        &:not(.is-active) {
            filter: brightness(0.8) grayscale(1);
        }

        &:not(.is-active):hover {
            filter: brightness(0.5);
        }

        .u-tab-icon {
            // .size(35px, 25px);
            .db;
            height: 45px;
        }

        .u-tab-title {
            .bold;
            .fz(14px, 18px);
        }
    }
}
</style>
