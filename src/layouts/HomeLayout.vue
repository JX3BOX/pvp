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
// import Info from "@/components/list/Info.vue";
// import Nav from "@/components/list/list_nav.vue";
// import Header from '@jx3box/jx3box-vue3-ui/src/Header.vue';
import Tabs from "@/components/Tabs.vue";
export default {
    name: "App",
    components: {
        // Info,
        // Nav,
        Tabs,
    },
    props: [],
    data: function () {
        return {};
    },
    methods: {},
};
</script>

<style lang="less">
// @import "~@/assets/css/list.less";
</style>
