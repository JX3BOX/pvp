<template>
    <div>
        <Header></Header>
        <Breadcrumb :name="title" :slug="slug" :root="root" :feedbackEnable="true" :crumbEnable="false">
            <template #logo>
                <img svg-inline :src="logo" />
            </template>
        </Breadcrumb>
        <Main :class="className" :withoutRight="true" :withoutLeft="true">
            <slot></slot>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import app from "../assets/data/app.json";
export default {
    name: "AppLayout",
    props: {
        slug: {
            type: String,
            default: "",
        },
        icon: {
            type: String,
            default: "",
        },
        className: {
            type: String,
            default: "",
        },
    },
    computed: {
        root() {
            return `/pvp/${this.slug}`;
        },
        logo() {
            const key = this.icon || this.slug;
            return JX3BOX.__imgPath + "image/box/" + key + ".svg";
        },
        title() {
            return app[this.slug]?.title || "";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/list.less";
</style>
