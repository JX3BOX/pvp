<template>
    <div class="m-skill-wiki" v-if="wikiData && wikiData.post">
        <div class="m-wiki-post-panel">
            <div class="head-title">
                <span class="u-txt">技能百科</span>
                <a
                    class="u-button el-button el-button--primary"
                    :href="publish_url(`skill/${activeSkill}`)"
                    target="_blank"
                >
                    <el-icon><Edit /></el-icon>
                    <span>完善技能百科</span>
                </a>
            </div>
            <div class="m-panel-body">
                <div class="m-wiki-meta">
                    <div class="u-meta">
                        <em class="u-label">参与贡献</em
                        ><a
                            target="_blank"
                            :href="`/author/${item.id}`"
                            class="u-value u-creator"
                            v-for="(item, index) in userData"
                            :key="index"
                            ><img :src="item.avatar" :alt="item.nickname" :title="item.nickname"
                        /></a>
                    </div>
                    <!---->
                    <div class="u-meta"><em class="u-label">热度</em><span class="u-value"></span></div>
                    <div class="u-meta">
                        <em class="u-label">更新时间</em>
                        <span class="u-value">{{ wikiData.post ? ToDate(wikiData.post.updated) : "" }}</span>
                    </div>
                </div>
                <div v-html="wikiData.post.content"></div>
                <div class="m-wiki-signature">
                    <i class="el-icon-edit"></i>
                    <span>
                        本次修订由 <b>{{ wikiData.post ? wikiData.post.user_nickname : "" }}</b> 提交于{{
                            wikiData.post ? ToDate(wikiData.post.updated) : ""
                        }}
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="m-wiki-post-empty" v-if="is_empty">
        <!-- 非默认心法技能说明此处已选技能但无百科 -->

        <!-- <div class="no_active_skill" v-if="pasv_skills_data.length<1||pasv_skills_data.indexOf(activeSkill) !== -1">
            <span>请先选择技能后查看技能百科</span>
        </div> -->
        <div class="no_skill_post" v-if="pasv_skills_data.indexOf(activeSkill) == -1">
            <i class="el-icon-s-opportunity"></i>
            <span>暂无百科，我要</span>
            <a class="s-link" target="_blank" :href="publish_url(`skill/${activeSkill}`)">完善百科</a>
        </div>

        <div class="no_active_skill" v-else>
            <span>请先选择技能后查看技能百科</span>
        </div>
    </div>
</template>
<script>
import { useStore } from "@/store";
const $store = useStore();
import { getWikkToSkill } from "@/service/raw.js";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";
// 扩展插件
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
export default {
    data() {
        return {
            wikiData: {},
            pasv_skills_data: [],
            userData: [],
        };
    },
    props: ["pasv_skills_props"],
    computed: {
        activeSkill() {
            return $store.activeSkill || 0;
        },
        is_empty: function () {
            return !this.wikiData?.post;
        },
    },
    methods: {
        async getWikkToSkill() {
            let data = await getWikkToSkill({
                source_id: this.activeSkill,
                client: "std",
            });

            this.wikiData = data.data ? data.data[this.activeSkill] : {};
            this.userData = this.wikiData?.users;
        },
        publish_url: publishLink,
        martialAltsToPasv_skills(data) {
            this.pasv_skills_data = data;
        },
        ToDate(timeStr) {
            let tiem = new Date(Number(timeStr + "000"));
            return dayjs(tiem).format("YYYY-MM-DD");
        },
    },
    watch: {
        activeSkill() {
            this.getWikkToSkill();
        },
    },
};
</script>
<style lang="less">
@import "@/assets/css/wiki.less";
</style>
