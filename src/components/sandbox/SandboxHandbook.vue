<template>
    <div class="m-sandbox-handbook">
        <div class="m-log-box" v-loading="loading">
            <ul class="u-list" v-if="handbookList.length">
                <li class="u-item" v-for="item in handbookList" :key="item.ID">
                    <!-- Banner -->
                    <a class="u-banner" :href="postLink(item.ID)" :target="target">
                        <img :src="getBanner(item.post_banner, item.post_subtype)" :key="item.ID" />
                        <span class="u-subject" :class="subject(item) || 'ALL'">{{ subject(item) || "ALL" }}</span>
                    </a>

                    <!-- 标题 -->
                    <h2 class="u-post" :class="{ isSticky: item.sticky }">
                        <img
                            class="u-icon"
                            :src="xficon(item.post_subtype)"
                            :alt="item.post_subtype"
                            :title="item.post_subtype"
                        />

                        <!-- 资料片 -->
                        <span class="u-label u-zlp" v-if="item.zlp">{{ item.zlp }}</span>

                        <!-- 标题文字 -->
                        <a
                            class="u-title"
                            :style="showHighlight(item.color)"
                            :href="postLink(item.ID)"
                            :target="target"
                            >{{ item.post_title || "无标题" }}</a
                        >

                        <!-- 角标 -->
                        <span class="u-marks" v-if="item.mark && item.mark.length">
                            <i v-for="mark in item.mark" class="u-mark" :key="mark">{{ showMark(mark) }}</i>
                        </span>
                    </h2>

                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        <div class="u-metalist u-collection">
                            <strong>小册</strong>
                            <em>
                                <template v-if="~~item.post_collection">
                                    <a :href="`/collection/${item.post_collection}`" target="_blank"
                                        >《{{ item.collection_info && item.collection_info.title }}》</a
                                    >
                                </template>
                                <template v-else>-</template>
                            </em>
                        </div>
                        <div class="u-metalist u-topics">
                            <strong>主题</strong>
                            <em>
                                <template v-if="item.topics && item.topics.length">
                                    <a
                                        class="u-topic"
                                        :href="`/bps?topic=${topic}`"
                                        v-for="topic in item.topics"
                                        :key="topic"
                                        >{{ topic }}</a
                                    >
                                </template>
                                <template v-else>-</template>
                            </em>
                        </div>
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <img
                            class="u-author-avatar"
                            :src="showAvatar(item.author_info)"
                            :alt="showNickname(item.author_info)"
                        />
                        <a class="u-author-name" :href="authorLink(item.post_author)" target="_blank">{{
                            showNickname(item.author_info)
                        }}</a>
                        <span class="u-date">
                            Updated on
                            <time>{{ dateFormat(item.post_modified) }}</time>
                        </span>
                    </div>
                </li>
            </ul>

            <el-pagination
                v-model="page"
                hide-on-single-page
                class="u-pagination"
                small
                background
                layout="prev, pager, next"
                :page-size="per"
                :total="total"
            />
        </div>
    </div>
</template>
<script>
import { mapState } from "pinia";
import { useStore } from "@/store";
import { getHandbookLogs } from "@/service/sandbox";
import dayjs from "dayjs";
import { showAvatar, authorLink, showBanner } from "@jx3box/jx3box-common/js/utils";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box";
import MARK from "@jx3box/jx3box-common/data/mark.json";

// 扩展插件
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
export default {
    name: "sendbox_handbook",
    props: {
        target: {
            type: String,
            default: "_blank",
        },
    },
    data: function () {
        return {
            handbookList: [],
            loading: true,

            per: 10,
            page: 1,
            total: 0,
        };
    },
    computed: {
        ...mapState(useStore, ["client"]),
        params() {
            return {
                per: this.per,
                page: this.page,
                type: "bps",
                order: "update",
                client: this.client,
                topic: "小攻防",
            };
        },
    },
    methods: {
        authorLink,
        async initHandbookList() {
            try {
                this.loading = true;
                let data = await getHandbookLogs(this.params);
                this.handbookList = data;
            } catch (e) {
                console.log(e);
            } finally {
                this.loading = false;
            }
        },
        getBanner: function (val, subtype) {
            if (val) {
                return showBanner(val);
            } else {
                let img_name = (subtype && xfmap[subtype]?.["id"]) || 0;
                return JX3BOX.__imgPath + "image/bps_thumbnail/" + img_name + ".png";
            }
        },
        showAvatar(user) {
            return showAvatar(user?.user_avatar);
        },
        showNickname(user) {
            return user?.display_name || "匿名";
        },
        showMark: function (val) {
            return MARK.cms[val] || val;
        },
        postLink(val) {
            return location.origin + `/bps/` + val;
        },
        dateFormat(gmt) {
            return dayjs(new Date(gmt)).format("YYYY-MM-DD");
        },
        xficon: function (val) {
            if (!val || val == "其它") val = "通用";
            let xf_id = xfmap[val] && xfmap[val]["id"];
            return JX3BOX.__imgPath + "image/xf/" + xf_id + ".png";
        },
        showHighlight: function (val) {
            return val ? `color:${val};font-weight:600;` : "";
        },
        subject: function (item) {
            let subject = "";
            if (item.tags?.includes("PVE") && item.tags?.includes("PVP")) {
                subject = "ALL";
            } else if (item.tags?.includes("PVE")) {
                subject = "PVE";
            } else if (item.tags?.includes("PVP")) {
                subject = "PVP";
            }
            return subject;
        },
    },
    created() {
        this.initHandbookList();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/sandbox/sandbox_handbook.less";
</style>
