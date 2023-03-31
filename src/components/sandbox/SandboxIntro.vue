<template>
    <div class="m-sandbox-intro" v-loading="loading">
        <el-tabs v-model="active">
            <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
                <el-icon><Compass /></el-icon>
                <el-icon><DataBoard /></el-icon>
                <div v-html="item?.html"></div>
            </el-tab-pane>
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
            data: [],
            active: "",
        };
    },
    computed: {
        tabs() {
            return this.data.map((item) => {
                return {
                    name: item.name,
                    label: item.label,
                    html: item.html,
                };
            });
        },
    },
    watch: {
        tabs: {
            handler() {
                this.active = this.tabs[0].name;
            },
            deep: true,
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.loading = true;
            const key = "pvp_sandbox_intro,pvp_sandbox_rule";
            getSandboxIntro({ names: key })
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
