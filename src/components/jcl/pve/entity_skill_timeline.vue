<template>
    <div class="m-entity-skill-timeline w-card">
        <div class="w-card-title">
            <span class="u-title">主动招式轴 </span>
            <el-radio-group v-model.number="linetime" size="small">
                <el-radio-button :value="6">每行06s</el-radio-button>
                <el-radio-button :value="15">每行15s</el-radio-button>
                <el-radio-button :value="30">每行30s</el-radio-button>
                <el-radio-button :value="45">每行45s</el-radio-button>
                <el-radio-button :value="60">每行60s</el-radio-button>
            </el-radio-group>
            <!-- <div class="u-setting-trigger">
                <el-icon><Setting /></el-icon>
                选择技能
                <entity-skill-filter class="u-setting-popper"></entity-skill-filter>
            </div> -->
        </div>
        <div class="u-canvas-wrapper">
            <canvas-timeline
                :data="data"
                :time="time"
                :linetime="linetime"
                :max_width="max_width"
                :key="max_width"
            ></canvas-timeline>
        </div>
    </div>
</template>
<script setup>
// import EntitySkillFilter from "./entity_skill_filter.vue";
import CanvasTimeline from "../common/canvas_timeline.vue";

import { computed, toRefs, ref } from "vue";
import { useStore } from "@/pages/jcl/store";
import { usePve } from "@/pages/jcl/store_pve";
import { getResource } from "@/utils/jcl/common";

const store = useStore();
const { entity, selectedSkills } = toRefs(usePve());
const { end } = store.result;
const time = computed(() => end.sec + 10);
const linetime = ref(15);

const m_jcl_main = document.getElementsByClassName("p-pve-result")[0];
const m_jcl_main_width = m_jcl_main ? m_jcl_main.clientWidth : 0;
// 动态计算 max_width
const max_width = ref(m_jcl_main_width - 560); // 初始值为窗口宽度减去一定值

// // 监听窗口大小变化
// const updateMaxWidth = () => {
//     max_width.value = document.body.clientWidth - 550; // 更新 max_width
// };

// onMounted(() => {
//     window.addEventListener("resize", updateMaxWidth);
// });

// onUnmounted(() => {
//     window.removeEventListener("resize", updateMaxWidth);
// });

const data = computed(() => {
    const source = store.result.skill?.[entity.value]?.logs;
    if (!source) return [];
    const result = [];
    const idNameMap = {};
    const typeDescMap = {
        cast: "读条",
        hit: "命中",
        miss: "偏离",
    };
    for (let log of source) {
        if (!idNameMap[log.id]) {
            const name = getResource("skill:" + log.id).name;
            if (!name) continue;
            idNameMap[log.id] = name;
        }
        let name = idNameMap[log.id];
        const selectedSkill = selectedSkills.value[name];
        if (!selectedSkill || !selectedSkill.stat.includes(log.skillType)) continue;
        if (name.length > 5) name = name.charAt(0) + ".." + name.charAt(name.length - 1);
        result.push({
            content: name,
            time: log.time,
            extra: {
                tooltip: {
                    技能: selectedSkill.name,
                    技能ID: log.id,
                    施放时间: log.time.toFixed(2) + "s",
                    施放类型: typeDescMap[log.type],
                },
                color: selectedSkill.color,
            },
        });
    }
    result.unshift({
        extra: {
            tooltip: {
                事件: "战斗开始",
            },
            color: "#ffffff",
        },
        content: "战斗开始",
        time: 0,
    });
    result.push({
        extra: {
            tooltip: {
                事件: "战斗结束",
            },
            color: "#ffffff",
        },
        content: "战斗结束",
        time: end.sec ?? result[result.length - 1].time + 2,
    });

    return result;
});
</script>

<style lang="less">
.m-entity-skill-timeline {
    .w-card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .u-title {
            .mr(20px);
        }
    }

    .el-radio-button.is-active {
        .el-radio-button__inner {
            background-color: @light-purple;
            border-radius: 4px;
            color: #000;
        }
    }
    .el-radio-button .el-radio-button__inner {
        border: none;
        background-color: transparent;
    }

    .u-setting-trigger {
        .pr;
        .flex-center;
        .pointer;
        gap: 4px;
        color: #fff;
        background-color: @dark-purple;
        padding: 3px 8px;
        .r(3px);
    }

    .u-setting-trigger:hover {
        .u-setting-popper {
            visibility: visible;
            opacity: 1;
        }
    }

    .u-setting-popper {
        // 悬浮效果
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.15s, opacity 0.15s linear;

        // 定位
        .pa;
        top: calc(100%);
        right: -20px;

        z-index: 20;
    }

    .u-canvas-wrapper {
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 520px;
        min-height: 520px;
        width: 100%;
        .scrollbar(#718282, 10px);
    }
}
</style>
