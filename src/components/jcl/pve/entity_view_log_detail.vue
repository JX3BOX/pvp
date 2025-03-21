<template>
    <div class="w-card">
        <template v-if="!detail">
            <empty-guide
                v-if="viewType === 'effect'"
                :rotate="-90"
                :tips="['在左侧选择一个目标后', '此处会展示对目标施展的所有技能']"
            ></empty-guide>
            <empty-guide
                v-else-if="viewType === 'target'"
                to="row-reverse"
                :rotate="90"
                text-align="right"
                :tips="['在右侧选择一个目标后', '此处会展示该次技能释放的所有详细数据']"
            ></empty-guide>
        </template>
        <div v-else class="m-entity-skill-wrap">
            <div class="w-card-title">
                第{{ detail.index }}次 {{ getResourceName(detail.effect, { showID: false }) }}
            </div>
            <div class="m-entity-skill-detail">
                <div class="u-left">
                    <div class="u-effect-infos" v-if="detail">
                        <div class="u-effect-info">
                            <span>招式：</span>
                            <img :src="getResourceIcon(detail.effect)" />
                            <span>{{ getResourceName(detail.effect, { showID: false }) }}</span>
                        </div>
                        <div class="u-effect-info">
                            <span>来源：</span>
                            <img :src="getMountIcon(detail.caster)" />
                            <span :title="getEntityName(detail.caster, { showRegion: true })">{{
                                getEntityName(detail.caster)
                            }}</span>
                        </div>
                        <!-- <div class="u-effect-info">
                            <span>施展次数：</span>
                            <span>第 {{ detail.index }} 次</span>
                        </div> -->
                        <div class="u-effect-info">
                            <span>施展时间：</span>
                            <span>{{ displayDigits(detail.micro / 1000) }} s</span>
                        </div>
                        <div class="u-effect-info">
                            <span>实际数值：</span>
                            <span>{{ detail.value }}</span>
                        </div>
                        <div class="u-effect-info">
                            <span>目标：</span>
                            <img :src="getMountIcon(detail.target)" />
                            <span :title="getEntityName(detail.target, { showRegion: true })">{{
                                getEntityName(detail.target)
                            }}</span>
                        </div>
                        <div class="u-effect-info">
                            <span>备注：</span>
                            <span v-if="detail.isCritical">会心</span>
                            <span v-else> - </span>
                        </div>
                    </div>
                </div>
                <div class="u-right w-card">
                    <div class="u-buff-list">
                        <div
                            v-for="(buff, index) in currentData"
                            :key="index"
                            class="u-buff"
                            :title="getResourceName('buff:' + buff.split('*')[0], { showID: tue })"
                        >
                            <img class="u-buff-icon" :src="getResourceIcon('buff:' + buff.split('*')[0])" />
                            <span class="u-buff-stack">{{ buff.split("*")[1] }}</span>
                            <span class="u-buff-name">{{
                                getResourceName("buff:" + buff.split("*")[0], { showID: false })
                            }}</span>
                        </div>
                    </div>

                    <el-pagination
                        class="w-pagination"
                        small
                        background
                        layout="pager"
                        :page-size="pageSize"
                        :total="total"
                        :hide-on-single-page="true"
                        :current-page="currentPage"
                        @update:currentPage="currentPage = $event"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import EmptyGuide from "@/components/jcl/common/empty_guide.vue";
import { getEntityName, getResourceIcon, getResourceName, getMountIcon } from "@/utils/jcl/common";
import { displayDigits } from "@/utils/jcl/commonNoStore";
import { computed, toRefs } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import { usePaginate } from "@/utils/jcl/uses/usePaginate";

const { viewType, effectLog, targetLog } = toRefs(usePve());

const pageSize = ref(20);

const detail = computed(() => {
    if (viewType.value === "effect") return effectLog.value;
    if (viewType.value === "target") return targetLog.value;
    return null;
});
const buffs = computed(() => {
    if (!detail.value) return [];
    return detail.value.buffs;
});

const { total, currentPage, currentData } = usePaginate(buffs, pageSize);
</script>

<style lang="less" scoped>
.m-entity-skill-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.m-entity-skill-detail {
    display: flex;
    flex: 1;
    .u-card-title {
        .fz(14px, 18px);
        color: #b3b3b3;
        margin: 0;
    }

    & > .u-left:not(.u-empty) {
        width: 223px;
        padding-top: 10px;
    }

    & > .u-left {
        flex-shrink: 0;
        // height: 100%;
    }

    & > .u-right {
        display: flex;
        flex: 1;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.1);
        height: 300px;
    }

    .u-effect-infos {
        .bold;
        .fz(14px, 24px);
        .color(white);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        gap: 10px;

        .u-effect-info {
            display: flex;
            align-items: center;
            .ellipsis;
            :first-child {
                color: rgba(255, 255, 255, 0.5);
            }
            img {
                .size(24px);
                .mr(8px);
            }
        }
    }

    .u-buff-list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        color: #b3b3b3;
        align-content: flex-start;
        overflow-y: scroll;
        gap: 10px;
        .fz(12px, 16px);
        .bold;
        .u-buff {
            width: calc(50% - 8px);
            box-sizing: border-box;
            display: flex;
            align-items: center;
            position: relative;
            white-space: nowrap;
            max-height: 18px;
            min-height: 18px;

            .u-buff-icon {
                .size(16px);
                .mr(4px);
                display: block;
            }

            .u-buff-stack {
                position: absolute;
                left: 0px;
                bottom: 0px;
                color: white;
            }

            .u-buff-name {
                .ellipsis;
            }
        }
    }
}
.w-card .el-pagination {
    padding-top: 5px;
}
</style>
