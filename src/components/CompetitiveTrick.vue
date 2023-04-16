<template>
    <div class="u-competitive-trick-null">
        <template v-if="data?.length"
            ><el-icon><Promotion /></el-icon>一起分享竞技连招，前往</template
        >
        <template v-else>
            <el-icon :size="13"><Warning /></el-icon>
            <span>当前暂无分享记录，我要</span>
        </template>
        <a
            class="s-link el-button el-button--small is-round el-button--primary"
            target="_blank"
            :href="publishLink(`pvp`)"
            >分享技巧</a
        >
    </div>
    <div class="m-competitive-trick" v-if="data?.length">
        <CompetitiveTrickItemVue
            v-for="item in data"
            :key="item.id"
            :data="item"
            :subtype="subtype"
            :preset="presetConfig"
        />
    </div>
</template>

<script>
import { useStore } from "@/store";
import { getPosts, getBoxcoinStatus, getPostBoxcoinConfig } from "@/service/post";
import User from "@jx3box/jx3box-common/js/user.js";

import CompetitiveTrickItemVue from "./trick/CompetitiveTrickItem.vue";
import { publishLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "CompetitiveTrick",
    components: {
        CompetitiveTrickItemVue,
    },
    data() {
        return {
            data: [],

            presetConfig: {},
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
        publishLink,
        loadData() {
            getPosts({ type: "pvp", subtype: this.subtype, client: this.client })
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
