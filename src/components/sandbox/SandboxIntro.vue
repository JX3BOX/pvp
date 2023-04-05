<template>
    <div class="m-sandbox-intro" v-loading="loading">
        <el-tabs v-model="active">
            <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
                <template #label>
                    <el-icon class="u-tab-icon"><component :is="icons[item.name]"></component></el-icon>
                    <b>{{ item.label }}</b>
                </template>
                <div v-html="item?.html"></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getSandboxIntro } from "@/service/sandbox";
import { markRaw } from "vue";
export default {
    name: "SandboxIntro",
    props: [],
    components: {},
    data: function () {
        return {
            loading: false,
            data: [],
            active: "",

            icons: markRaw({
                pvp_sandbox_intro: "Compass",
                pvp_sandbox_rule: "DataBoard",
                pvp_sandbox_background: "Monitor",
            }),
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
            const key = "pvp_sandbox_intro,pvp_sandbox_rule,pvp_sandbox_background";
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
