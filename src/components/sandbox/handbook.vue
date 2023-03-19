<template>
    <div class="m-sandbox-handbook">
        <div class="m-log-box">
            <ul class="u-cont" style="overflow: auto" v-if="handbookList.length > 0">
                <li v-for="(items, i) in handbookList" :key="i">
                    <div class="u-line" @click="linkTo(items.post_id)">
                        <img class="u-img" :src="items.author_info?.user_avatar" />
                        <div class="u-box">
                            <div class="u-title">{{ items.post_title }}</div>
                            <div class="u-desc">
                                <a class="u-baike" :href="items.link" target="_blank">查看百科 &raquo;</a>
                            </div>
                            <div class="u-foot">
                                <span class="u-title">作者: {{ items.author }}</span>
                                <span class="u-desc">时间: {{ ToDate(items.post_modified) }}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="u-cont" v-else>
                <div class="u-nonedata">暂无数据</div>
            </div>
        </div>
    </div>
</template>
<script>
import { getHandbookLogs } from "@/service/sandbox";
import { dayjs } from "element-plus";

// 扩展插件
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
export default {
    name: "sendbox_handbook",
    data: function () {
        return {
            handbookList: [],
            item: {
                list: [
                    {
                        img: "",
                        name: "pvp攻略1",
                        desc: "pvp攻略1详细介绍介绍介绍介绍",
                    },
                ],
            },
        };
    },
    methods: {
        async initHandbookList() {
            let data = await getHandbookLogs();
            console.log(data);
            this.handbookList = data;
        },
        ToDate(timeStr) {
            return dayjs(timeStr).format("YYYY-MM-DD");
        },
        linkTo(id) {
            return window.open(`https://www.jx3box.com/bps/${id}`);
        },
    },
    created() {
        this.initHandbookList();
    },
};
</script>
<style lang="less" scoped>
.m-sandbox-handbook {
    .m-log-box {
        ul {
            padding-left: 0px;
            li {
                list-style: none;
            }
        }
    }
    .u-line {
        display: flex;
        margin-bottom: 15px;
        cursor: pointer;
        .u-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .u-box {
            width: 100%;
            .u-desc {
                padding: 6px 0;
            }
            .u-foot {
                display: flex;
                justify-content: space-between;
            }
        }
    }
}
</style>
