<template>
    <div class="c-pvp-single">
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
                <AdminDrop v-if="isTeammate" :post="post" :user-id="user_id" :showMove="true" />
            </template>
        </Breadcrumb>
        <LeftSidebar :uid="user_id">
            <Nav :id="id" class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="!hasRight">
            <slot></slot>
            <RightSidebar>
                <!-- <Side :id="id" class="m-extend" /> -->
                <PostTopic class="c-pvp-post__topic" type="pvp" :id="postId" :post-banner="post_banner"></PostTopic>
                <div id="directory" class="m-pvp-directory"></div>
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
import AdminDrop from "@jx3box/jx3box-vue3-ui/src/bread/AdminDrop.vue";
import User from "@jx3box/jx3box-common/js/user";
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
        isTeammate() {
            return User.isTeammate();
        },
        post() {
            return useStore().post;
        },
    },
    methods: {},
    components: {
        Nav,
        PostTopic,
        AdminDrop,
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
.c-pvp-single {
    .u-feedback {
        margin-left: 0 !important;
    }

    .u-op-public,
    .c-admin-drop__button {
        background: #0366d6 !important;
    }
}
.m-pvp-directory {
    margin: 15px;
}

@media screen and (max-width: @phone) {
    .c-pvp-post__topic {
        .c-topic-bg {
            width: 100% !important;
        }
    }
}
</style>
