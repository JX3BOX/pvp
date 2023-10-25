<template>
    <div class="c-macro__header">
        <div class="m-archive-search">
            <a :href="publish_link" class="u-publish el-button el-button--primary el-button--large">+ 发布作品</a>
            <el-input
                placeholder="请输入搜索内容"
                v-model.trim.lazy="search"
                clearable
                @clear="onSearch"
                @keydown.enter="onSearch"
                size="large"
            >
                <template v-slot:prepend>
                    <span class="u-search">
                        <el-icon> <Search /></el-icon> <span class="u-search">关键词</span></span
                    >
                </template>
                <template v-slot:append>
                    <el-button icon="Position" class="u-btn" @click="onSearch"></el-button>
                </template>
            </el-input>
        </div>

        <!-- 筛选 -->
        <div class="m-archive-filter" v-if="canFilter">
            <div class="m-filter--left">
                <!-- 版本过滤 -->
                <clientBy @filter="filterImperceptibly" :type="client"></clientBy>
                <!-- 角标过滤 -->
                <markBy @filter="filterMeta"></markBy>
                <!-- 资料片过滤 -->
                <zlpBy @filter="filterMeta" type="zlp" :client="client"></zlpBy>
            </div>
            <div class="m-filter--right">
                <!-- 排序过滤 -->
                <orderBy @filter="filterMeta"></orderBy>
            </div>
        </div>
    </div>
</template>

<script>
import setting from "@/../setting.json";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { useStore } from "@/store";
export default {
    name: "TrickHeader",
    props: {
        canFilter: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            search: "",
            client: useStore().client,
        };
    },
    computed: {
        // 发布按钮链接
        publish_link: function () {
            return publishLink(setting.appKey);
        },
    },
    methods: {
        filterImperceptibly(val) {
            this.$emit("filterImperceptibly", val);
        },
        filterMeta(val) {
            this.$emit("filterMeta", val);
        },
        onSearch() {
            this.$emit("search", this.search);
        },
    },
};
</script>
