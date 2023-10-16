<template>
    <!-- 吃鸡心法 -->
    <div class="m-cj-xf">
        <div class="m-xf-select">
            <div class="u-logo" :class="currentLogo.alt === '门派心法' && 'is-logo'">
                <img :src="currentLogo.src" :alt="currentLogo.alt" />
            </div>
            <el-select class="u-select" v-model="subtype" filterable @change="toRoute">
                <el-option label="全部心法" value="">
                    <div class="u-xf-option">
                        <img class="u-pic" src="@/assets/img/logo.svg" alt="全部心法" />
                        <span class="u-txt">全部心法</span>
                    </div>
                </el-option>
                <el-option v-for="(item, i) in xfmaps" :key="i" :value="item.name">
                    <div class="u-xf-option">
                        <img class="u-pic" :src="showMountIcon(item.id)" :alt="item.name" />
                        <span class="u-txt">{{ item.name }}</span>
                    </div>
                </el-option>
            </el-select>
        </div>
        <div v-if="client === 'std'" class="m-xf-buff">
            <h4 class="u-title">
                <el-icon><ZoomIn /></el-icon>心法加成
            </h4>
            <div class="u-buff">+1</div>
        </div>
    </div>
</template>

<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { useStore } from "@/store";
const $store = useStore();

export default {
    name: "CJXf",
    data() {
        return {
            subtype: "",
        };
    },
    computed: {
        client() {
            return $store.client;
        },
        tab: function () {
            return this.$route.query.tab;
        },
        xfmaps() {
            delete xfmap["山居剑意"];
            return Object.values(xfmap).filter((item) => item.client.includes(this.client));
        },
        currentLogo() {
            const id = this.subtype !== "" ? xfmap[this.subtype].id : null;
            return {
                src: id !== null ? this.showMountIcon(id) : require("@/assets/img/logo.svg"),
                alt: id !== null ? xfmap[this.subtype].name : "门派心法",
            };
        },
    },
    watch: {
        "$route.query": {
            immediate: true,
            deep: true,
            handler(query) {
                const { subtype } = query;
                this.subtype = subtype || "";
            },
        },
    },
    methods: {
        showMountIcon,
        toRoute(subtype) {
            this.$router.push({
                query: {
                    subtype,
                    tab: this.tab,
                },
            });
        },
    },
};
</script>
