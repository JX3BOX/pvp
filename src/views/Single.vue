<template>
    <SingleLayout>
        <div class="p-pvp-single">
            <PostHeader :post="post" :stat="stat">
                <div class="u-meta u-sub-block">
                    <em class="u-label">心法</em>
                    <span class="u-value">
                        <img class="u-icon-xf" :src="xficon(xficon_id)" :alt="xf" />
                        {{ xf }}
                    </span>
                </div>
                <div class="u-meta u-sub-block">
                    <em class="u-label">资料片</em>
                    <span class="u-value">{{ zlp }}</span>
                </div>
            </PostHeader>

            <div class="m-single-post" v-if="visible">
                <el-divider content-position="left">JX3BOX</el-divider>
                <div class="m-trick-item">
                    <div class="m-trick-item__content">
                        <div class="m-trick-item__right">
                            <div class="m-header">
                                <div v-html="nl2br(data?.post_meta?.content)"></div>
                            </div>
                            <div class="m-content">
                                <div class="m-talent" v-if="Object.keys(talent).length">
                                    <div class="m-talent__title">
                                        <img class="u-icon" :src="getAppIcon('talent')" alt="" />
                                        奇穴
                                    </div>
                                    <div class="m-talent-box" :class="`m-qx-container-${data?.ID}`"></div>

                                    <div class="u-desc" v-if="data?.post_meta?.talent_desc">
                                        奇穴讲解：<span v-html="nl2br(data?.post_meta?.talent_desc)"></span>
                                    </div>
                                </div>
                                <div class="m-skills">
                                    <div class="m-skill-item" v-for="(item, i) in skills" :key="i">
                                        <div class="u-title">
                                            <img class="u-icon" :src="getAppIcon('pvp')" alt="" /> 连招：{{ item.name }}
                                        </div>
                                        <div class="u-skills" v-if="item.sq">
                                            <span
                                                v-for="(skill, index) in item.sq"
                                                :key="skill.SkillID + '' + index"
                                                class="u-skill"
                                            >
                                                <img
                                                    class="u-skill-icon"
                                                    :src="iconLink(skill.IconID)"
                                                    :alt="skill.IconID"
                                                    :title="skill.Name"
                                                />
                                                <span class="u-skill-name">{{ skill.Name }}</span>
                                                <i class="u-gcd-icon" v-show="skill.WithoutGcd" title="无GCD技能">
                                                    <el-icon><Clock /></el-icon>
                                                </i>
                                            </span>
                                        </div>
                                        <div class="u-desc" v-if="item.desc">连招说明：{{ item.desc }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <el-divider content-position="left">正文</el-divider>
                <Article :content="post_content" @directoryRendered="updateDirectory" />
            </div>
            <div class="m-single-null" v-else>
                <el-alert :title="null_tip" type="warning" show-icon></el-alert>
            </div>

            <!-- 文章后 -->
            <div class="m-single-append">
                <slot name="single-append"></slot>

                <!-- 打赏 -->
                <Thx
                    class="m-single-thx"
                    :postId="id"
                    :postType="post_type"
                    :postTitle="post_title"
                    :userId="author_id"
                    :adminBoxcoinEnable="true"
                    :userBoxcoinEnable="true"
                    :authors="authors"
                    :client="post_client"
                    :allowGift="allow_gift"
                    showRss
                />

                <!-- 评论 -->
                <div ref="commentView" class="m-single-comment">
                    <el-divider content-position="left">评论</el-divider>
                    <Comment :id="id" category="post" v-if="id && allow_comment" />
                    <el-alert title="作者没有开启评论功能" type="warning" show-icon v-else></el-alert>
                </div>
            </div>
        </div>
    </SingleLayout>
</template>

<script>
import { showAvatar, authorLink, iconLink, getAppIcon } from "@jx3box/jx3box-common/js/utils";
import { useStore } from "@/store";
import { getPost } from "@/service/post";
import { getStat, postStat, postHistory } from "@jx3box/jx3box-common/js/stat_v2";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import SETTING from "@/../setting.json";
const appKey = SETTING.appKey;

// 奇穴
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";

import SingleLayout from "@/layouts/SingleLayout.vue";
import PostHeader from "@jx3box/jx3box-vue3-ui/src/single/PostHeader.vue";
import Thx from "@jx3box/jx3box-vue3-ui/src/single/Thx.vue";
import Comment from "@jx3box/jx3box-vue3-ui/src/single/Comment.vue";
import Article from "@jx3box/jx3box-vue3-ui/src/editor/Article.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "PvpSingle",
    components: {
        SingleLayout,
        PostHeader,
        Thx,
        Comment,
        Article,
    },
    data() {
        return {
            post: {},
            stat: {},
            loading: false,
            talentDriver: null,
            authors: [],
            directory: false,
        };
    },
    computed: {
        id() {
            return ~~this.$route.params.id;
        },
        post_type: function () {
            return this.post?.post_type;
        },
        post_title: function () {
            return this.post?.post_title;
        },
        post_content: function () {
            return this.post?.post_content;
        },
        author_id: function () {
            return this.post?.post_author;
        },
        post_subtype: function () {
            return this?.post?.post_subtype || "其它";
        },
        xf: function () {
            return this.post?.post_subtype;
        },
        xficon_id: function () {
            return this.xf && xfmap[this.xf]?.id;
        },
        zlp: function () {
            return this.post?.zlp || "未知";
        },
        data() {
            return this.post;
        },
        talent() {
            try {
                return JSON.parse(this.data?.post_meta?.talent);
            } catch (e) {
                return {};
            }
        },
        skills() {
            return this.data?.post_meta?.data;
        },
        visible: function () {
            return !!this.post?._check;
        },
        null_tip: function () {
            let str = "作者设置了【";
            str += JX3BOX.__visibleMap[this.post?.visible];
            str += "】";
            return str;
        },
        post_client: function () {
            return this.post?.client || "all";
        },
        allow_gift: function () {
            return this.post?.allow_gift;
        },
        allow_comment: function () {
            return !this.post?.comment;
        },
        community_id: function () {
            return this.post?.community_id || 0;
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        showAvatar(val) {
            return showAvatar(val, 88 * 3);
        },
        authorLink,
        iconLink,
        getAppIcon,
        nl2br(str) {
            return str && str.replace(/\n/g, "<br/>");
        },
        loadData() {
            if (!this.id) {
                return;
            }
            this.loading = true;
            getPost(this.id)
                .then((res) => {
                    this.post = res.data.data;
                    useStore().userId = this.post?.post_author;
                    useStore().postId = this.post?.ID;
                    useStore().post = this.post;

                    document.title = this.post?.post_title;

                    User.isLogin() &&
                        postHistory({
                            source_type: appKey,
                            source_id: ~~this.id,
                            link: location.href,
                            title: this.post.post_title,
                        });

                    this.$nextTick(() => {
                        this.installTalent();
                    });
                })
                .finally(() => {
                    this.loading = false;
                });

            getStat(appKey, this.id).then((res) => {
                this.stat = res.data;
            });
            postStat(appKey, this.id);
        },
        xficon: function (val) {
            return JX3BOX.__imgPath + "image/xf/" + val + ".png";
        },
        installTalent() {
            this.talentDriver = new JX3_QIXUE({
                container: `.m-qx-container-${this.data?.ID}`,
                version: this.talent.version,
                xf: this.talent.xf,
                editable: false,
                sq: this.talent.sq,
                client: this.talent.client || "std",
            });
        },
        updateDirectory: function (val) {
            this.directory = val;
        },
    },
    watch: {
        community_id: {
            immediate: true,
            handler(val) {
                if (val && val != 0) {
                    // 防止死循环
                    if (location.href.includes(`/community/${val}`)) {
                        return;
                    }
                    location.href = `/community/${val}`;
                }
            },
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/single.less";
</style>
