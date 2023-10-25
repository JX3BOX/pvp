<template>
    <div class="u-item">
        <!-- 标题 -->
        <h2 class="u-post" :class="{ isSticky: item.sticky }">
            <!-- 图标 -->
            <!-- <img class="u-icon" svg-inline src="@/assets/img/post.svg" /> -->

            <!-- 标题文字 -->
            <a class="u-author" :href="authorLink(item.post_author)" target="_blank">
                <img
                    class="u-author-avatar"
                    :src="showAvatar(item.author_info)"
                    :alt="showNickname(item.author_info)"
                    @error="setDefaultAvatar"
                />
                <!-- <span class="u-author-name">{{ showNickname(item.author_info) }}</span> -->
            </a>
            <a class="u-title" :style="showHighlight(item.color)" :href="postLink(item.ID)" :target="target">
                <i class="u-zlp">{{ item.zlp || "未知版本" }}</i>
                {{ item.post_title || "无标题" }}</a
            >
        </h2>

        <!-- 作者 -->
        <div class="u-misc">
            <span class="u-date">
                <el-icon><Clock /></el-icon>
                <time v-if="order == 'update'">{{ dateFormat(item.post_modified) }}</time>
                <time v-else>{{ dateFormat(item.post_date) }}</time>
            </span>
        </div>
    </div>
</template>

<script>
import { showAvatar, authorLink, showBanner, buildTarget, getLink } from "@jx3box/jx3box-common/js/utils";
import mark_map from "@jx3box/jx3box-common/data/mark.json";
import { showDate } from "@jx3box/jx3box-common/js/moment.js";
import jx3boxData from "@jx3box/jx3box-common/data/jx3box.json";
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
            return this.client !== "std" ? jx3boxData.__OriginRoot : jx3boxData.__Root;
        },
    },
    watch: {},
    methods: {
        setDefaultAvatar(e) {
            e.target.src = jx3boxData.default_avatar;
        },
        getBanner: function (item) {
            if (item.post_banner) {
                return showBanner(item.post_banner);
            } else {
                return jx3boxData.__imgPath + "image/fb_map_thumbnail/null.png";
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
            return getLink("bps", val);
        },
        authorLink,
        showHighlight(val) {
            return val ? `color:${val};font-weight:600;` : "";
        },
        showMark: function (val) {
            return mark_map.cms[val] || val;
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
