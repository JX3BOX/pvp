<template>
    <div class="m-skill-item">
        <div class="u-header">
            <div class="u-header-line" v-for="(line, index) of headerHtml" :key="index">
                <template v-for="(span, i) of line" :key="i">
                    <div v-html="span"></div>
                </template>
            </div>
        </div>
        <div class="u-desc-box">
            <div class="u-desc__special" v-if="item.SpecialDesc">{{ item.SpecialDesc }}</div>
            <div class="u-desc" v-if="item.parse?.desc" v-html="format(item.parse?.desc)"></div>
            <div class="u-desc" v-else-if="item.Desc" v-html="format(item.Desc)"></div>
            <div class="u-desc__simple" v-if="item.SimpleDesc">{{ item.SimpleDesc }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SkillItemV2",
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
        concise: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        headerHtml() {
            if (!this.item?.parse) return [];
            const parse = this.item.parse;
            return parse.tooltip;
        },
    },
    methods: {
        format: function (txt) {
            return txt?.replace(/\\n/g, "\n");
        },
    },
};
</script>

<style scoped lang="less">
.m-skill-item {
    padding: 10px;
    .pr;
    background-color: rgba(0, 0, 0, 0.8);
    // TODO如果重新数据构建，则将该代码删除
    .u-header {
        .u-header-line {
            .color(#ffffff);
            &:first-child {
                .color(#ff0);
            }
        }
    }
    // -------------------------------
}
.u-header-line {
    display: flex;
    justify-content: space-between;
}
.u-desc-box {
    .fz(14px, 1.5);
    .u-desc__special,
    .u-desc__simple {
        color: @q_score_orange;
    }
    .u-desc {
        white-space: pre-wrap;
        color: @q_yellow;
    }
}
</style>
