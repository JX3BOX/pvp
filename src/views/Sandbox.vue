<template>
    <ListLayout :has-right="false">
        <div class="m-pvp-sandbox-content">
            <SandboxIndex @sandboxChangeKey="onSandboxLogs" />

            <div class="m-extend">
                <div class="m-strategy-box">
                    <div class="m-strategy-page">
                        <i v-show="strategyIndex == 1"></i>
                        <i class="u-icon" @click="checkPage('l')" v-show="strategyIndex !== 1"
                            ><img svg-inline src="@/assets/img/left.png"
                        /></i>
                        <i class="u-icon" @click="checkPage('r')" v-show="strategyIndex < StrategyData.length"
                            ><img svg-inline src="@/assets/img/right.png"
                        /></i>
                    </div>
                    <div class="m-strategy-content" v-html="StrategyData[strategyIndex]"></div>
                </div>

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
                <div class="m-tab-content">
                    <SandboxLogs v-if="view == 'logs'" :sandboxData="sandboxLogsData" />
                    <SandboxHandbook v-if="view == 'index'" />
                </div>
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
import { getStrategy } from "@/service/sandbox";
import * as sandboxLogsJson from "@/assets/data/sandboxLog.json";
export default {
    name: "SandBoxPage",
    components: {
        SandboxIndex,
        ListLayout,
        SandboxLogs,
        SandboxHandbook,
    },
    props: [],
    data: function () {
        return {
            view: "index",
            sandboxLogsData: [],
            StrategyData: [],
            strategyIndex: 1,
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
        onSandboxLogs(key = "斗转星移") {
            this.sandboxLogsData = sandboxLogsJson[key] ? sandboxLogsJson[key] : [];
        },
        // 获取并处理攻略文章
        async getStrategyData() {
            let data = await getStrategy();
            data = data.post_content.split("<!--nextpage-->");
            this.StrategyData = data;
        },
        // 右侧切换分页
        checkPage(type = "l") {
            if (type == "l") {
                return (this.strategyIndex = this.strategyIndex > 1 ? this.strategyIndex - 1 : 1);
            }
            this.strategyIndex =
                this.strategyIndex < this.StrategyData.length ? this.strategyIndex + 1 : this.StrategyData.length;
        },
    },
    mounted() {
        this.onSandboxLogs();
        this.getStrategyData();
    },
};
</script>

<style lang="less">
@import "@/assets/css/index.less";
@import "~@/assets/css/sandbox/sandbox.less";
</style>
