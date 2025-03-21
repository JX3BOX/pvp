<template>
    <div class="timeline-container">
        <div class="timeline-selector">
            <timeline-selector class="u-setting-popper"></timeline-selector>
        </div>
        <div class="m-timeline w-card">
            <div class="w-card-title">
                <span class="u-title">技能释放时间轴</span>
                <el-radio-group v-model.number="linetime" size="small">
                    <el-radio-button :value="15">每行15s</el-radio-button>
                    <el-radio-button :value="30">每行30s</el-radio-button>
                    <el-radio-button :value="45">每行45s</el-radio-button>
                    <el-radio-button :value="60">每行60s</el-radio-button>
                </el-radio-group>
            </div>
            <div class="u-canvas-wrapper">
                <canvas-timeline
                    :data="data"
                    :time="time"
                    :linetime="linetime"
                    :max_width="max_width"
                ></canvas-timeline>
            </div>
        </div>
    </div>
</template>

<script setup>
import TimelineSelector from "../pve/timeline_selector";
import CanvasTimeline from "../common/canvas_timeline.vue";

import { computed, toRefs, ref } from "vue";
import { useStore } from "@/pages/jcl/store";
import { usePve } from "@/pages/jcl/store_pve";
import { getResource } from "@/utils/jcl/common";
const m_jcl_main = document.getElementsByClassName("p-pve-result")[0];
const m_jcl_main_width = m_jcl_main ? m_jcl_main.clientWidth : 0;
// 动态计算 max_width
const max_width = ref(m_jcl_main_width - 500); // 初始值为窗口宽度减去一定值
console.log(m_jcl_main_width);
const store = useStore();
const { end } = store.result;
const { selectedTimeline } = toRefs(usePve());
const time = computed(() => end.sec + 10);
const linetime = ref(15);
const data = computed(() => {
    const source = store.result.time_line_result;
    if (!source) return [];
    const result = [];
    const idNameMap = {};
    for (let log of source.skills) {
        const key = `${log.skill_id}_${log.skill_level}`;
        if (!idNameMap[key]) {
            const name = getResource("skill:" + key).name;
            if (!name) continue;
            idNameMap[key] = name;
        }
        let name = idNameMap[key];
        let short_name = name;
        // 是否显示
        const skill_key = "skill:" + name;
        const current_timeline = selectedTimeline.value[skill_key];
        if (!current_timeline || !current_timeline.stat.includes("select")) continue;
        if (name.length > 5) short_name = name.charAt(0) + ".." + name.charAt(name.length - 1);
        result.push({
            content: short_name,
            time: log.time,
            extra: {
                tooltip: {
                    技能: name,
                    释放者模板ID: log.templateID,
                    释放者名称: log.name,
                    技能ID: log.skill_id,
                    等级: log.skill_level,
                    施放时间: log.time.toFixed(2) + "s",
                },
                color: current_timeline.color,
            },
        });
    }
    // 喊话部分
    for (let [k, v] of Object.entries(store.result.say)) {
        // 仅处理非系统喊话
        if (k != "_system") {
            // 需要建议：是否保留来自不明实体的喊话
            const name = store.result.entities[k] == undefined ? "天外来客" : store.result.entities[k].name;
            const templateID = store.result.entities[k] == undefined ? 0 : store.result.entities[k].templateID;
            for (let value of v) {
                const say_key = "say:" + value.content;
                const current_timeline = selectedTimeline.value[say_key];
                if (!current_timeline || !current_timeline.stat.includes("select")) continue;
                result.push({
                    content: name + "喊话",
                    time: value.time,
                    extra: {
                        tooltip: {
                            内容: value.content,
                            释放者模板ID: templateID,
                            释放者名称: name,
                            施放时间: value.time.toFixed(2) + "s",
                        },
                        color: current_timeline.color,
                    },
                });
            }
        }
    }

    // 模板类部分
    for (let [k, v] of Object.entries(source.templates)) {
        for (let value of v) {
            const template_key = "template:" + value.name;
            const current_timeline = selectedTimeline.value[template_key];
            if (!current_timeline || !current_timeline.stat.includes("select")) continue;
            result.push({
                content: value.name,
                time: value.time,
                extra: {
                    tooltip: {
                        名称: value.name,
                        模板ID: k,
                        数量: value.count,
                        出现时间: value.time.toFixed(2) + "s",
                    },
                    color: current_timeline.color,
                },
            });
        }
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
.timeline-container {
    display: flex;
    .mt(20px);
}
.timeline-selector {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 20px;
    width: 360px; /* 确保左侧的宽度固定 */
}

.m-timeline {
    flex: 1;
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
        max-height: 800px;
        height: auto;
        .scrollbar(#718282, 10px);
    }
}
</style>
