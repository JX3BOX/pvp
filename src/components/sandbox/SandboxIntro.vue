<template>
    <div class="m-sandbox-intro" v-loading="loading">
        <el-tabs v-model="tab">
            <el-tab-pane label="规则简介" name="rule">
                <div class="u-content" v-html="content.rule"></div>
            </el-tab-pane>
            <el-tab-pane label="攻防技巧" name="tips">Config</el-tab-pane>
            <el-tab-pane label="历史记录" name="history">Task</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getSandboxIntro } from "@/service/sandbox";
export default {
    name: "SandboxIntro",
    props: [],
    components: {},
    data: function () {
        return {
            loading: false,
            tab: "",
            tabs: [],
            content: {
                rule: "",
            },
        };
    },
    computed: {},
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {
        this.loading = true;
        getSandboxIntro(56294)
            .then((res) => {
                this.content.rul = res.data.data?.post_content;
            })
            .finally(() => {
                this.loading = false;
            });
    },
};
</script>
