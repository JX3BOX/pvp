<template>
    <div>
        <Header></Header>
        <Breadcrumb
            name="绝境战场"
            slug="pvp"
            root="/pvp"
            :publishEnable="true"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
            <template v-if="isEditor" v-slot:op-append>
                <el-button class="u-admin-btn" type="primary" icon="Setting" @click="toggleReview">管理</el-button>
            </template>
            <Info />
        </Breadcrumb>
        <LeftSidebar>
            <Nav class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="!hasRight">
            <div class="m-main">
                <slot></slot>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Info from "@/components/list/Info.vue";
import Nav from "@/components/list/ListNav.vue";
import { useStore } from "@/store";
const $store = useStore();
import User from "@jx3box/jx3box-common/js/user.js";
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
        isEditor() {
            return User.isEditor();
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
        toggleReview() {
            $store.reviewVisible = !$store.reviewVisible;
        },
    },
    components: {
        Info,
        Nav,
    },
};
</script>

<style lang="less" scoped>
.u-admin-btn {
    margin-top: -2px;
}
.c-main {
    .mt(48px);
    padding: 0;
    .mr(0);
    .m-extend {
        .pointer;
    }
}
</style>
