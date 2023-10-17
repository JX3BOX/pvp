<template>
    <div class="m-competitive-trick">
        <TrickNotice></TrickNotice>

        <div class="m-search">
            <a :href="publishLink" class="u-publish el-button el-button--primary">+ 发布作品</a>
        </div>

        <div class="m-competitive-trick" v-loading="loading">
            <CompetitiveTrickItemVue v-for="item in data" :key="item.id" :data="item" :preset="presetConfig" />
        </div>
    </div>
</template>

<script>
import { useStore } from "@/store";
import { getPosts, getBoxcoinStatus, getPostBoxcoinConfig } from "@/service/post";
import User from "@jx3box/jx3box-common/js/user.js";

import CompetitiveTrickItemVue from "./trick/CompetitiveTrickItem.vue";
import TrickNotice from "./trick/TrickNotice.vue";
import { publishLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "CompetitiveTrick",
    components: {
        CompetitiveTrickItemVue,
        TrickNotice,
    },
    data() {
        return {
            data: [],

            presetConfig: {},
            loading: false,
        };
    },
    computed: {
        subtype() {
            return this.$route.query?.subtype || "冰心诀";
        },
        client() {
            return useStore().client;
        },
    },
    watch: {
        subtype: {
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    methods: {
        publishLink() {
            return publishLink("pvp");
        },
        loadData() {
            this.loading = true;
            getPosts({ type: "pvp", subtype: this.subtype, client: this.client, sticky: 1 })
                .then((res) => {
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async init() {
            if (!User.isLogin()) return;
            await getBoxcoinStatus().then((res) => {
                this.presetConfig.boxcoin_enable = !!~~res.data.data.val;
            });
            await getPostBoxcoinConfig(this.postType).then((res) => {
                this.presetConfig.admin_max = res.data.data.limit.admin_max || 0;
                this.presetConfig.admin_min = res.data.data.limit.admin_min || 0;
                this.presetConfig.admin_points = res.data.data.limit.admin_points || [10, 1000];
                this.presetConfig.admin_left = res.data.data.asManagerBoxCoinRemain || 0;
                this.presetConfig.admin_total = res.data.data.asManagerBoxCoinTotal || 0;

                this.presetConfig.user_points = res.data.data.limit.user_points || [10, 1000];
                // 根据多端展示剩余币
                // 作品是n端，接受n端币+all币
                if (this.client == "origin") {
                    this.presetConfig.user_left =
                        res.data.data.asUserBoxCoinRemainOrigin + res.data.data.asUserBoxCoinRemainAll;
                } else if (this.client == "std") {
                    this.presetConfig.user_left =
                        res.data.data.asUserBoxCoinRemainStd + res.data.data.asUserBoxCoinRemainAll;
                } else {
                    this.presetConfig.user_left =
                        res.data.data.asUserBoxCoinRemainAll +
                        res.data.data.asUserBoxCoinRemainStd +
                        res.data.data.asUserBoxCoinRemainOrigin;
                }
            });
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/competitive_trick.less";
</style>
