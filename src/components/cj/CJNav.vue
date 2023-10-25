<template>
    <div class="m-cj-nav">
        <div class="m-nav-top">
            <CJXf></CJXf>
        </div>
        <div class="m-nav-bottom">
            <div class="m-nav-tabs">
                <div
                    class="u-tab"
                    :class="activeTab === tab.value && 'is-active'"
                    v-for="tab in tabs"
                    :key="tab.value"
                    @click="setTab(tab.value)"
                >
                    <el-icon>
                        <component :is="tab.icon"></component>
                    </el-icon>
                    <b>{{ tab.label }}</b>
                </div>
            </div>
            <div class="m-tab-content">
                <component :is="currentComponent"></component>
            </div>
        </div>
    </div>
</template>

<script>
import CJXf from "./CJXf.vue";
import CJSkill from "./CJSkill.vue";
import CJEquipment from "./CJEquipment.vue";
import CJItem from "./CJItem.vue";
import { useStore } from "@/store";
const $store = useStore();

export default {
    name: "CJNav",
    components: {
        CJXf,
        CJSkill,
        CJEquipment,
        CJItem,
    },
    data() {
        return {
            activeTab: location.href.includes("origin") ? "skill" : "equipment",
            originTabs: [
                {
                    label: "装备对比",
                    value: "equipment",
                    client: ["std"],
                    icon: "scale-to-original",
                    component: "CJEquipment",
                },
                {
                    label: "技能查询",
                    value: "skill",
                    client: ["origin"],
                    icon: "Search",
                    component: "CJSkill",
                },
                {
                    label: "道具介绍",
                    value: "item",
                    client: ["std", "origin"],
                    icon: "Money",
                    component: "CJItem",
                },
            ],
        };
    },
    computed: {
        client() {
            return $store.client;
        },
        tabs() {
            return this.originTabs.filter((tab) => tab.client.includes(this.client));
        },
        currentComponent() {
            return this.tabs.find((tab) => tab.value === this.activeTab)?.component || "";
        },
    },
    methods: {
        setTab(tab) {
            this.activeTab = tab;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/nav.less";
.m-simple-item-popup {
    padding: 0 !important;
    background: none !important;
    border: none !important;
}
</style>
