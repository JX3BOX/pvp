<template>
    <div class="m-logs-filter w-card">
        <div class="w-card-title">
            <div>过滤</div>
            <div>
                <el-button @click="exportBox.open()">
                    <img src="@/assets/img/jcl/pve/excel.svg" alt="" />
                </el-button>
                <el-button
                    @click="
                        updateKeyword();
                        emits('apply');
                    "
                    style="color: #939393"
                >
                    <img svg-inline src="@/assets/img/jcl/pve/save.svg" alt="" />
                </el-button>
            </div>
        </div>
        <!-- 常规 -->
        <div class="m-filter-items">
            <div class="m-filter-title">
                <div>常规</div>
                <div class="u-button" @click="isExpansion1 = !isExpansion1">
                    <el-icon v-if="isExpansion1"><Minus /></el-icon>
                    <el-icon v-if="!isExpansion1"><Plus /></el-icon>
                </div>
            </div>
            <template v-if="isExpansion1">
                <div class="m-filter-item">
                    <div class="u-text">反击事件</div>
                    <div class="u-options">
                        <div
                            class="u-option"
                            @click="logFilter.hideReact = false"
                            :class="{ 'is-active': !logFilter.hideReact }"
                        >
                            显示
                        </div>
                        <div
                            class="u-option"
                            @click="logFilter.hideReact = true"
                            :class="{ 'is-active': logFilter.hideReact }"
                        >
                            隐藏
                        </div>
                    </div>
                </div>
                <div class="m-filter-item">
                    <div class="u-text">无数值技能效果</div>
                    <div class="u-options">
                        <div
                            class="u-option"
                            @click="logFilter.hideNoValue = false"
                            :class="{ 'is-active': !logFilter.hideNoValue }"
                        >
                            显示
                        </div>
                        <div
                            class="u-option"
                            @click="logFilter.hideNoValue = true"
                            :class="{ 'is-active': logFilter.hideNoValue }"
                        >
                            隐藏
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <!-- 时间筛选 -->
        <div class="m-filter-items">
            <div class="m-filter-title">
                <div>时间筛选</div>
                <div class="u-button" @click="isExpansion2 = !isExpansion2">
                    <el-icon v-if="isExpansion2"><Minus /></el-icon>
                    <el-icon v-if="!isExpansion2"><Plus /></el-icon>
                </div>
            </div>
            <div v-if="isExpansion2" class="u-filters">
                <div class="u-time-range">
                    <el-input type="number" v-model.number="logFilter.timeRange[0]" size="large"></el-input>
                    <span>~</span>
                    <el-input type="number" v-model.number="logFilter.timeRange[1]" size="large"></el-input>
                </div>
                <div class="u-time-slider">
                    <el-slider v-model="logFilter.timeRange" range :max="maxTime" :min="-5" :show-tooltip="false" />
                </div>
            </div>
        </div>
        <!-- 单位 -->
        <div class="m-filter-items">
            <div class="m-filter-title">
                <div>单位</div>
                <div class="u-button" @click="isExpansion3 = !isExpansion3">
                    <el-icon v-if="isExpansion3"><Minus /></el-icon>
                    <el-icon v-if="!isExpansion3"><Plus /></el-icon>
                </div>
            </div>
            <template v-if="isExpansion3">
                <div class="m-filter-item">
                    <div class="u-text">指定单位</div>
                    <div class="u-select">
                        <el-select
                            v-model="logFilter.entities"
                            multiple
                            collapse-tags
                            filterable
                            clearable
                            placeholder="请选择单位"
                            popper-class="m-select-popper"
                            effect="dark"
                            size="small"
                        >
                            <el-option
                                v-for="entity in entities"
                                :key="entity.id"
                                :value="entity.id"
                                :label="getEntityName(entity.id)"
                            >
                                <div class="u-entity">
                                    <img class="u-entity-icon" :src="getMountIcon(entity.id)" />
                                    <span class="u-entity-name">{{ getEntityName(entity.id) }}</span>
                                </div>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div v-for="(item, index) in filterOptions2" :key="index" class="m-filter-item">
                    <div class="u-text">{{ item.text }}</div>
                    <div class="u-options">
                        <div
                            class="u-option"
                            @click="logFilter[item.model] = true"
                            :class="{ 'is-active': logFilter[item.model] }"
                        >
                            显示
                        </div>
                        <div
                            class="u-option"
                            @click="logFilter[item.model] = false"
                            :class="{ 'is-active': !logFilter[item.model] }"
                        >
                            隐藏
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <!-- 事件 -->
        <div class="m-filter-items">
            <div class="m-filter-title">
                <div>事件</div>
                <div class="u-button" @click="isExpansion4 = !isExpansion4">
                    <el-icon v-if="isExpansion4"><Minus /></el-icon>
                    <el-icon v-if="!isExpansion4"><Plus /></el-icon>
                </div>
            </div>
            <template v-if="isExpansion4">
                <div v-for="(item, index) in filterOptions3" :key="index" class="m-filter-item">
                    <div class="u-text">{{ item.text }}</div>
                    <div class="u-options">
                        <div
                            class="u-option"
                            @click="onShowTypesChange(item.model)"
                            :class="{ 'is-active': logFilter.showTypes.includes(item.model) }"
                        >
                            显示
                        </div>
                        <div
                            class="u-option"
                            @click="onShowTypesChange(item.model)"
                            :class="{ 'is-active': !logFilter.showTypes.includes(item.model) }"
                        >
                            隐藏
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <!-- 关键词 -->
        <div class="m-filter-items">
            <div class="m-filter-title">
                <div>关键词</div>
                <div class="u-button" @click="isExpansion5 = !isExpansion5">
                    <el-icon v-if="isExpansion5"><Minus /></el-icon>
                    <el-icon v-if="!isExpansion5"><Plus /></el-icon>
                </div>
            </div>
            <template v-if="isExpansion5">
                <div class="m-filter-item u-column">
                    <div class="u-text">搜索</div>
                    <div class="u-filter-input">
                        <el-input
                            v-model="keywordStr"
                            size="large"
                            placeholder="输入关键词，多个关键词使用空格分隔"
                            @change="inputChange"
                            :class="{ 'is-fill': keywordStr }"
                        ></el-input>
                    </div>
                </div>
                <div class="m-filter-item u-column">
                    <div class="u-text">过滤</div>
                    <div class="u-filter-input">
                        <el-input
                            v-model="hideKeywordStr"
                            size="large"
                            placeholder="输入关键词，多个关键词使用空格分隔"
                            @change="inputChange"
                            :class="{ 'is-fill': hideKeywordStr }"
                        ></el-input>
                    </div>
                </div>
            </template>
        </div>
        <!-- 按钮 -->
        <div class="m-fillter-apply">
            <el-button
                block
                @click="
                    updateKeyword();
                    emits('apply');
                "
            >
                <img svg-inline class="u-apply-icon" src="@/assets/img/jcl/pve/save.svg" alt="" />
                应用筛选</el-button
            >

            <!-- 自动应用 -->
            <div class="m-fillter-auto" @click.stop="autoSearchCheck = !autoSearchCheck">
                <div class="u-box" @click="logAutoApply = !logAutoApply">
                    <img
                        v-if="logAutoApply"
                        width="18"
                        style="margin-right: -1.5px"
                        src="@/assets/img/jcl/pve/checkbox_circle.svg"
                        alt=""
                    />
                    <div v-else class="u-circle"></div>
                    <p class="u-text">自动应用筛选</p>
                </div>
            </div>
        </div>

        <export-dialog ref="exportBox"></export-dialog>
    </div>
