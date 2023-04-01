<template>
    <div class="m-skill-wiki">
        <div class="m-wiki-post-panel" v-if="wikiData && wikiData.post">
            <div class="head-title">
                <span class="u-txt">技能百科</span>
            </div>
            <div class="m-wiki-metas">
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
            <div class="m-panel-body">
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
            let data = await getWikkToSkill(this.activeSkill);
            console.log(data);
            this.wikiData = data.data ? data.data[this.activeSkill] : {};
            this.userData = this.wikiData?.users;
        },
        publish_url: publishLink,
        martialAltsToPasv_skills(data) {
            console.log(data);
            this.pasv_skills_data = data;
        },
        ToDate(timeStr) {
            let tiem = new Date(Number(timeStr + "000"));
            return dayjs(tiem).format("YYYY-MM-DD");
        },
    },
    watch: {
        activeSkill(newVal) {
            console.log(newVal);
            this.getWikkToSkill();
        },
        pasv_skills_props(newVal) {
            console.log(newVal);
        },
    },
};
</script>
<style lang="less" scoped>
.m-skill-wiki {
    background-color: #fafbfc;
    border: 1px solid #eee;
    border-radius: 5px;
    font-size: 14px;
    .mt(20px);
    .u-trigger {
        .pointer;
        .x;
        font-size: 12px;
        border-top: 1px dashed #eee;
        padding-top: 8px;
        i {
            .mr(3px);
        }
    }
    .head-title {
        font-size: 17px;
        font-weight: 300;
        padding: 10px 0;
        color: #6c645c;
        margin: 0;
        font-weight: 500;
        padding: 10px 15px;
        background-color: #f5f7fa;
        border-bottom: 1px solid #eee;
    }
    .m-wiki-metas {
        color: #3d454d;
        font-family: -apple-system, Microsoft YaHei, Trebuchet MS, Calibri, BlinkMacSystemFont, Segoe UI, Helvetica Neue,
            Helvetica, sans-serif;
        text-rendering: optimizelegibility;
        letter-spacing: 0.2px;
        line-height: 1.6em;
        word-break: break-all;
        outline: none;
        margin-bottom: 5px;
        font-size: 12px;
        padding: 10px 15px 0px;
        display: flex;
        .u-meta {
            height: 28px;
            line-height: 28px;
            margin-right: 10px;
            padding: 3px 8px;

            font-style: normal;
            color: #666;
            display: flex;
            align-items: center;
            .u-creator {
                display: inline-block;
                *display: inline;
                *zoom: 1;
                width: 24px;
                height: 24px;
                margin-right: 5px;
                border-radius: 50%;
                overflow: hidden;
            }
            .u-label {
                font-style: normal;
                margin-right: 10px;
                padding: 3px 8px;
                background-color: #f2f2f2;
                border-radius: 2px;
                font-style: normal;
                color: #666;
            }
        }
    }

    .m-panel-body {
        padding: 0 15px;
        line-height: 1.6em;
        word-break: break-all;
    }
}
.m-wiki-post-empty {
    .u-msg-yellow;
    .x;
    .s-link {
        .underline(@color-link);
    }
    letter-spacing: 2px;
    .fz(14px);
}

.m-wiki-compatible {
    .u-msg-yellow;
    margin: 10px auto;
    padding: 5px 10px;
    a {
        .underline(@color-link);
    }
}

.m-wiki-signature {
    .x(right);
    color: #999;
    .fz(12px,2);
    border-top: 1px dashed #ddd;
    padding: 5px 0;
}

details {
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px 10px 0;
}

.u-wiki__title {
    font-size: 17px;
    font-weight: 300;
    color: #6c645c;
    margin: -10px -10px 0;
    padding: 10px;
    .pointer;
    .pr;
    i {
        margin-right: 5px;
    }
}

details[open] {
    padding: 10px;
}

details[open] summary {
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
}
</style>
