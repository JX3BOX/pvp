<template>
    <div class="p-view">
        <div class="m-view-card">
            <template v-if="!error && !downloadError">
                <div class="m-title">{{ title }}</div>
                <div class="m-desc">{{ desc }}</div>
                <el-progress :show-text="false" :percentage="progress" :stroke-width="10" />
                <div class="m-view-logs">
                    <div v-if="downProgress">
                        <el-icon v-if="downProgress != 100" class="is-loading"> <Loading /> </el-icon>
                        <el-icon v-else><Select /></el-icon>
                        下载数据文件
                    </div>
                    <div v-if="inflateProgress">
                        <el-icon v-if="inflateProgress != 100" class="is-loading"> <Loading /> </el-icon>
                        <el-icon v-else><Select /></el-icon>
                        解压数据文件
                    </div>
                    <div v-if="inflateProgress === 100">
                        <el-icon v-if="analysisProgress != 100" class="is-loading"> <Loading /> </el-icon>
                        <el-icon v-else><Select /></el-icon>
                        分析JCL
                    </div>
                    <div v-if="analysisProgress === 100">
                        <el-icon class="is-loading"> <Loading /> </el-icon>
                        即将跳转
                    </div>
                </div>
            </template>
            <div v-if="error" class="m-error-tip">
                <el-icon><CloseBold /></el-icon>
                数据不存在或没有访问权限
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineComponent, onMounted, ref, computed, watchPostEffect } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "@/pages/jcl/store";
import { getBattle, getJclBattle } from "@/service/jcl/team";
import { useAnalysis } from "@/utils/jcl/uses/useAnalysis";
import { useDownload } from "@/utils/jcl/uses/useDownload";

defineComponent({
    name: "ViewIndex",
});
const store = useStore();
const router = useRouter();
const { query } = router.currentRoute.value;
const { id, battle_id } = query;
const error = ref(false);
const { startDownload, inflateProgress, downProgress, downloadError } = useDownload();
const { startAnalysis, progress: analysisProgress, ready } = useAnalysis();

const title = computed(() => {
    return store.info.title || "-";
});
const desc = computed(() => {
    return store.info.desc || "-";
});
const progress = computed(() => {
    return downProgress.value * 0.2 + inflateProgress.value * 0.2 + analysisProgress.value * 0.6;
});

const getBattleInfo = async () => {
    let res;
    if (id) res = await getBattle(id);
    if (battle_id) res = await getJclBattle(battle_id);
    if (!res) {
        error.value = true;
        return;
    }
    const { code, data } = res.data ?? {};
    if (code === 0) {
        // 只管jcl相关的
        if (data.type == "jcl") {
            store.info = data;
            store.subject = "team";
            return true;
        } else {
            ElMessage.error("暂不支持非JCL文件的分析");
            router.push({ name: "home" });
        }
    } else {
        error.value = true;
    }
};

const init = async () => {
    // 没有分析结果，也没有id，也没有battle_id，跳转到首页
    if (!store.result && !id && !battle_id) {
        router.push({ name: "home" });
    }

    getBattleInfo()
        .then((next) => {
            if (!next) return new Promise((r) => r());
            return startDownload();
        })
        .then(() => {
            if (!store.raw) return new Promise((r) => r());
            startAnalysis();
        });
};

watchPostEffect(() => {
    if (!ready.value) return;
    const query = router.currentRoute.value.query;
    if (store.subject === "pvp") {
        router.push({ name: "pvp", query });
    } else {
        router.push({ name: "pve", query });
    }
});
onMounted(() => {
    init();
});
</script>

<style lang="less">
@import "@/assets/css/jcl/views/view.less";
</style>
