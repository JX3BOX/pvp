<template>
    <div class="m-skill-change">
        <div class="m-skill-change__header">
            <h3 class="m-title">
                <span class="m-title__text"
                    ><img class="u-icon" svg-inline src="@/assets/img/side/history.svg" />技改历史</span
                >
                <el-icon v-if="isEditor" class="u-edit-icon" @click="onSettingIconClick"><Setting /></el-icon>
            </h3>
        </div>
        <ul class="m-news-list m-sideblock-list" v-if="showData">
            <li v-for="(item, i) in showData" :key="i">
                <em v-if="item.time">{{ dateFormat(item.time) }}</em>
                <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.label }}</a>
            </li>
        </ul>

        <el-dialog v-model="showDialog" title="管理技改历史" append-to-body width="700px" class="m-skill-change-pop">
            <div class="m-content-item m-content-header">
                <span class="u-rank-icon"></span>
                <span class="u-label">标题</span>
                <span class="u-label">链接</span>
                <span class="u-label">日期</span>
                <span class="u-rank-icon"></span>
            </div>
            <draggable v-model="menus" item-key="index" animation="300" handle=".u-move-icon">
                <template #item="{ element, index }">
                    <div class="m-content-item">
                        <el-icon class="u-move-icon"><Rank /></el-icon>
                        <el-input v-model="element.label"></el-input>
                        <el-input v-model="element.link"></el-input>
                        <el-input v-model="element.icon"></el-input>
                        <el-icon @click="onRemove(index)" class="u-remove-icon"><Delete /></el-icon>
                    </div>
                </template>
            </draggable>
            <el-button icon="Plus" class="u-add-btn" @click="onAdd"></el-button>

            <template #footer>
                <div class="m-footer">
                    <el-button type="primary" @click="onConfirm">保存</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";
import { getMenu, updateMenu } from "@/service/raw.js";
import dateFormat from "@/assets/js/dateFormat.js";
import draggable from "vuedraggable";
import cloneDeep from "lodash/cloneDeep";

export default {
    name: "SkillChange",
    components: {
        draggable,
    },
    data() {
        return {
            isEditor: User.isEditor(),
            data: [],

            // dialog
            showDialog: false,
            menus: [],
        };
    },
    computed: {
        showData() {
            return this.data.map((item) => {
                item.time = new Date(item.icon);
                item.type = "skill_change";
                return item;
            });
        },
    },
    mounted() {
        this.loadSkillChangeData();
    },
    methods: {
        dateFormat(val) {
            return dateFormat(val, "-");
        },
        onSettingIconClick() {
            this.showDialog = true;
        },
        loadSkillChangeData() {
            getMenu("bps_skill_change").then((res) => {
                this.data = cloneDeep(res);
                this.menus = cloneDeep(res);
            });
        },
        onConfirm() {
            // 去除空数据
            const data = this.menus.filter((item) => {
                return item.label && item.link && item.icon;
            });
            updateMenu("bps_skill_change", { menus: data }).then(() => {
                this.showDialog = false;
                this.loadSkillChangeData();
            });
        },
        onAdd() {
            this.menus.push({
                label: "",
                link: "",
                icon: "",
                color: "",
            });
        },
        onRemove(index) {
            this.$confirm("确定删除该条数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.menus.splice(index, 1);
                })
                .catch(() => {});
        },
        onCancel() {
            this.showDialog = false;
            this.menus = cloneDeep(this.data);
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill_change.less";
</style>
