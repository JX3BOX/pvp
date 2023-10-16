<template>
    <div class="m-cj-strategy" v-loading="loading">
        <div v-if="list.length" class="m-strategy-list">
            <ListItem v-for="item in list" :key="item.post_id" :item="item" :order="params.order"></ListItem>
        </div>
        <!-- 空 -->
        <el-alert
            v-else
            effect="dark"
            class="m-strategy-null"
            title="没有找到相关条目"
            type="info"
            center
            show-icon
        ></el-alert>

        <!-- 下一页 -->
        <el-button
            class="m-strategy-more"
            v-show="hasNextPage"
            type="primary"
            @click="appendPage"
            :loading="loading"
            icon="el-icon-arrow-down"
            >加载更多</el-button
        >

        <!-- 分页 -->
        <el-pagination
            class="m-strategy-pages"
            background
            layout="total, prev, pager, next"
            :hide-on-single-page="true"
            :total="total"
            :current-page="page"
            @current-change="changePage"
        ></el-pagination>
    </div>
</template>

<script>
import { useStore } from "@/store";
import { getPosts } from "@/service/cj";
import { cloneDeep } from "lodash";
import ListItem from "@/components/cj/ListItem.vue";
export default {
    name: "CJStrategy",
    components: {
        ListItem,
    },
    data() {
        return {
            page: 1,
            pages: 1,
            per: 5,
            total: 0,
            loading: false,
            list: [],
        };
    },
    computed: {
        // 是否显示加载更多
        hasNextPage: function () {
            return this.pages > 1 && this.page < this.pages;
        },
        params() {
            return {
                page: this.page,
                per: this.per,
            };
        },
        query() {
            return {
                subtype: this.$route.query.subtype,
                client: useStore().client,
                order: "update",
            };
        },
    },
    watch: {
        query: {
            deep: true,
            handler: function () {
                this.page = 1;
                this.load();
            },
        },
    },
    methods: {
        load(appendMode = false) {
            const params = {
                ...cloneDeep(this.params),
                ...cloneDeep(this.query),
            };
            if (params.subtype) {
                params.sticky = 1;
            } else {
                delete params.subtype;
            }
            this.loading = true;
            getPosts(params)
                .then((res) => {
                    if (appendMode) {
                        this.list = this.list.concat(res.data?.data?.list);
                    } else {
                        this.list = res.data?.data?.list;
                    }
                    this.total = res.data?.data?.total;
                    this.pages = res.data?.data?.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 翻页加载
        changePage(i) {
            this.page = i;
            this.load();
        },
        // 追加加载
        appendPage() {
            this.page++;
            this.load(true);
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/list.less";
</style>
