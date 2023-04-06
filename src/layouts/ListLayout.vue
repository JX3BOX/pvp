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
            <!-- <Info /> -->
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
                        <a href="https://jq.qq.com/?_wv=1027&k=mEl1e2hL">645370207</a>
                    </strong>
                </Side>
                <MiniRank />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
// import Info from "@/components/list/Info.vue";
import Nav from "@/components/list/ListNav.vue";
import Side from "@/components/list/RightSide.vue";
import Tabs from "@/components/Tabs.vue";
// import RankList from "@/components/RankList.vue";
import MiniRank from "@/components/MiniRank.vue";
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
    methods: {},
    components: {
        // Info,
        Nav,
        Side,
        Tabs,
        // RankList,
        MiniRank,
    },
};
</script>

<style lang="less">
@import "@/assets/css/list.less";
</style>

<style lang="less" scoped>
.c-main {
    .mt(48px);
}
</style>
