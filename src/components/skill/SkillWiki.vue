<template>
    <div class="m-wiki">
        <div class="m-skill-wiki">
            <div class="m-wiki-post-panel">
                <div class="head-title">
                    <span class="u-txt"
                        ><el-icon><Reading /></el-icon>
                        技能百科
                        <em class="u-skill-ID" v-if="wikiData && wikiData.post">(技能ID: {{ activeSkill }})</em>
                    </span>
                    <a class="u-button el-button el-button--primary" :href="publish_url(`skill/${activeSkill}`)">
                        <el-icon><Edit /></el-icon>
                        <span>完善技能百科</span>
                    </a>
                </div>
                <div v-if="wikiData && wikiData.post" class="m-panel-body">
                    <div class="m-wiki-meta">
                        <div class="u-meta">
                            <em class="u-label">参与贡献</em>
                            <a
                                target="_blank"
                                :href="`/author/${item.id}`"
                                class="u-value u-creator"
                                v-for="(item, index) in userData"
                                :key="index"
                                ><img :src="showAvatar(item.avatar)" :alt="item.nickname" :title="item.nickname"
                            /></a>
                        </div>
                        <div class="u-meta">
                            <em class="u-label">更新时间</em>
                            <span class="u-value">{{ wikiData.post ? ToDate(wikiData.post.updated) : "" }}</span>
                        </div>
                    </div>
                    <div v-html="wikiData.post.content"></div>
                </div>
                <div class="m-wiki-post-empty m-panel-body" v-if="is_empty">
                    <div class="no_skill_post" v-if="!isPasvSkill">
                        <el-icon><Warning /></el-icon>
                        <span>暂无百科内容</span>
                    </div>

                    <div class="no_active_skill" v-else>
                        <span>请先选择技能后查看技能百科</span>
                    </div>
                </div>
                <div class="m-wiki-signature" v-if="wikiData && wikiData.post">
                    <SimpleThx
                        postType="skill"
                        :postTitle="wikiData?.post?.title"
                        :userId="wikiData?.post?.user_id"
                        :adminBoxcoinEnable="true"
                        :userBoxcoinEnable="true"
                        :postId="wikiData?.post?.id"
                    ></SimpleThx>
                    <el-button type="primary" class="u-btn" @click="onViewHistory"
                        ><el-icon class="u-icon"><RefreshLeft /></el-icon>查看历史版本</el-button
                    >
                </div>
            </div>
        </div>

        <el-drawer v-model="showDrawer" title="历史版本" class="c-wiki-revisions">
            <div class="m-revisions-panel">
                <div class="u-empty" v-if="!versions || !versions.length">
                    <span v-if="versions === null">🎉 数据加载中...</span>
                    <span v-if="versions === false">⚠️ 数据加载异常</span>
                    <span v-if="versions && !versions.length">💧 暂无数据</span>
                </div>
                <table v-if="versions && versions.length" class="m-histories">
                    <tr>
                        <th>版本</th>
                        <th>更新时间</th>
                        <th>贡献者</th>
                        <th>修订说明</th>
                    </tr>
                    <tr class="history" v-for="(ver, key) in versions" :key="key">
                        <td>
                            <a
                                class="u-version-link"
                                v-text="'v' + (versions.length - key)"
                                @click="onVersionClick(ver)"
                            ></a>
                        </td>
                        <td v-text="ts2str(ver.updated)"></td>
                        <td>
                            <a :href="ver.user_id ? author_url(ver.user_id) : null" v-text="ver.user_nickname"></a>
                        </td>
                        <td v-text="ver.remark"></td>
                    </tr>
                </table>
            </div>
        </el-drawer>
    </div>
</template>
<script>
import { useStore } from "@/store";
const $store = useStore();
import { getWikiToSkill, getVersions, getWikiById } from "@/service/raw.js";
import { publishLink, getLink, authorLink, ts2str, showAvatar } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";
import jx3boxData from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user.js";
import SimpleThx from "@jx3box/jx3box-vue3-ui/src/single/SimpleThx.vue";

// 扩展插件
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
export default {
    components: {
        SimpleThx,
    },
    props: {
        isPasvSkill: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            wikiData: {},
            userData: [],
            showDrawer: false,

            versions: [],
        };
    },
    computed: {
        activeSkill() {
            return $store.activeSkill || 0;
        },
        is_empty: function () {
            return !this.wikiData?.post;
        },
        client: function () {
            return location.href.includes("classic") || location.href.includes("origin") ? "origin" : "std";
        },
        baseUrl: function () {
            return this.client == "origin" ? jx3boxData.__OriginRoot : jx3boxData.__Root;
        },
        userId() {
            return User.getInfo()?.uid;
        },
    },
    methods: {
        async getWikiToSkill() {
            let data = await getWikiToSkill({
                source_id: this.activeSkill,
                client: this.client,
                type: "skill",
            });

            this.wikiData = data.data;
            this.userData = this.wikiData?.users;
        },
        publish_url: publishLink,
        showAvatar,
        ToDate(timeStr) {
            let time = new Date(Number(timeStr + "000"));
            return dayjs(time).format("YYYY-MM-DD");
        },
        loadWikiVersion() {
            getVersions({ type: "skill", id: this.activeSkill }, { client: this.client }).then(
                (res) => {
                    this.versions = res.data.data || [];
                },
                () => {
                    this.versions = [];
                }
            );
        },
        link: function (type, id) {
            return getLink(type, id);
        },
        author_url: function (uid) {
            return authorLink(uid);
        },
        ts2str,
        onViewHistory() {
            this.showDrawer = true;
        },
        loadWikiById({ id }) {
            getWikiById(id).then((res) => {
                this.wikiData = res.data.data || {};
                this.userData = this.wikiData?.users;
            });
        },
        onVersionClick(ver) {
            this.loadWikiById(ver);
        },
    },
    watch: {
        activeSkill() {
            this.getWikiToSkill();
        },
        showDrawer(val) {
            if (val) this.loadWikiVersion();
        },
    },
};
</script>
<style lang="less">
@import "@/assets/css/wiki.less";
</style>
