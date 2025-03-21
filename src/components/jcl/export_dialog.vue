<template>
    <el-dialog
        v-model="dialogVisible"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
        :align-center="true"
        :lock-scroll="false"
        :destroy-on-close="true"
        class="m-export-dialog"
    >
        <div class="m-dialog-body">
            <el-button class="u-close" link @click="dialogVisible = false">×</el-button>
            <!-- 标题 -->
            <div class="u-title">导出为CSV</div>
            <!-- 进度条 -->
            <el-progress :show-text="false" :percentage="progress" :stroke-width="10" />
            <div class="u-progress-desc" v-for="(item, key) in statusMap" :key="key">
                <el-icon><component :is="statusIcon[item.status]"></component></el-icon>
                {{ item.desc }}
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { Loading, CircleCheckFilled, CircleCloseFilled, Checked } from "@element-plus/icons-vue";
import { ref, toRefs } from "vue";
import { useStore } from "@/pages/jcl/store";
import { usePve } from "@/pages/jcl/store_pve";
import { saveAs } from "file-saver";
import { cloneDeep } from "lodash";

const store = useStore();
const { logFilter } = toRefs(usePve());

const dialogVisible = ref(false);
const statusMap = ref([]);
const progress = ref(0);
const statusIcon = {
    0: Loading,
    1: CircleCheckFilled,
    2: CircleCloseFilled,
    3: Checked,
};

// methods
const clearProgress = () => {
    statusMap.value = [];
    progress.value = 0;
};
const updateStatus = (desc, status, processing) => {
    let ready = statusMap.value.find((item) => item.desc === desc);
    if (processing) progress.value = Math.floor(processing);
    if (ready) ready.status = status;
    else statusMap.value.push({ desc, status });
};
const start = () => {
    clearProgress();
    const filename = (store.file ? store.file.name : store.info?.title) + "-JX3BOX-Export.csv";
    const worker = store.worker;
    worker.onmessage = (e) => {
        const { msg, type, data } = e.data;
        if (type === "statusUpdated") {
            const { desc, status, processing } = data;
            updateStatus(desc, status, processing);
        } else if (msg === "exportResult") {
            updateStatus("构建完成，下载马上开始", 1, 99);
            const blob = new Blob([data], { type: "application/octet-stream" });
            saveAs(blob, filename);
            updateStatus("导出成功", 3, 100);
        }
    };
    worker.postMessage({ action: "export", data: { logFilter: cloneDeep(logFilter.value) } });
    updateStatus("整理原始数据", 0, 0);
};

const open = () => {
    dialogVisible.value = true;
    start();
};
defineExpose({
    open,
});
</script>

<style lang="less">
.m-export-dialog {
    .size(1000px, 400px);
    border-radius: 8px;
    overflow: hidden;
    background: #303133;
    --el-text-color-regular: #fff;
    --el-color-primary: #d3efff;
    --el-border-color-lighter: #000;
    .el-dialog__body {
        padding: 0;
    }
    .m-dialog-body {
        .pr;
        .flex-center;
        flex-direction: column;
        padding-top: 24px;

        .u-close {
            .flex-center;
            .pa;
            .size(45px, 45px);
            .fz(32px);
            right: 30px;
            top: 4px;
            background: #535353;
            color: #fff;
            border-radius: 100%;
            &:hover,
            &:active,
            &:focus {
                background: #d3efff;
                border-color: #d3efff;
                color: #000;
            }
        }

        .u-title {
            .fz(24px, 32px);
            .mb(43px);
            .bold;
        }

        .el-progress {
            .mb(40px);
            .mt(10px);
            width: 100%;
            height: 10px;
            .el-progress-bar__outer,
            .el-progress-bar__inner {
                border-radius: 0;
            }
        }

        .u-progress-desc {
            .flex-center;
            .fz(18, 22px);
            .bold;
            .mb(8px);
            gap: 8px;
        }
    }
}
</style>
