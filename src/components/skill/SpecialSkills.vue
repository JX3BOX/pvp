<template>
    <div class="m-special-skill">
        <div class="m-special-skill__header" @click="isCollapse = !isCollapse">
            <div class="u-special-title">
                <el-icon><Filter /></el-icon>技能分类

                <el-icon class="u-collapse-icon" :title="!isCollapse ? '展开' : '折叠'"
                    ><ArrowUp v-if="isCollapse" /><ArrowDown v-else
                /></el-icon>
            </div>
            <el-icon class="u-icon" v-if="isEditor" @click.stop="dialogFormVisible = true"><Setting /></el-icon>
        </div>

        <div class="m-special-skill__content" v-if="isCollapse">
            <el-tabs v-model="active">
                <el-tab-pane v-for="(item, index) in content" :label="item.name" :name="index" :key="index">
                    <div class="m-skill" v-for="skill in item.skills" :key="skill.SkillID">
                        <div class="u-skill">
                            <img class="u-skill-icon" :src="iconLink(skill.IconID)" :alt="skill.IconID" />
                            <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                        </div>
                        <div class="u-desc" v-html="nl2br(skill.desc)"></div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <SpecialSkillDrawer
            v-model="dialogFormVisible"
            :mount="mount"
            :client="client"
            :data="content"
            @update="onUpdate"
        />
    </div>
</template>

<script>
import { useStore } from "@/store";
import User from "@jx3box/jx3box-common/js/user.js";
import { getSpecialSkillList } from "@/service/raw";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

import SpecialSkillDrawer from "./SpecialSkillDrawer.vue";
export default {
    name: "SpecialSkill",
    components: {
        SpecialSkillDrawer,
    },
    props: {
        mount: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            dialogFormVisible: false,
            data: {},
            active: 0,

            isCollapse: false,
        };
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
        client() {
            return useStore().client;
        },
        content() {
            try {
                const content = JSON.parse(this.data.content);
                return content;
            } catch (e) {
                return [];
            }
        },
    },
    watch: {
        mount: {
            immediate: true,
            handler() {
                this.loadSkill();
            },
        },
    },
    methods: {
        iconLink(id) {
            return iconLink(id);
        },
        loadSkill() {
            getSpecialSkillList(this.mount, this.client).then((res) => {
                this.data = res.data.data;
            });
        },
        nl2br(str) {
            return str && str.replace(/\n/g, "<br />");
        },
        onUpdate() {
            this.loadSkill();
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill/special_skill.less";
</style>
