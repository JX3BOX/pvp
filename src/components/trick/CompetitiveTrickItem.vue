<template>
    <div class="m-trick-item" v-if="hasData">
        <div class="m-trick-item__header">
            <div class="m-trick-item__title">
                <span class="u-label u-zlp" v-if="data.zlp">{{ data.zlp }}</span>
                <a class="u-link" :href="`/pvp/${data?.ID}`" target="_blank">{{ data.post_title || "未知流派" }}</a>
                <span class="u-marks" v-if="data.mark && data.mark.length">
                    <i v-for="mark in data.mark" class="u-mark" :key="mark">{{ showMark(mark) }}</i>
                </span>
            </div>
            <div class="m-trick-item__thx">
                <SimpleThx
                    postType="pvp"
                    :postTitle="data?.post_title"
                    :userId="data?.post_author"
                    :adminBoxcoinEnable="true"
                    :userBoxcoinEnable="true"
                    :postId="data?.ID"
                    :presetConfig="preset"
                />
                <el-tooltip content="评论" placement="top-start">
                    <img src="@/assets/img/comment.svg" class="u-icon" svg-inline alt="" @click="showComment = true" />
                </el-tooltip>
            </div>
        </div>
        <div class="m-trick-item__content">
            <div class="m-trick-item__left">
                <a class="m-author" :href="authorLink(data?.post_author)">
                    <Avatar
                        class="u-avatar"
                        :uid="data?.post_author"
                        size="s"
                        :url="data.author_info?.user_avatar"
                        :frame="data.author_info?.user_avatar_frame"
                    ></Avatar>
                    <span class="u-name">{{ data.author_info?.display_name }}</span>
                </a>
            </div>
            <div class="m-trick-item__right">
                <div class="m-header">
                    <div v-html="nl2br(data?.post_meta?.content)"></div>
                </div>
                <div class="m-content">
                    <div class="m-talent">
                        <div class="m-talent__title">
                            <img class="u-icon" :src="getAppIcon('talent')" alt="" />
                            奇穴
                        </div>
                        <div class="m-talent-box" :class="`m-qx-container-${data?.ID}`"></div>
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

        <el-drawer title="评论" v-model="showComment" destroy-on-close class="m-trick-drawer">
            <Comment category="post" :id="data?.ID"></Comment>
        </el-drawer>
    </div>
</template>

<script>
import { authorLink, iconLink, getAppIcon } from "@jx3box/jx3box-common/js/utils";

// 奇穴
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";
import SimpleThx from "@jx3box/jx3box-vue3-ui/src/single/SimpleThx.vue";
import Comment from "@jx3box/jx3box-vue3-ui/src/single/Comment.vue";
import Avatar from "@jx3box/jx3box-vue3-ui/src/author/Avatar.vue";
import { cms as mark_map } from "@jx3box/jx3box-common/data/mark.json";
export default {
    name: "CompetitiveTrickItem",
    components: {
        SimpleThx,
        Comment,
        Avatar,
    },
    props: {
        preset: {
            type: Object,
            default: () => {},
        },
        data: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            talentDriver: null,
            showComment: false,
        };
    },
    computed: {
        talent() {
            try {
                return JSON.parse(this.data?.post_meta?.talent);
            } catch (e) {
                return {};
            }
        },
        hasData() {
            return !!this.data?.ID;
        },
        skills() {
            return this.data?.post_meta.data;
        },
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler() {
                if (!this.talentDriver) {
                    this.$nextTick(() => {
                        this.installTalent();
                    });
                }
            },
        },
        talent: {
            deep: true,
            handler() {
                this.reloadTalent();
            },
        },
    },
    methods: {
        authorLink,
        iconLink,
        getAppIcon,
        // 初始化奇穴模拟器（此时渲染使用空奇穴模板）
        installTalent() {
            this.talentDriver = new JX3_QIXUE({
                container: `.m-qx-container-${this.data?.ID}`,
                version: this.talent.version,
                xf: this.talent.xf,
                editable: false,
                sq: this.talent.sq,
            });
            // this.reloadTalent();
        },
        reloadTalent() {
            this.$nextTick(() => {
                if (!this.talentDriver) return;
                this.talentDriver?.then((talent) => {
                    talent.load({
                        version: this.talent.version,
                        xf: this.talent.xf,
                        editable: false,
                        sq: this.talent.sq,
                    });
                });
            });
        },
        nl2br(str) {
            return str.replace(/\n/g, "<br/>");
        },
        showMark: function (val) {
            return mark_map[val] || val;
        },
    },
};
</script>
