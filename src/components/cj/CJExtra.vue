<template>
    <div class="m-cj-extra">
        <!-- <div class="m-extra-info">
            <CJIntro></CJIntro>
        </div> -->
        <div class="m-extra-bottom">
            <div class="m-extra-tabs">
                <div
                    class="u-tab"
                    :class="tab.value === activeTab && 'is-active'"
                    v-for="tab in tabs"
                    :key="tab.value"
                    @click="activeTab = tab.value"
                >
                    <el-icon>
                        <component :is="tab.icon"></component>
                    </el-icon>
                    <b>{{ tab.label }}</b>
                </div>
                <div class="u-filter">
                    <el-select v-if="activeTab === 'point'" class="u-select" v-model="pointStatus" style="width: 100px">
                        <el-option
                            :label="status.label"
                            :value="status.value"
                            v-for="status in statusList"
                            :key="status.value"
                        ></el-option>
                    </el-select>
                    <el-button v-if="activeTab === 'strategy'" icon="Plus" @click="toPublish">发布攻略</el-button>
                </div>
            </div>
            <div class="m-tab-content">
                <component v-if="currentComponent" :is="currentComponent"></component>
            </div>
        </div>
    </div>
</template>

<script>
import { markRaw } from "vue";
import { useStore } from "@/store";
const $store = useStore();

// import CJIntro from "./CJIntro.vue";
import CJStrategy from "./CJStrategy.vue";
import CJPoints from "./CJPoints.vue";
import { statusMap } from "@/assets/data/desertPoints";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "CJExtra",
    components: {
        CJStrategy,
        // CJIntro,
        CJPoints,
    },
    data() {
        return {
            activeTab: "strategy",
            statusMap: markRaw(statusMap),
            tabs: [
                {
                    label: "吃鸡攻略",
                    value: "strategy",
                    icon: "Collection",
                    component: "CJStrategy",
                },
                {
                    label: "我的标点",
                    value: "point",
                    icon: "Location",
                    component: "CJPoints",
                },
            ],
        };
    },
    computed: {
        pointStatus: {
            get() {
                return $store.myPointsStatus;
            },
            set(val) {
                $store.myPointsStatus = val;
            },
        },
        client() {
            return $store.client;
        },
        currentComponent() {
            return this.tabs.find((tab) => tab.value === this.activeTab)?.component || "";
        },
        statusList() {
            const list = [
                {
                    value: "",
                    label: "全部",
                },
            ];
            for (const [key, value] of Object.entries(this.statusMap)) {
                list.push({
                    value: key,
                    label: value,
                });
            }
            return list;
        },
    },
    methods: {
        toPublish() {
            const url = publishLink("bps/?tags=PVP&topics=吃鸡");
            window.open(url, "_blank");
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/extra.less";
</style>
