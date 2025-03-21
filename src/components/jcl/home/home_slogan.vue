<template>
    <div class="m-home-slogan">
        <div class="u-content">
            <div class="u-title">
                <p><span class="u-red">JCL</span> 多维度战斗分析</p>
                <p>即开即用 <span class="u-blue">无任何依赖</span></p>
            </div>
            <div class="u-subtitle">
                <p>涵盖团队、成员、首领全时间链行为分析。</p>
                <p>所有增益减益状态获取与技能释放详情具体展现。</p>
                <p>控制，小怪出现时机等完整复盘，重要细节不错过。</p>
            </div>
            <div class="u-buttons">
                <router-link class="u-button" to="/analysis">开启上帝的视角</router-link>
                <router-link class="u-button" to="/public">阅览战斗的数据</router-link>
            </div>
            <a class="u-tip" href="/collection/235" target="_blank">*需要了解更多的资讯来使用JCL</a>
        </div>
        <div class="u-icon">
            <video style="mix-blend-mode: lighten" class="u-video" :src="ani_url" autoplay loop muted></video>
        </div>
    </div>
</template>

<script>
import globalVars from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "home_slogan",
    props: [],
    components: {},
    data: function () {
        return {
            globalVars,
            ani_url: globalVars.__cdn + "video/jcl/battle_v4.2160.mp4",
        };
    },
    computed: {},
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/jcl/home/home_slogan.less";
</style>