</template>

<script setup>
import ExportDialog from "@/components/jcl/export_dialog.vue";
import { getMountIcon, getEntityName } from "@/utils/jcl/common";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store";
import { toRefs, computed, onMounted, ref } from "vue";
import { throttle } from "lodash-es";

// emit
const emits = defineEmits(["apply"]);

// data
const store = useStore();
const { logFilter, logAutoApply } = toRefs(usePve());

const isExpansion1 = ref(false);
const isExpansion2 = ref(false);
const isExpansion3 = ref(true);
const isExpansion4 = ref(true);
const isExpansion5 = ref(true);

const autoSearchCheck = ref(true);

const filterOptions2 = [
    { text: "有名字的实体", model: "selectOnlyName" },
    { text: "无归属的实体", model: "selectOnlyNoSon" },
    { text: "只出现过一次的实体", model: "selectOnlyNoRepeat" },
    { text: "所选实体为事件来源的事件", model: "onlySource" },
];

const filterOptions3 = [
    { text: "单位的出现与消失", model: "scene" },
    { text: "系统信息和NPC喊话", model: "say" },
    { text: "技能产生效果", model: "skill" },
    { text: "技能释放和释放结果", model: "skillCast" },
    { text: "BUFF更新", model: "buff" },
    { text: "击杀与死亡", model: "kill" },
    { text: "单位状态更新", model: "entityStatus" },
];

// computed
const entities = computed(() => {
    return Object.values(store.result?.entities).filter((e) => {
        if (logFilter.value.selectOnlyName && !e.name) return false;
        if (logFilter.value.selectOnlyNoSon && e.belongID) return false;
        if (logFilter.value.selectOnlyNoRepeat && e.appearOrder > 1) return false;
        return true;
    });
});
const maxTime = computed(() => store?.result?.end?.sec + 5 || 120);
const keywordStr = ref("");
const hideKeywordStr = ref("");
const exportBox = ref(null);

