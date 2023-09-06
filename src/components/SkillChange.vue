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
        <ul class="m-news-list m-sideblock-list" v-if="data">
            <li v-for="(item, i) in data" :key="i">
                <em v-if="item.time">{{ dateFormat(item.time) }}</em>
                <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            </li>
        </ul>

        <el-dialog v-model="showDialog" title="管理技改历史" append-to-body width="700px">
            <draggable v-model="menus" item-key="id" animation="300" handle=".u-move-icon">
                <template #item="{ element }">
                    <div class="m-content-item">
                        <el-icon class="u-move-icon"><Rank /></el-icon>
                        <el-input v-model="element.label"></el-input>
                        <el-input v-model="element.link"></el-input>
                        <el-input v-model="element.icon"></el-input>
                        <el-input v-model="element.color"></el-input>
                    </div>
                </template>
            </draggable>
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
                this.data = res.map((item) => {
                    item.title = item.label;
                    item.url = item.link;
                    item.time = new Date(item.icon);
                    item.type = "skill_change";
                    return item;
                });

                this.menus = cloneDeep(res);
            });
        },
        onConfirm() {
            updateMenu("bps_skill_change", this.menus).then(() => {
                this.showDialog = false;
                this.loadSkillChangeData();
            });
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill_change.less";
</style>
