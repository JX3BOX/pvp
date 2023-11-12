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
            <template #title>
                <span>
                    {{ title }}
                </span>
            </template>
            <template #op-prepend>
                <AdminDirectMessage
                    class="u-admin-direct"
                    :user-id="user_id"
                    :sourceId="String(postId)"
                    :sourceType="postType"
                ></AdminDirectMessage>
            </template>
        </Breadcrumb>
        <LeftSidebar :uid="user_id">
            <Nav :id="id" class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="!hasRight">
            <slot></slot>
            <RightSidebar>
                <!-- <Side :id="id" class="m-extend" /> -->
                <PostTopic type="pvp" :id="postId" :post-banner="post_banner"></PostTopic>
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import { useStore } from "@/store";
// import Side from "@/components/single/single_side.vue";
import { getAppID } from "@jx3box/jx3box-common/js/utils";

import Nav from "@/components/single/SingleNav.vue";
import PostTopic from "@jx3box/jx3box-vue3-ui/src/single/PostTopic.vue";
import AdminDirectMessage from "@jx3box/jx3box-vue3-ui/src/bread/AdminDirectMessage.vue";
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
        user_id() {
            return useStore().userId;
        },
        postId() {
            return useStore().postId;
        },
        title() {
            return useStore().post?.title || document.title;
        },
        post_banner() {
            return useStore().post?.post_banner || "";
        },
        postType() {
            return useStore().post?.post_type || "";
        },
    },
    methods: {},
    components: {
        Nav,
        PostTopic,
        AdminDirectMessage,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/list.less";
.c-main {
    .mt(48px);
    padding: 0;
}
.u-admin-direct {
    .pr;
    top: -2px;
    margin-right: 12px;
}
</style>