// methods

const onShowTypesChange = (val) => {
    if (logFilter.value.showTypes.includes(val)) {
        logFilter.value.showTypes = logFilter.value.showTypes.filter((v) => v !== val);
    } else {
        logFilter.value.showTypes.push(val);
    }
};
const getKeywords = (type) => {
    let target = type === "hide" ? hideKeywordStr.value : keywordStr.value;
    if (!target) return null;
    let keywords = [];
    let resources = store.result.resources;
    let ks = target.split(/\s/);
    for (let k of ks) {
        if (!k) continue;
        const resourceMatch = (resource, k) => {
            if (resource.name && resource.name.includes(k)) return true;
            if (resource.desc && resource.desc.includes(k)) return true;
            if (resource.remark && resource.remark.includes(k)) return true;
            return false;
        };
        let includes = Object.keys(resources).filter((r) => resourceMatch(resources[r], k));
        for (let include of includes) {
            let type = include.split(":")[0];
            let id = include.split(":")[1];
            if (id.split("_").length > 1) id = id.split("_")[0];
            keywords.push({ type, id });
        }
        keywords.push({ type: "str", text: k });
    }
    return keywords;
};
const updateKeyword = () => {
    logFilter.value.keyword = getKeywords();
    logFilter.value.hideKeyword = getKeywords("hide");
};
const inputChange = throttle(() => {
    updateKeyword();
}, 1000);

onMounted(() => {
    logFilter.value.timeRange[1] = maxTime.value;
});
</script>

<style lang="less">
.m-logs-filter {
    .pr;
    .flex;
    flex-direction: column;
    gap: 20px;
    width: 360px;
    min-width: 360px;
    .w-card-title {
        display: flex;
        justify-content: space-between;
    }

    .m-filter-items {
        .flex;
        flex-direction: column;
        gap: 20px;
        .m-filter-title {
            .fz(14px,18px);
            .bold;
            border-left: 2px solid rgba(255, 105, 180, 1);
            padding-left: 4px;

            display: flex;
            justify-content: space-between;
            .u-button {
                cursor: pointer;
                width: 18px;
                height: 18px;
            }
        }
        .m-filter-item {
            .flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 10px;
            &.u-column {
                align-items: start;
                flex-direction: column;
                gap: 10px;
            }
            .u-text {
                .fz(14px,18px);
                .bold;
                border-left: 2px solid rgba(255, 105, 180, 1);
                padding-left: 4px;
            }
            .u-options {
                .flex;
                gap: 20px;
                .u-option {
                    .fz(14px,18px);
                    .bold;
                    color: #939393;
                    cursor: pointer;
                    .fz(14px,18px);
                    &.is-active {
                        color: #fff;
                    }
                }
            }
            .u-filter-input {
                width: 100%;
                .el-input {
                    width: 100%;
                    .el-input__wrapper {
                        box-shadow: none;
                        background: #1c1c1c;
                    }
                }
            }
            .u-select {
                .el-select__wrapper {
                    min-width: 118px;
                }
            }
        }
    }
    .m-fillter-apply {
        width: 100%;
        .el-button {
            .bold;
            font-size: 20px;
            width: 100%;
            height: 52px;
            line-height: 52px;
            .u-apply-icon {
                width: 30px;
                height: 30px;
                // color: #fff;x
                margin-bottom: 2px;
                margin-right: 5px;
            }
        }
    }

    .m-fillter-auto {
        .u-box {
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            cursor: pointer;
            .u-circle {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: rgba(147, 147, 147, 1);
                position: relative;
                img {
                    position: absolute;
                    z-index: 99;
                }
            }
            .u-text {
                .fz(14px,18px);
                .bold;
                color: #939393;
            }
        }
    }
    .u-time-range {
        .flex;
        align-items: center;
        justify-content: space-between;
        .el-input {
            flex: 1;
            border-radius: 5px;
            .el-input__inner {
                text-align: center;
            }
        }

        span {
            .bold;
            font-size: 14px;
            color: white;
            margin: 0 8px;
        }
    }
    .u-time-slider {
        // 滑动条轨道
        .el-slider__runway {
            background-color: #000;
        }
        // 滑动条覆盖部分
        .el-slider__bar {
            background-color: #535353;
        }
        // 滑动条按钮
        .el-slider__button {
            border: none;
            background-color: #535353;
        }
    }
}

.m-select-popper {
    .el-select-dropdown__item {
        height: 32px;
    }
    .u-entity {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .u-entity-icon {
        .size(20px, 20px);
    }

    .u-entity-name {
        color: #fff;
        display: block;
        flex-grow: 1;
    }
}
</style>
