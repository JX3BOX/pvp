<template>
    <el-dialog
        v-model="dialogVisible"
        width="50%"
        append-to-body
        class="m-edit-dialog"
        :close-on-click-modal="false"
        :destroy-on-close="true"
    >
        <template #header>
            <p class="u-title">{{ item.title }}</p>
        </template>
        <el-form label-width="100px" :model="item">
            <el-form-item label="标题">
                <el-input v-model="item.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="item.desc" placeholder="请输入描述" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="阅读权限">
                <el-radio-group v-model="item.visible">
                    <el-radio :value="0">公开</el-radio>
                    <el-radio :value="1">私有</el-radio>
                    <el-radio :value="2">仅亲友可见</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="m-dialog-footer">
                <el-button link @click="dialogVisible = false"> 取消 </el-button>
                <el-button type="primary" @click="submit" :loading="loading"> 应用 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { updateBattle } from "@/service/jcl/team";

import { ElMessage } from "element-plus";
import { ref } from "vue";
import { pick, cloneDeep } from "lodash-es";

const emits = defineEmits(["updated"]);
const loading = ref(false);
const dialogVisible = ref(false);
const item = ref({});

const open = (data) => {
    dialogVisible.value = true;
    item.value = cloneDeep(data);
};
const submit = () => {
    const body = pick(item.value, ["id", "title", "desc", "visible"]);
    loading.value = true;
    updateBattle(item.value.id, body)
        .then(() => {
            dialogVisible.value = false;
            loading.value = false;
            item.value = {};
            ElMessage.success("编辑成功");
            emits("updated");
        })
        .catch(() => {
            loading.value = false;
            ElMessage.error("数据更新失败，请稍后再试");
        });
};
defineExpose({ open });
</script>

<style lang="less">
.m-edit-dialog {
    color: #a798e6;

    .u-title {
        .bold;
        .fz(18px);
    }

    .m-dialog-footer {
        .el-button {
            width: 120px;
        }
    }
}
</style>
