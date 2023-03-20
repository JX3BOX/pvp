<template>
    <div class="m-skill-item">
        <div class="u-name u-block">
            <span>{{ item.skillName }}</span>
            <span class="u-cd" v-if="item.cd">{{ item.cd }}</span>
        </div>
        <div class="u-details">
            <div class="u-block" v-if="item.distance || item.consumption">
                <span class="u-distance" v-if="item.distance"
                    ><em>距离</em><span>{{ item.distance }}</span></span
                >
                <span class="u-consumption" v-if="item.consumption"
                    ><em>消耗内力</em><span>{{ item.consumption }}</span></span
                >
            </div>
            <div class="u-block" v-if="item.weapon || item.releaseType">
                <span class="u-weapon" v-if="item.weapon"
                    ><em>武器</em><span>{{ item.weapon }}</span></span
                >
                <span class="u-release" v-if="item.releaseType"
                    ><span>{{ item.releaseType }}</span></span
                >
            </div>
        </div>
        <div class="u-descbox">
            <div class="u-spdesc" v-if="item.specialDesc">{{ item.specialDesc }}</div>
            <div class="u-desc" v-if="item.desc" v-html="format(item.desc)"></div>
            <div class="u-sdesc" v-if="item.simpleDesc">{{ item.simpleDesc }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SkillItem",
    props: ["item"],
    data: function () {
        return {};
    },
    methods: {
        format: function (txt) {
            return txt?.replace(/\\n/g, "\n");
        },
    },
};
</script>

<style scoped lang="less">
.u-list {
    letter-spacing: 0.2px;
}
.m-skill-item {
    padding: 10px;
    .pr;
    background-color: rgba(0, 0, 0, 0.8);

    .u-name {
        .fz(14px, 1.8);
        .db;
        color: @q_yellow;
    }
    .u-cd {
        color: #329a00;
    }
    .u-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
}

.u-details {
    color: #fff;
    .u-distance,
    .u-weapon,
    .u-consumption {
        .db;
        em {
            font-style: normal;
            &::after {
                content: ":";
                padding: 0 3px;
            }
        }
    }
}

.u-descbox {
    .fz(14px, 1.8);
    .u-spdesc,
    .u-sdesc {
        color: @q_score_orange;
    }
    .u-desc {
        white-space: pre-wrap;
        color: @q_yellow;
    }
}
.u-panel {
    .pa;
    .rt(10px);
}
</style>
