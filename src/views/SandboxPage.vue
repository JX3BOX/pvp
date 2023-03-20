<template>
    <AppLayout>
        <div class="pvp-sandbox-content">
            <SandBoxCont @sandboxChangeKey="onSandboxLogs" />
            <div class="right-layout">
                <div class="strategy-box">
                    <div class="strategy-page">
                        <i v-show="strategyIndex == 1"></i>
                        <i class="u-icon" @click="checkPage('l')" v-show="strategyIndex !== 1"
                            ><img svg-inline src="@/assets/img/left.png"
                        /></i>
                        <i class="u-icon" @click="checkPage('r')" v-show="strategyIndex < StrategyData.length"
                            ><img svg-inline src="@/assets/img/right.png"
                        /></i>
                    </div>
                    <div class="strategy-content" v-html="StrategyData[strategyIndex]"></div>
                </div>
                <el-tabs class="m-tabs padding-r" v-model="view">
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
                <div class="tab-contnet padding-r">
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
import SandBoxCont from "@/components/SandBox.vue";
import sandboxLogs from "@/components/sandbox/Logs.vue";
import sandboxHandbook from "@/components/sandbox/HandBook.vue";
import { getStrategy } from "@/service/sandbox";
import * as sandboxLogsJson from "@/assets/data/sandboxLog.json";
export default {
    name: "SandBoxPage",
    components: {
        SandBoxCont,
        AppLayout,
        sandboxLogs,
        sandboxHandbook,
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
@import "~@/assets/css/sandbox.less";
</style>
<style lang="less" scoped>
.pvp-sandbox-content {
    display: flex;
    position: relative;
    top: -60px;
    // justify-content: space-between;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    ::-webkit-scrollbar {
        width: 0 !important;
    }
    // ie10+
    .right-layout {
        width: 100%;
        border-left: 1px solid #eee;
        box-sizing: border-box;
        overflow-y: auto;
        // height: calc(100vh - 124px);
        //
        .padding-r {
            padding: 0px 10px 0px 10px;
        }
    }

    .strategy-box {
        min-height: 200px;
        margin-bottom: 20px;
        position: relative;
        padding: 0 8px;
        .strategy-page {
            display: flex;
            justify-content: space-between;
            width: calc(100% - 20px);
            position: absolute;
            top: 10px;
            z-index: 2;
            .u-icon {
                width: 25px;
                height: 25px;
                cursor: pointer;
            }
            .page-disabled {
                cursor: not-allowed;
                pointer-events: none;
            }
        }
        .strategy-content {
            position: absolute;
            top: 0;
        }
    }
}
</style>
