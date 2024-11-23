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
            <template #logo>
                <img svg-inline :src="logo" />
            </template>
            <Info />
        </Breadcrumb>
        <LeftSidebar>
            <!-- <Nav class="m-nav" /> -->
        </LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <tabs />
                <slot></slot>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
const JX3BOX = require("@jx3box/jx3box-common/data/jx3box.json");
export default {
    name: "App",
    components: {
        // Info,
        // Nav,
        Tabs,
    },
    props: [],
    data: function () {
        return {
            logo: JX3BOX.__cdn + "logo/logo-light/bps.svg",
        };
    },
    methods: {},
};
</script>

<style lang="less">
// @import "~@/assets/css/list.less";
</style>
