<template>
    <div class="m-cj-extra">
        <CJIntro class="m-intro-tabs"></CJIntro>
        <el-tabs class="m-tabs m-extra-tabs" v-model="view" @tab-click="handleClick">
            <el-tab-pane label="我的标点" name="points">
                <template #label>
                    <el-icon><Location /></el-icon>
                    <b>我的标点</b>
                </template>
                <CJPoints v-if="view === 'points'"></CJPoints>
            </el-tab-pane>
            <el-tab-pane v-if="client === 'origin'" label="技能查询" name="skill">
                <template #label>
                    <el-icon><Files /></el-icon>
                    <b>技能查询</b>
                </template>
                <CJSkill v-if="view === 'skill'"></CJSkill>
            </el-tab-pane>
            <el-tab-pane label="攻略" name="strategy">
                <template #label>
                    <el-icon><Collection /></el-icon>
                    <b>吃鸡攻略</b>
                </template>
                <CJStrategy v-if="view === 'strategy'"></CJStrategy>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { useStore } from "@/store";
import CJIntro from "./CJIntro.vue";
import CJStrategy from "./CJStrategy.vue";
import CJSkill from "./CJSkill.vue";
import CJPoints from "./CJPoints.vue";
export default {
    name: "CJExtra",
    components: {
        CJStrategy,
        CJSkill,
        CJIntro,
        CJPoints,
    },
    data() {
        return {
            view: "points",
        };
    },
    computed: {
        client() {
            return useStore().client;
        },
    },
    methods: {
        handleClick() {},
    },
    mounted() {
        // if (this.client === "origin") {
        //     this.view = "skill";
        // }
    },
};
</script>

<style lang="less">
.m-cj-extra {
    @extraW: 536px;
    @extraH: 826px;
    @tabH: 40px;
    @introH: 150px;
    width: @extraW;
    height: @extraH;
    overflow-x: hidden;
    .m-intro-tabs {
        width: @extraW;
        .el-tabs__content {
            height: @introH;
            overflow-y: auto;
            .scrollbar(6px);
        }
    }
    .m-extra-tabs {
        width: @extraW;
        .el-tabs__content {
            max-height: calc(@extraH - @introH - @tabH * 2 - 30px);
            overflow-y: auto;
            .scrollbar(6px);
        }
    }
}
</style>
