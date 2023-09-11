<template>
    <div class="u-item">
        <!-- Banner -->
        <a class="u-banner" :href="postLink(item.ID)" :target="target"><img :src="getBanner(item)" :key="item.ID" /></a>

        <!-- 标题 -->
        <h2 class="u-post" :class="{ isSticky: item.sticky }">
            <!-- 图标 -->
            <img class="u-icon" svg-inline src="@/assets/img/post.svg" />

            <!-- 标题文字 -->
            <a class="u-title" :style="showHighlight(item.color)" :href="postLink(item.ID)" :target="target">{{
                item.post_title || "无标题"
            }}</a>

            <!-- 角标 -->
            <span class="u-marks" v-if="item.mark && item.mark.length">
                <i v-for="mark in item.mark" class="u-mark" :key="mark">{{ showMark(mark) }}</i>
            </span>
        </h2>

        <!-- 字段 -->
        <div class="u-content u-desc">
            <!-- {{ item.post_excerpt || item.post_title || "这个作者很懒,什么都没有留下" }} -->
            <div class="u-metalist u-boss-list" v-if="item.post_meta && item.post_meta.fb_boss">
                <strong>首领</strong>
                <em>
                    <b v-for="(c, i) in format(item, 'fb_boss')" :key="i" @click="addTopic(c)">{{ c }}</b>
                </em>
            </div>

            <div class="u-metalist u-mode-list c-jx3fb-mode" v-if="item.post_meta && item.post_meta.fb_level">
                <strong>模式</strong>
                <em>{{ format(item, "fb_level").join("、") }}</em>
            </div>
        </div>

        <!-- 作者 -->
        <div class="u-misc">
            <img class="u-author-avatar" :src="showAvatar(item.author_info)" :alt="showNickname(item.author_info)" />
            <a class="u-author-name" :href="authorLink(item.post_author)" target="_blank">{{
                showNickname(item.author_info)
            }}</a>
            <span class="u-date">
                Updated on
                <time v-if="order == 'update'">{{ dateFormat(item.post_modified) }}</time>
                <time v-else>{{ dateFormat(item.post_date) }}</time>
            </span>
        </div>
    </div>
</template>

<script>
import { showAvatar, authorLink, showBanner, buildTarget } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { cms as mark_map } from "@jx3box/jx3box-common/data/mark.json";
import { showDate } from "@jx3box/jx3box-common/js/moment.js";
import { __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "ListItem",
    props: ["item", "order", "caller"],
    components: {},
    data: function () {
        return {
            target: buildTarget(),
        };
    },
    computed: {
        client() {
            return this.item?.client;
        },
        rootLink() {
            return this.client !== "std" ? __OriginRoot : __Root;
        },
    },
    watch: {},
    methods: {
        getBanner: function (item) {
            if (item.post_banner) {
                return showBanner(item.post_banner);
            } else {
                return __imgPath + "image/fb_map_thumbnail/null.png";
            }
        },
        format: function (item, key) {
            let val = item?.post_meta?.[key];
            if (val && val.length) {
                return val;
            } else {
                return ["-"];
            }
        },
        addTopic(c) {
            this.$router.push({
                query: {
                    topic: c,
                },
            });
        },
        postLink(val) {
            return `${this.rootLink}bps/${val}`;
        },
        authorLink,
        showHighlight(val) {
            return val ? `color:${val};font-weight:600;` : "";
        },
        showMark: function (val) {
            return mark_map[val] || val;
        },
        showAvatar: function (userinfo) {
            return showAvatar(userinfo?.user_avatar);
        },
        showNickname: function (userinfo) {
            return userinfo?.display_name || "匿名";
        },
        dateFormat: function (gmt) {
            return showDate(new Date(gmt));
        },
    },
};
</script>
