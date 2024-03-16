<template>
    <div class="m-skill-change">
        <div class="m-changelog-list">
            <template v-for="item in data" :key="item.id">
                <div class="m-changelog-item">
                    <div class="m-item__left">
                        <a class="u-logo" :href="item.link ? item.link : getLink('bps', item.post_id)" target="_blank"
                            ><img class="u-zlp-logo" :src="imgLink(item)" alt=""
                        /></a>
                        <div class="m-item-content">
                            <div class="m-item__title">
                                <time>{{ item.date }} / </time>
                                <a
                                    :href="item.link ? item.link : getLink('bps', item.post_id)"
                                    target="_blank"
                                    class="u-title"
                                    >{{ item.title }}</a
                                >
                            </div>
                            <div class="m-item__dec" v-html="nl2br(item.desc)"></div>
                        </div>
                    </div>
                    <div class="m-item__right">
                        <el-button
                            @click="showDetail(item)"
                            size="large"
                            :icon="item.showSub ? 'ArrowDownBold' : 'ArrowRightBold'"
                            type="primary"
                            >技改详解
                        </el-button>
                    </div>
                </div>
                <ul class="m-changelog-sublist m-news-list m-sideblock-list" v-show="item.showSub">
                    <template v-if="item.subList && item.subList.length">
                        <li class="m-changelog-sublist__item u-item" v-for="subitem in item.subList" :key="subitem.id">
                            <span class="u-item-content">
                                <el-icon><Notification /></el-icon>
                                <a
                                    :href="getLink('bps', subitem.post_id)"
                                    target="_blank"
                                    class="u-subtitle"
                                    rel="noopener noreferrer"
                                    >{{ subitem.post && subitem.post.post_title }}</a
                                >
                            </span>
                        </li>
                    </template>
                    <el-alert v-else show-icon type="warning" title="该资料片暂无技改详解" :closable="false"></el-alert>
                </ul>
            </template>
            <el-pagination
                class="m-changelog-pages"
                background
                layout="total, prev, pager, next,jumper"
                :hide-on-single-page="true"
                :page-size="per"
                :total="total"
                v-model="page"
                @current-change="changePage"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";
import dateFormat from "@/assets/js/dateFormat.js";
import { useStore } from "@/store";
import { getChangelog, getPostMeta } from "@/service/post";
import { getThumbnail, getLink } from "@jx3box/jx3box-common/js/utils.js";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "SkillChange",
    components: {},
    data() {
        return {
            isEditor: User.isEditor(),
            data: [],
            per: 10,
            page: 1,
            total: 0,
        };
    },
    computed: {
        showData() {
            return this.data.map((item) => {
                item.time = new Date(item.icon);
                item.type = "skill_change";
                return item;
            });
        },
        client() {
            return useStore().client;
        },
    },
    mounted() {
        this.loadSkillChangeData();
    },
    methods: {
        getLink,
        dateFormat(val) {
            return dateFormat(val, "-");
        },
        changePage(page) {
            this.page = page;
            this.loadSkillChangeData();
        },
        loadSkillChangeData() {
            const params = {
                client: this.client,
                per: this.per,
                page: this.page,
            };
            getChangelog(params).then((res) => {
                this.data = (res.data?.data?.list || []).map((item) => {
                    item.showSub = false;
                    item.subList = [];
                    return item;
                });
                this.total = res.data?.data?.total || 0;
            });
        },
        imgLink({ zlp }) {
            return getThumbnail(`${JX3BOX.__imgPath}image/zlp/${zlp}.png`, [180, 86]);
        },
        nl2br(str) {
            return str ? str.replace(/[\r\n]/g, "<br>") : "暂无描述";
        },
        async showDetail(item) {
            if (item.showSub) {
                item.showSub = false;
                return;
            }
            const params = {
                key: "link_changelog",
                val: item.id,
            };
            const res = await getPostMeta(params);
            item.subList = res.data?.data || [];
            item.showSub = !item.showSub;
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill_change.less";
</style>
