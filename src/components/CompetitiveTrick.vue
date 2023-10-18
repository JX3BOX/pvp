<template>
    <div class="m-competitive-trick">
        <TrickNotice></TrickNotice>

        <TrickHeader
            @filterImperceptibly="filterImperceptibly"
            @filterMeta="filterMeta"
            @search="onSearch"
        ></TrickHeader>

        <div v-if="data.length" class="m-competitive-trick" v-loading="loading">
            <CompetitiveTrickItemVue v-for="item in data" :key="item.id" :data="item" :preset="presetConfig" />
        </div>
        <el-alert v-else class="m-strategy-null" title="没有找到相关条目" type="info" center show-icon></el-alert>
    </div>
</template>

<script>
import { getPosts } from "@/service/post";

import CompetitiveTrickItemVue from "./trick/CompetitiveTrickItem.vue";
import TrickNotice from "./trick/TrickNotice.vue";
import TrickHeader from "./trick/TrickHeader.vue";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { cloneDeep } from "lodash";
import { removeEmpty } from "@/utils";

export default {
    name: "CompetitiveTrick",
    components: {
        CompetitiveTrickItemVue,
        TrickNotice,
        TrickHeader,
    },
    data() {
        return {
            data: [],
            search: "",
            client: "",

            presetConfig: {},
            loading: false,
        };
    },
    computed: {
        subtype() {
            return this.$route.query?.subtype || "冰心诀";
        },
        mark() {
            return this.$route.query?.mark || "";
        },
        order() {
            return this.$route.query?.order || "";
        },
        zlp() {
            return this.$route.query?.zlp || "";
        },
        query: function () {
            return {
                type: "pvp",
                sticky: 1,
                subtype: this.subtype,
                order: this.order,
                mark: this.mark,
                client: this.client,
                search: this.search,
                zlp: this.zlp,
            };
        },
    },
    watch: {
        query: {
            immediate: true,
            deep: true,
            handler() {
                this.loadData();
            },
        },
    },
    methods: {
        publishLink,
        loadData() {
            this.loading = true;
            const params = removeEmpty(cloneDeep(this.query));
            getPosts(params)
                .then((res) => {
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onSearch: function (search) {
            this.search = search;
        },
        // 条件过滤（不附加路由）
        filterImperceptibly: function (o) {
            this[o["type"]] = o["val"];
        },
        // 条件过滤
        filterMeta: function (o) {
            this.replaceRoute({ [o["type"]]: o["val"] });
        },
        // 路由绑定
        replaceRoute: function (extend) {
            return this.$router
                .push({ name: this.$route.name, query: Object.assign({}, this.$route.query, extend) })
                .then(() => {
                    window.scrollTo(0, 0);
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/competitive_trick.less";
</style>
