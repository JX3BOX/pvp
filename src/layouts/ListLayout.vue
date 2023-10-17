<template>
    <div>
        <Header></Header>
        <Breadcrumb
            name="竞技专栏"
            slug="pvp"
            root="/pvp"
            :publishEnable="true"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
            <Info />
        </Breadcrumb>
        <LeftSidebar>
            <Nav class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="!hasRight">
            <div class="m-main">
                <tabs />
                <slot></slot>
            </div>
            <RightSidebar>
                <Side class="m-extend">
                    <em>PVP交流群</em> :
                    <strong>
                        <a @click="onQQClick(645370207)">645370207</a>
                    </strong>
                </Side>
                <!-- <SkillChange></SkillChange> -->
                <MiniRank v-if="client === 'std'" />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Info from "@/components/list/Info.vue";
import Nav from "@/components/list/ListNav.vue";
import Side from "@/components/list/RightSide.vue";
import Tabs from "@/components/Tabs.vue";
import MiniRank from "@/components/MiniRank.vue";
// import SkillChange from "@/components/SkillChange.vue";
import { useStore } from "@/store";
export default {
    name: "App",
    props: {
        hasRight: {
            type: Boolean,
            default: true,
        },
    },
    data: function () {
        return {};
    },
    computed: {
        client() {
            return useStore().client;
        },
    },
    methods: {
        onQQClick(qq) {
            navigator.clipboard.writeText(qq).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: "内容：" + qq,
                    type: "success",
                });
            });
        },
    },
    components: {
        Info,
        Nav,
        Side,
        Tabs,
        // RankList,
        MiniRank,
        // SkillChange,
    },
};
</script>

<style lang="less">
@import "@/assets/css/list.less";
</style>

<style lang="less" scoped>
.c-main {
    .mt(48px);
    padding: 0;
    background-color: #fff;
    .m-extend {
        .pointer;
    }
}
</style>
