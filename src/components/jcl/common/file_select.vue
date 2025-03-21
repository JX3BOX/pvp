<template>
    <el-dialog
        v-model="dialogVisible"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
        :align-center="true"
        :lock-scroll="false"
        :destroy-on-close="true"
        class="m-file-select"
    >
        <div class="m-dialog-body">
            <el-button class="u-close" link @click="dialogVisible = false">×</el-button>
            <img class="u-bg" :src="icons[subject]" alt="" draggable="false" />
            <!-- 上传组件 -->
            <el-upload
                class="u-upload"
                drag
                accept=".jcl"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="fileChange"
                :disabled="status == statusCode.loading"
                :class="{ 'is-fill': store.file.name }"
                ref="upload"
            >
                <upload-filled class="u-upload-icon" />
                <div v-if="!store.file.name" class="u-select-file">选择或拖拽文件</div>
                <div v-else class="u-file-info">
                    <div class="u-upload-filename">
                        <span>{{ store.file.name }}</span>
                        <span class="u-file-clear" @click.stop="store.file = ''"
                            ><el-icon><Close></Close></el-icon
                        ></span>
                    </div>
                    <!-- <div class="u-filemeta">{{ fileType }}</div> -->
                    <div class="u-filemeta">
                        文件大小: <b>{{ fileSize }}</b>
                    </div>
                </div>
                <template #tip>
                    <div class="u-upload-help">
                        <el-icon :size="16"><info-filled /></el-icon>
                        <span>仅支持<b>*.jcl</b>文件</span>
                        <a href="/tool/22456" target="_blank">获取指南</a>
                    </div>
                </template>
            </el-upload>
            <div class="u-buttons" v-if="status != statusCode.upload">
                <el-button
                    class="u-start"
                    :disabled="[statusCode.upload, statusCode.ready].includes(status)"
                    :loading="status == statusCode.loading || fileProcessing"
                    @click="start"
                >
                    <span v-if="status === statusCode.loading">分析中</span>
                    <span v-else-if="fileProcessing">文件处理中</span>
                    <span v-else>开始分析</span>
                </el-button>
                <el-button
                    class="u-view"
                    :class="{ ready: status == statusCode.ready }"
                    :disabled="status != statusCode.ready"
                    @click="view"
                    >查看分析</el-button
                >
            </div>
            <el-progress :show-text="false" :percentage="progress" :stroke-width="10" />
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { useAnalysis } from "@/utils/jcl/uses/useAnalysis";
import { useStore } from "@/pages/jcl/store";
import { ElMessage } from "element-plus";
import FileWorker from "@/utils/jcl/workers/file.worker.js";

const store = useStore();
const router = useRouter();
// data
const dialogVisible = ref(false);
const { subject } = toRefs(store);
const icons = {
    team: require("@/assets/img/jcl/home/action.svg"),
    boss: require("@/assets/img/jcl/home/boss.svg"),
    pvp: require("@/assets/img/jcl/home/pvp.svg"),
};
const statusCode = {
    upload: 0,
    default: 1,
    loading: 2,
    ready: 3,
};
const upload = ref(null);
const { startAnalysis, progress, ready } = useAnalysis();

const status = computed(() => {
    // 害没选文件
    if (!store.file.name) return statusCode.upload;
    // 选了文件，还没开始分析
    if (progress.value === 0) return statusCode.default;
    // 正在分析
    if (!ready.value || fileProcessing.value) return statusCode.loading;
    // 分析完毕
    return statusCode.ready;
});
const fileSize = computed(() => {
    return store.file.size > 1024 * 1024
        ? (store.file.size / 1024 / 1024).toFixed(2) + " M"
        : (store.file.size / 1024).toFixed(2) + " K";
});

// event
const fileChange = (file) => {
    store.file = file.raw;
    progress.value = 0;
    ready.value = false;
};
const fileProcessing = ref(false);
const start = () => {
    if (!store.file.name.endsWith(".jcl")) {
        ElMessage.error("仅支持JCL文件");
        return;
    }
    store.result = {};
    store.info = {};
    fileProcessing.value = true;
    new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.readAsArrayBuffer(store.file);
    })
        .then((buffer) => {
            const fileWorker = new FileWorker();
            return new Promise((resolve) => {
                fileWorker.onmessage = (e) => {
                    resolve(e.data.raw);
                };
                fileWorker.postMessage({ buffer });
            });
        })
        .then((raw) => {
            store.raw = raw;
            startAnalysis();
            fileProcessing.value = false;
        });
};
const view = () => {
    if (subject.value === "pvp") {
        router.push({ name: "pvp" });
    } else {
        router.push({ name: "pve" });
    }
};

// methods
const open = (sub) => {
    dialogVisible.value = true;
    subject.value = sub;
};
defineExpose({
    open,
});
</script>

<style lang="less">
@import "@/assets/css/jcl/common/file_select.less";
</style>
