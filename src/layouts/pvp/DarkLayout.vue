<template>
    <div class="p-dark-layout" :class="'p-' + pageName">
        <Header></Header>
        <Breadcrumb
            name="竞技专栏"
            slug="pvp"
            root="/pvp"
            :publishEnable="false"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="false"
            class="m-dark-breadcrumb"
        >
            <template #logo>
                <img svg-inline :src="logo" />
            </template>
            <span class="u-breadcrumb-title"
                ><el-icon><ArrowRight /></el-icon> 绝境战场</span
            >
            <!-- <template v-if="isEditor" v-slot:op-append>
                <el-button class="u-admin-btn" type="primary" icon="Setting" @click="toggleReview">管理</el-button>
            </template> -->
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
import CJNav from "@/components/pvp/cj/CJNav.vue";
import { useStore } from "@/pages/pvp/store";
const $store = useStore();
import User from "@jx3box/jx3box-common/js/user.js";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
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
        pageName() {
            return this.$route.name;
        },
        logo() {
            return JX3BOX.__cdn + "logo/logo-light/" + "pvp.svg";
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

        // 设置body背景色为黑色
        document.body.style.backgroundColor = "#1d2530";
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pvp/dark_layout.less";
</style>
