<template>
    <div class="p-dark-layout">
        <Header></Header>
        <Breadcrumb
            name="绝境战场"
            slug="pvp"
            root="/pvp"
            :publishEnable="true"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
            class="m-dark-breadcrumb"
        >
            <template v-if="isEditor" v-slot:op-append>
                <el-button class="u-admin-btn" type="primary" icon="Setting" @click="toggleReview">管理</el-button>
            </template>
        </Breadcrumb>
        <LeftSidebar class="m-dark-sidebar" :open="isOpen">
            <CJNav class="m-nav" />
        </LeftSidebar>
        <Main class="m-dark-main" :withoutLeft="!isOpen">
            <div class="m-main">
                <slot></slot>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import CJNav from "@/components/cj/CJNav.vue";
import { useStore } from "@/store";
const $store = useStore();
import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "App",
    data: function () {
        return {
            isOpen: true,
        };
    },
    components: {
        CJNav,
    },
    computed: {
        client() {
            return useStore().client;
        },
        isEditor() {
            return User.isEditor();
        },
    },
    methods: {
        toggleReview() {
            $store.reviewVisible = !$store.reviewVisible;
        },
    },
    mounted() {
        if (window.innerWidth < 1024) {
            this.isOpen = false;
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dark_layout.less";
</style>
