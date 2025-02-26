<template>
    <div class="m-sandbox-log" v-if="item">
        <div class="m-log-box">
            <div class="m-box-info">
                <img class="u-img" :src="item.img" />
                <div class="u-box">
                    <span class="u-title">{{ item.name }}</span>
                    <span class="u-desc">{{ item.desc || "暂无介绍" }}</span>
                    <a class="u-baike" :href="item.link" target="_blank">查看百科 &raquo;</a>
                </div>
            </div>
            <ul class="u-cont" style="overflow: auto" v-if="item?.list?.length">
                <li v-for="(items, i) in item.list" :key="i">
                    <div class="u-line">
                        <span class="u-time">{{ items.date }}</span>
                    </div>
                    <div class="u-line">
                        <span>占领势力：</span>
                        <span :class="items.camp">[{{ items.camp == "haoqi" ? "浩气盟" : "恶人谷" }}]</span>
                    </div>
                    <div class="u-line">
                        <span>占领帮会：</span>
                        <span :class="items.camp">{{ items.gang }}</span>
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
export default {
    name: "SandBoxLog",
    props: ["item"],
    data: function () {
        return {};
    },
    methods: {},
};
</script>
