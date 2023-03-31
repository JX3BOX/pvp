<template>
    <div class="m-sandbox-logs">
        <div class="m-log-box">
            <div class="m-box-info">
                <div class="u-box" v-for="(item, index) in sandboxData" :key="index">
                    <span class="u-desc" v-html="toLogText(item.content)"></span>
                    <span class="u-title">{{ ToDate(item.time) }}</span>
                </div>
                <span class="u-desc" v-if="sandboxData.length < 1">暂无记录</span>
            </div>
        </div>
    </div>
</template>
<script>
import dayjs from "dayjs";

// 扩展插件
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
export default {
    name: "sendbox_handbook",
    props: ["sandboxData"],
    data: function () {
        return {
            item: {
                list: [],
            },
        };
    },
    methods: {
        ToDate(timeStr) {
            // console.log(timeStr+'000'))
            let tiem = new Date(Number(timeStr + "000"));
            return dayjs(tiem).format("YYYY-MM-DD HH:MM");
        },
        toLogText(text) {
            let arr = text.split("贡献前三名的帮会将均分");
            let t1 = arr ? arr[0].split("感谢他们为阵营的付出")[0] : text;
            let t2 = t1
                .replaceAll("浩气盟", `<i class='sandbox-em-hq'>浩气盟</i>`)
                .replaceAll("恶人谷", `<i class='sandbox-em-er'>恶人谷</i>`);
            let t3 = t2.replaceAll("【", `<i class='sandbox-em-point'>【`).replaceAll("】", `】</i>`);
            return t3;
        },
    },
    created() {},
};
</script>
<style lang="less" scoped>
.u-box {
    font-size: 12px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .u-desc {
        font-size: inherit;
        color: inherit;
    }
}
</style>
