<template>
    <el-tabs class="m-tabs" v-model="view">
        <el-tab-pane label="连招技巧" name="post">
            <template #label
                ><el-icon>
                    <notebook />
                </el-icon>
                <b>连招技巧</b>
                <em class="u-secret">竞技指南</em>
            </template>
        </el-tab-pane>
        <el-tab-pane label="武学研习" name="index">
            <template #label>
                <el-icon><Collection /></el-icon>
                <b>武学研习</b>
            </template>
        </el-tab-pane>
        <el-tab-pane label="技改历史" name="changelog">
            <template #label
                ><el-icon>
                    <Notification />
                </el-icon>
                <b>技改历史</b>
            </template>
        </el-tab-pane>
        <el-tab-pane label="阵营沙盘" name="sandbox">
            <template #label>
                <el-icon><Compass /></el-icon>
                <b>阵营沙盘</b>
            </template>
        </el-tab-pane>
        <el-tab-pane label="绝境战场" name="desert">
            <template #label>
                <el-icon><Chicken /></el-icon>
                <b>绝境战场</b>
            </template>
        </el-tab-pane>
        <el-tab-pane label="招募大厅" name="zm" disabled>
            <template #label>
                <el-icon><Collection /></el-icon>
                <b>招募大厅</b>
            </template>
        </el-tab-pane>
        <el-tab-pane label="阵营攻防" name="gf" disabled>
            <template #label>
                <el-icon><Collection /></el-icon>
                <b>阵营攻防</b>
            </template>
        </el-tab-pane>
        <el-tab-pane label="竞技场" name="jjc" disabled>
            <template #label>
                <el-icon><Collection /></el-icon>
                <b>竞技场</b>
            </template>
        </el-tab-pane>
        <el-tab-pane label="斗鱼直播" name="douyu" disabled>
            <template #label>
                <el-icon><Collection /></el-icon>
                <b>斗鱼直播</b>
            </template>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    name: "PvpTabs",
    data() {
        return {
            view: "post",
        };
    },
    watch: {
        $route: {
            handler(_route) {
                this.view = _route.name;
            },
            immediate: true,
            deep: true,
        },
        view: {
            handler() {
                const query =
                    this.view === "sandbox"
                        ? {}
                        : {
                              subtype: this.$route.query.subtype,
                              is_wujie: this.$route.query.is_wujie,
                          };
                this.$router.push({
                    name: this.view,
                    query,
                });
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/tabs.less";
</style>
