<template>
    <div class="u-item">
        <div class="u-info">
            <i class="u-pic"><img :src="item.icon.FileName" /></i>
            <span class="u-name">{{ item.skillName }}</span>
            <span class="u-release">{{ item.releaseType }}</span>
            <span class="u-cd">{{ item.cd }}</span>
        </div>
        <div class="u-details">
            <span class="u-distance"
                ><em>距离</em><span>{{ item.distance }}</span></span
            >
            <span class="u-weapon"
                ><em>武器</em><span>{{ item.weapon }}</span></span
            >
            <span class="u-consumption"
                ><em>消耗内力</em><span>{{ item.consumption }}</span></span
            >
        </div>
        <div class="u-descbox">
            <div class="u-spdesc">{{ item.specialDesc }}</div>
            <div class="u-desc" v-html="format(item.desc)"></div>
            <div class="u-sdesc">{{ item.simpleDesc }}</div>
        </div>
        <div class="u-cheasts" v-if="item.cheasts.length" v-show="!!item.collapse">
            <div class="u-cheast" v-for="(cheast, i) in item.cheasts" :key="cheast + i">
                <i class="el-icon-collection-tag"></i>
                <span class="u-cheast-name">{{ cheast.name }}</span>
                <span class="u-cheast-desc">{{ cheast.desc }}</span>
            </div>
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
            return txt.replace(/\\n/g, "\n");
        },
    },
};
</script>

<style scoped lang="less">
.u-title {
    margin: 0;
    font-size: 15px;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
}
.u-list {
    letter-spacing: 0.2px;
}
.u-item {
    border: 1px solid #eee;
    padding: 10px;
    .r(4px);
    background-color: @bg-light;
    .pr;
}

.u-info {
    .clearfix;
    .u-pic {
        .fl;
        .mr(10px);
    }
    .u-name {
        .bold;
        .fz(15px, 1.6);
        .db;
    }
    .u-release,
    .u-cd {
        .fz(13px);
        .mr(10px);
        color: #329a00;
    }
}

.u-details {
    .u-distance,
    .u-weapon,
    .u-consumption {
        .fz(13px, 2);
        .db;

        em {
            font-style: normal;
            &::after {
                content: ":";
                padding: 0 3px;
            }
        }
        span {
            font-weight: 600;
        }
    }
}

.u-descbox {
    .fz(14px, 1.9);
    .u-spdesc,
    .u-sdesc {
        color: #ccc;
    }
    .u-desc {
        white-space: pre-wrap;
    }
}
.u-item {
    .pr;
}
.u-panel {
    .pa;
    .rt(10px);
}
</style>
