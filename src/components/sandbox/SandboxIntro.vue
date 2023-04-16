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
import { getBread } from "@/service/raw";
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
                pvp_sandbox_base: "LocationInformation",
                pvp_sandbox_gameplay: "Cpu",
                pvp_sandbox_tree: "Grape",
                pvp_sandbox_model: "Apple",
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
            const key =
                "pvp_sandbox_intro,pvp_sandbox_rule,pvp_sandbox_base,pvp_sandbox_gameplay,pvp_sandbox_tree,pvp_sandbox_model";
            getBread({ key })
                .then((res) => {
                    this.data = res.data.data || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>
