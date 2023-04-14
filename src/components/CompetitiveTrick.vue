<template>
    <div class="m-competitive-trick" v-if="data?.length">
        <CompetitiveTrickItemVue v-for="item in data" :key="item.id" :data="item" :subtype="subtype" />
    </div>
    <div class="u-competitive-trick-null" v-else>
        <el-icon :size="13"><Warning /></el-icon>
        <span>当前暂无竞技技巧分享，我要</span>
        <a
            class="s-link el-button el-button--small is-round el-button--primary"
            target="_blank"
            :href="publishLink(`pvp`)"
            >分享技巧</a
        >
    </div>
</template>

<script>
import { useStore } from "@/store";
import { getPosts } from "@/service/post";

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
    },
};
</script>

<style lang="less">
@import "@/assets/css/competitive_trick.less";
</style>
