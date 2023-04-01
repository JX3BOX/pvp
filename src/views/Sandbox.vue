<template>
    <ListLayout :has-right="false">
        <div class="m-pvp-sandbox-content">
            <SandboxIndex @sandboxChangeKey="onSandboxLogs" />

            <div class="m-extend">
                <div class="m-strategy-box">
                    <SandboxIntro />
                </div>

                <el-tabs class="m-tabs" v-model="view">
                    <el-tab-pane label="沙盘攻略" name="index">
                        <template #label>
                            <el-icon><Collection /></el-icon>
                            <b>沙盘攻略</b>
                        </template>
                        <SandboxHandbook />
                    </el-tab-pane>
                    <el-tab-pane label="沙盘记录" name="logs">
                        <template #label>
                            <el-icon><DataAnalysis /></el-icon>
                            <b>沙盘记录</b>
                        </template>
                        <SandboxLogs :sandboxData="sandboxLogsData" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </ListLayout>
</template>

<script>
import { useStore } from "@/store";
import ListLayout from "@/layouts/ListLayout.vue";
import SandboxIndex from "@/components/sandbox/SandBoxIndex.vue";
import SandboxLogs from "@/components/sandbox/SandboxLogs.vue";
import SandboxHandbook from "@/components/sandbox/SandboxHandbook.vue";
import SandboxIntro from "@/components/sandbox/SandboxIntro.vue";

import { getSandboxLogs } from "@/service/raw.js";
export default {
    name: "SandBoxPage",
    components: {
        SandboxIndex,
        ListLayout,
        SandboxLogs,
        SandboxHandbook,
        SandboxIntro,
    },
    data: function () {
        return {
            view: "index",
            sandboxLogsData: [],
        };
    },
    computed: {
        client() {
            return useStore().client;
        },
        params: function () {
            return {
                sandmap_id: this.id,
                camp: this.camp,
            };
        },
    },
    methods: {
        // 取出所有日志数据
        async onSandboxLogs(key = "斗转星移") {
            let data = await getSandboxLogs({ server: key });
            this.sandboxLogsData = data.data ? data.data.list : [];
        },
    },
    mounted() {
        this.onSandboxLogs();
    },
};
</script>

<style lang="less">
@import "@/assets/css/index.less";
@import "~@/assets/css/sandbox/sandbox.less";
</style>
