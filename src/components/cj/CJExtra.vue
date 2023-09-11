<template>
    <div class="m-cj-extra">
        <el-tabs class="m-tabs m-extra-tabs" v-model="view" @tab-click="handleClick">
            <el-tab-pane label="攻略" name="strategy">
                <template #label>
                    <el-icon><Collection /></el-icon>
                    <b>攻略</b>
                </template>
                <CJStrategy v-if="view === 'strategy'"></CJStrategy>
            </el-tab-pane>
            <el-tab-pane v-if="client === 'origin'" label="技能查询" name="skill">
                <template #label>
                    <el-icon><Collection /></el-icon>
                    <b>技能查询</b>
                </template>
                <CJSkill v-if="view === 'skill'"></CJSkill>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { useStore } from "@/store";
import CJStrategy from "./CJStrategy.vue";
import CJSkill from "./CJSkill.vue";
export default {
    name: "CJExtra",
    emits: ["scroll"],
    components: {
        CJStrategy,
        CJSkill,
    },
    data() {
        return {
            view: "strategy",
        };
    },
    computed: {
        client() {
            return useStore().client;
        },
    },
    methods: {
        handleClick() {
            this.$emit("scroll");
        },
    },
};
</script>

<style lang="less"></style>
