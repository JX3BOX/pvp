<template>
    <div class="m-subject-list">
        <div class="m-cards">
            <div
                v-for="(item, index) in types"
                :key="index"
                class="u-card"
                @click="open(item)"
                :class="{ 'is-disabled': !item.enable }"
            >
                <img class="u-card__bg" :src="item.icon" draggable="false" />
                <div class="u-card__inner">
                    <img class="u-icon" svg-inline :src="item.icon" draggable="false" />
                    <p class="u-title">{{ item.title }}</p>
                    <p class="u-tips">{{ item.tips }}</p>
                    <p class="u-tips">*仅支持后缀为 .jcl 的数据</p>
                </div>
            </div>
        </div>
        <div class="m-tips">
            <div class="m-left">
                <p class="u-title">了解更多信息</p>
                <p class="u-subTitle">
                    来使用战斗分析
                    <span class="u-arrow"></span>
                </p>
            </div>
            <div class="m-right">
                <p>【PVE · 团队统计分析】团队/首领/个人的伤害、治疗、承疗、承伤等统计！</p>
                <!--<p>【PVE · 首领行为分析】智能分析首领时间轴、涵盖全小怪神出鬼没与伤害、开荒做数据更轻松！</p> -->
                <p>【PVE · 团队行为分析】团队每个成员全时间链行为分析，所有buff/debuff获取与技能释放详情一览无余！</p>
                <p>【PVP · 竞技多维分析】完整复盘，重要细节不错过，好师傅带徒儿神器，更有疑似外挂检测！</p>
                <p>
                    <a class="u-link" href="/collection/235" target="_blank">《战斗分析文档合集》</a>
                    .
                    <a class="u-link" href="/tool/22456" target="_blank"> 《茗伊JCL战斗日志获取指南》</a>
                </p>
            </div>
        </div>
        <file-select ref="fileSelect"></file-select>
    </div>
</template>

<script>
import FileSelect from "@/components/jcl/common/file_select";
export default {
    name: "SubjectList",
    components: {
        FileSelect,
    },
    data: () => ({
        current: "team",
        types: [
            {
                icon: require("@/assets/img/jcl/home/action.svg"),
                title: "团队/首领行为分析",
                tips: "团队成员/首领全时间链行为分析、动作细节",
                subject: "team",
                enable: true,
            },
            // {
            //     icon: require("@/assets/img/jcl/home/boss.svg"),
            //     title: "首领行为分析",
            //     tips: "首领与小怪技能类型/数量/伤害/时间轴等分析",
            //     subject: "boss",
            //     enable: false,
            // },
            {
                icon: require("@/assets/img/jcl/home/pvp.svg"),
                title: "竞技多维分析",
                tips: "敌我玩家全时间链行为分析、重要节点标注",
                subject: "pvp",
                enable: false,
            },
        ],
    }),
    mounted() {},
    methods: {
        open(item) {
            if (!item.enable) return;
            this.$refs.fileSelect.open(item.subject);
        },
    },
};
</script>

<style lang="less" scoped>
@import "@/assets/css/jcl/home/subject_list.less";
</style>
