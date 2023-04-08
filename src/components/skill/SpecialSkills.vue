<template>
    <div class="m-special-skill">
        <div class="m-special-skill__header">
            <div class="u-special-title">特殊技能</div>
            <el-icon class="u-icon" v-if="isEditor" @click="dialogFormVisible = true"><Setting /></el-icon>
        </div>

        <SpecialSkillDrawer v-model="dialogFormVisible" :mount="mount" :client="client" />
    </div>
</template>

<script>
import { useStore } from "@/store";
import User from "@jx3box/jx3box-common/js/user.js";
import { getSpecialSkillList } from "@/service/raw";

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
        };
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
        client() {
            return useStore().client;
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
        loadSkill() {
            getSpecialSkillList(this.mount, this.client).then((res) => {
                this.data = res.data.data;
            });
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill/special_skill.less";
</style>
