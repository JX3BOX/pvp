<template>
    <div class="m-list-nav">
        <h5 class="u-title">
            心法导航
            <router-link class="u-more" :to="{ query: { subtype: '' } }"
                >全部心法<el-icon><ArrowRight /></el-icon
            ></router-link>
        </h5>
        <ul class="m-bps-nav u-list">
            <li class="u-item" v-for="(item, i) in xfmaps" :key="i" v-show="item.client.includes(client)">
                <router-link
                    class="u-link"
                    :to="{ query: { subtype: item.name, tab: tab, is_wujie } }"
                    :class="{ on: isActive(item) }"
                >
                    <i class="u-pic">
                        <img :src="showMountIcon(item.id)" :alt="item.name" />
                    </i>
                    <span class="u-txt">{{ item.name }}</span>
                </router-link>
            </li>
        </ul>

        <h5 class="u-title">在线应用</h5>
        <div class="m-nav-group">
            <!-- <a href="/pz" target="_blank">
                <img class="u-icon" :src="getAppIcon('pz', true)" />
                <span>配装模拟器</span>
                <em>Assembly Simulator</em>
            </a> -->
            <!-- <a href="/pvp/sandbox">
                <img class="u-icon" :src="getAppIcon('sandbox', true)" />
                <span>阵营沙盘</span>
                <em>JX3 Sandbox</em>
            </a> -->
            <!-- <a href="/jcl" target="_blank">
                <img class="u-icon" :src="getAppIcon('jcl', true)" />
                <span>战斗日志分析</span>
                <em>JX3 Combat Log</em>
            </a> -->
            <a href="/collection/451" target="_blank">
                <img class="u-icon" :src="getAppIcon('jx3dat')" />
                <span>PVP监控下载</span>
                <em>PvP Jx3dat</em>
            </a>
        </div>
    </div>
</template>

<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getAppIcon, showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { useStore } from "@/store";
export default {
    name: "list_nav",
    props: [],
    computed: {
        client: function () {
            return useStore().client;
        },
        tab: function () {
            return this.$route.query.tab;
        },
        is_wujie: function () {
            return this.$route.query.is_wujie || 0;
        },
        xfmaps() {
            delete xfmap["山居剑意"];
            return xfmap;
        },
    },
    methods: {
        isActive: function (item) {
            return item.name == this.$route.query.subtype;
        },
        getAppIcon,
        showMountIcon,
    },
};
</script>

<style lang="less">
@import "@/assets/css/nav.less";
</style>
