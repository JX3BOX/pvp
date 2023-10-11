<template>
    <div class="m-cj-extra">
        <div class="m-extra-info">
            <CJIntro></CJIntro>
        </div>
        <div class="m-extra-bottom">
            <div class="m-extra-tabs">
                <div class="u-tab" v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value">
                    <el-icon>
                        <component :is="tab.icon"></component>
                    </el-icon>
                    <b>{{ tab.label }}</b>
                </div>
            </div>
            <div class="m-tab-content">
                <component v-if="currentComponent" :is="currentComponent"></component>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from "@/store";
const $store = useStore();

import CJIntro from "./CJIntro.vue";
import CJStrategy from "./CJStrategy.vue";
import CJPoints from "./CJPoints.vue";
export default {
    name: "CJExtra",
    components: {
        CJStrategy,
        CJIntro,
        CJPoints,
    },
    data() {
        return {
            activeTab: "point",
            tabs: [
                {
                    label: "我的标点",
                    value: "point",
                    icon: "Location",
                    component: "CJPoints",
                },
                {
                    label: "吃鸡攻略",
                    value: "strategy",
                    icon: "Collection",
                    component: "CJStrategy",
                },
            ],
        };
    },
    computed: {
        client() {
            return $store.client;
        },
        currentComponent() {
            return this.tabs.find((tab) => tab.value === this.activeTab)?.component || "";
        },
    },
    methods: {},
};
</script>

<style lang="less">
.m-cj-extra {
    @extraW: 536px;
    @extraH: 826px;
    @tabH: 40px;
    @introH: 150px;
    width: @extraW;
    height: @extraH;
    overflow-x: hidden;
    .m-intro-tabs {
        width: @extraW;
        .el-tabs__content {
            height: @introH;
            overflow-y: auto;
            .scrollbar(6px);
        }
    }
    .m-extra-tabs {
        width: @extraW;
        .el-tabs__content {
            max-height: calc(@extraH - @introH - @tabH * 2 - 30px);
            overflow-y: auto;
            .scrollbar(6px);
        }
    }
}
</style>
