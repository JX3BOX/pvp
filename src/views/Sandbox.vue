<template>
    <AppLayout>
        <div class="pvp-sandbox-content">
            <SandBox @sandboxChangeKey="onSandbox" />
            <div class="right-layout">
                <el-tabs class="m-tabs" v-model="view">
                    <el-tab-pane label="沙盘指南" name="index">
                        <template #label>
                            <el-icon><Collection /></el-icon>
                            <b>沙盘指南</b>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="沙盘记录" name="logs">
                        <template #label>
                            <el-icon><Collection /></el-icon>
                            <b>沙盘记录</b>
                        </template>
                    </el-tab-pane>
                </el-tabs>
                <div class="tab-contnet">
                    <sandboxLogs v-if="view == 'logs'" :sandboxData="sandboxLogsData" />
                    <sandboxHandbook v-if="view == 'index'"></sandboxHandbook>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import { useStore } from "@/store";
import AppLayout from "@/layouts/AppLayout.vue";
import SandBox from "@/components/SandBox.vue";
import sandboxLogs from "@/components/sandbox/logs.vue";
import sandboxHandbook from "@/components/sandbox/handbook.vue";
import * as sandboxLogsJson from "@/assets/data/sandboxLog.json";
console.log(sandboxLogsJson);
export default {
    name: "SandBoxPage",
    components: {
        SandBox,
        AppLayout,
        sandboxLogs,
        sandboxHandbook,
    },
    props: [],
    data: function () {
        return {
            view: "index",
            sandboxLogsData: [],
        };
    },
    methods: {
        onSandbox(key = "斗转星移") {
            this.sandboxLogsData = sandboxLogsJson[key] ? sandboxLogsJson[key] : [];
        },
    },
    computed: {
        client() {
            return useStore().client;
        },
    },
    mounted() {
        this.onSandbox();
    },
};
</script>

<style lang="less">
@import "@/assets/css/index.less";
</style>
<style lang="less" scoped>
.pvp-sandbox-content {
    display: flex;
    position: relative;
    top: -60px;
    // justify-content: space-between;
    padding: 0 0px 0 25px;
    .right-layout {
        width: 100%;
        border-left: 1px solid #eee;
        box-sizing: border-box;
        overflow-y: auto;
        height: 100vh;
        padding: 10px 10px 10px 25px;
    }
}
</style>
