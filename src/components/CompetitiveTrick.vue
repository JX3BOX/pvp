<template>
    <div class="m-competitive-trick">
        <TrickNotice></TrickNotice>

        <TrickHeader
            @filterImperceptibly="filterImperceptibly"
            @filterMeta="filterMeta"
            @search="onSearch"
            @filterWujie="filterWujie"
        ></TrickHeader>

        <div v-if="data.length" class="m-competitive-trick" v-loading="loading">
            <CompetitiveTrickItemVue v-for="item in data" :key="item.id" :data="item" :preset="presetConfig" />
        </div>
        <el-alert v-else class="m-strategy-null" title="没有找到相关条目" type="info" center show-icon></el-alert>

        <design-task v-model="showDesignTask" :post="currentPost"></design-task>
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
import User from "@jx3box/jx3box-common/js/user";
import { getDesignLog } from "@/service/design";
import DesignTask from "@jx3box/jx3box-vue3-ui/src/bread/DesignTask.vue";
import bus from "@jx3box/jx3box-vue3-ui/utils/bus";

export default {
    name: "CompetitiveTrick",
    components: {
        CompetitiveTrickItemVue,
        TrickNotice,
        TrickHeader,
        DesignTask,
    },
    data() {
        return {
            data: [],
            search: "",
            client: "",

            presetConfig: {},
            loading: false,

            currentPost: null,
            showDesignTask: false,
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
        is_wujie() {
            return this.$route.query?.is_wujie || 0;
        },
        query: function () {
            return {
                sticky: 1,
                subtype: this.subtype,
                order: this.order,
                mark: this.mark,
                client: this.client,
                search: this.search,
                zlp: this.zlp,
                is_wujie: this.is_wujie,
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
    mounted() {
        bus.on("design-task", (post) => {
            this.currentPost = post;
            this.showDesignTask = true;
        });
    },
    beforeUnmount() {
        bus.off("design-task");
    },
    methods: {
        publishLink,
        loadData() {
            this.loading = true;
            const params = removeEmpty(cloneDeep(this.query));
            getPosts(params)
                .then(async (res) => {
                    this.data = res.data.data.list || [];

                    if (User.hasPermission("push_banner") && !this.isPhone) {
                        const ids = this.data.map((item) => item.ID);
                        const logs = await getDesignLog({ source_type: "pvp", ids: ids.join(",") }).then(
                            (res) => res.data.data
                        );

                        this.data = this.data.map((item) => {
                            const log = logs.find((log) => log.source_id == item.ID) || null;
                            item.log = log;
                            return item;
                        });
                    }
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
        filterWujie: function (val) {
            this.replaceRoute({ is_wujie: val });
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
