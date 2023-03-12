<template>
    <div>
        <Header></Header>
        <Breadcrumb
            name="竞技专栏"
            slug="pvp"
            root="/pvp"
            :publishEnable="true"
            :adminEnable="true"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
        </Breadcrumb>
        <LeftSidebar :uid="user_id">
            <Nav :id="id" class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="!hasRight">
            <slot></slot>
            <RightSidebar>
                <!-- <Side :id="id" class="m-extend" /> -->
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
// import Nav from "@/components/single/single_nav.vue";
// import Side from "@/components/single/single_side.vue";
import { getAppID } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "SingleLayout",
    props: {
        hasRight: {
            type: Boolean,
            default: true,
        },
    },
    data: function () {
        return {
            id: getAppID(),
        };
    },
    computed: {
        user_id: function () {
            return this.$store.state.user_id;
        },
    },
    methods: {},
    components: {
        // Nav,
        // Side,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/list.less";
</style>
