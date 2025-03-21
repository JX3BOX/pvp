<template>
    <div class="p-pve-result">
        <!-- <pve-header></pve-header> -->
        <jcl-header>
            <pve-header-tabs></pve-header-tabs>
        </jcl-header>

        <div class="u-title">
            <h1>{{ displayTitle }}</h1>
        </div>
        <div class="m-pve-main">
            <div class="m-pve-content">
                <component :is="mainComponents[mainTab]"></component>
            </div>
            <!-- <pve-overview></pve-overview> -->
        </div>
    </div>
</template>

<script setup>
import { toRefs, onMounted, defineComponent, watchPostEffect } from "vue";
import { useStore } from "@/pages/jcl/store";
import { usePve } from "@/pages/jcl/store_pve";
import { useRouter } from "vue-router";
import JclHeader from "@/components/jcl/common/jcl_header.vue";
import PveHeaderTabs from "@/components/jcl/pve/header_tabs.vue";
import PveOverview from "@/components/jcl/pve/pve_overview.vue";
import PevDeatil from "@/components/jcl/pve/pve_detail.vue";
import PveCompare from "@/components/jcl/pve/pve_compare.vue";
import BlameIndex from "@/components/jcl/pve/blame_index.vue";
import BossTimeLine from "@/components/jcl/pve/boss_timeline_selector.vue";
import PveLogs from "@/components/jcl/pve/pve_logs.vue";
import BuffCoverageMain from "@/components/jcl/pve/buff_coverage_main.vue";

const mainComponents = {
    overview: PveOverview,
    detail: PevDeatil,
    compare: PveCompare,
    blame: BlameIndex,
    time_line: BossTimeLine,
    buff_coverage_main: BuffCoverageMain,
    logs: PveLogs,
};
const store = useStore();
const router = useRouter();
const { mainTab, statType, entityTab, viewType, entityList, entity, compareMode, compareEntity } = toRefs(usePve());

const displayTitle = computed(() => {
    const { info, file } = store;
    const title = info.title || file.name || "这是一个标题！这是一个标题！这是一个标题！这是一个标题！";
    return title.replace(/\.jcl$/, "");
});
onMounted(() => {
    const query = router.currentRoute.value.query;
    // 初始化，带着结果来的，如果有路由
    if (store.result) {
        if (query.tab) mainTab.value = query.tab;
        if (query.statType) statType.value = query.statType;
        if (query.entityTab) entityTab.value = query.entityTab;
        if (query.viewType) viewType.value = query.viewType;
        if (query.entity) {
            if (!entityList.value.includes(query.entity)) entityList.value.push(Number(query.entity));
            entity.value = Number(query.entity);
        }
        if (query.compareMode) compareMode.value = query.compareMode;
        if (compareEntity.value[0]) query.entity1 = compareEntity.value[0];
        if (compareEntity.value[1]) query.entity2 = compareEntity.value[1];
        if (compareEntity.value[2]) query.entity3 = compareEntity.value[2];
        if (compareEntity.value[3]) query.entity4 = compareEntity.value[3];
        return;
    }
    // 初始化的时候，没有结果，但是带了ID，带着query跳去view
    if (query.id) {
        router.push({ name: "view", query });
        return;
    }
    // 没有id，跳回home
    router.push({ name: "home" });
});
// 用户切换各种tab、选择玩家的时候修改路由
watchPostEffect(() => {
    const id = store.info?.id;
    if (!id) return;
    const query = {
        id,
        tab: mainTab.value,
    };

    if (mainTab.value === "overview") {
        if (statType.value) query.statType = statType.value;
    }

    if (mainTab.value === "detail") {
        if (entityTab.value) query.entityTab = entityTab.value;
        if (viewType.value) query.viewType = viewType.value;
        if (statType.value) query.statType = statType.value;
    }

    if (mainTab.value === "compare") {
        if (compareMode.value) query.compareMode = compareMode.value;
        if (compareEntity.value[0]) query.entity1 = compareEntity.value[0];
        if (compareEntity.value[1]) query.entity2 = compareEntity.value[1];
    }
    router.replace({ query });
});

defineComponent({
    name: "PveIndex",
});
</script>

<style lang="less" scoped>
.p-pve-result {
    max-width: 1920px;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 30px;
}
// .m-pve-main {
// padding: 0 30px;
// width: 1440px;
// margin: 0 auto;
// }
.u-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    h1 {
        .fz(12px,16px);
        text-align: center;
        font-weight: normal;
        width: 500px;
        padding: 10px 20px;
        background: #282828;
        border-radius: 4px;
        color: #fff;
    }
}
</style>
