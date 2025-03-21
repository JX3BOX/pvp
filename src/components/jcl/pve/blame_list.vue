<template>
    <div class="w-card m-blame-list">
        <template v-for="(event, index) in data" :key="index">
            <div class="u-event" @click="selectedEvent = event">
                <template v-if="event.event === 'BUFF'">
                    <div class="u-event__buff">
                        <div v-if="event.time < 60" class="u-time">{{ ~~event.time }}秒</div>
                        <div v-else class="u-time">{{ ~~(event.time / 60) }}分{{ ~~(event.time % 60) }}秒</div>
                        <div class="u-meta">
                            <div class="u-type is-buff">吃 Buff 吃饱了！</div>
                        </div>
                        <div class="u-detail">
                            <jcl-entity :entity="event.playerId"></jcl-entity>
                            <img class="u-eat-icon" src="@/assets/img/jcl/pve/eat.svg" alt="" />
                            <jcl-effect :effect="String(event.detail.buff_id)" type="buff"></jcl-effect>
                            <span>{{ event.detail.stack }} 层</span>
                        </div>
                    </div>
                </template>
                <template v-else-if="event.event === '重伤'">
                    <div class="u-event__death">
                        <div v-if="event.time < 60" class="u-time">{{ ~~event.time }}秒</div>
                        <div v-else class="u-time">{{ ~~(event.time / 60) }}分{{ ~~(event.time % 60) }}秒</div>
                        <div class="u-meta">
                            <div class="u-type is-death">被嘎啦！</div>
                        </div>
                        <div class="u-detail">
                            <jcl-entity :entity="event.playerId"></jcl-entity>
                            <img class="u-grave-icon" src="@/assets/img/jcl/pve/grave.svg" alt="" />
                            <jcl-entity :entity="event.detail.killerId"></jcl-entity>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
    <div class="w-card m-blame-detail">
        <div class="w-card-title">事件详情</div>
        <empty-guide v-if="!selectedEvent" :rotate="-90" :tips="['在左侧选择一条记录', '查看记录详情']"></empty-guide>
        <template v-else>
            <template v-if="selectedEvent.event == 'BUFF'">
                <div class="u-detail-item">
                    <span class="u-detail-label">时间：</span>
                    <span>{{ selectedEvent.detail.time }}</span>
                </div>
                <div class="u-detail-item">
                    <span class="u-detail-label">BUFF ID：</span>
                    <span>{{ selectedEvent.detail.buff_id }}</span>
                </div>
                <div class="u-detail-item">
                    <span class="u-detail-label">Buff：</span>
                    <jcl-effect :effect="String(selectedEvent.detail.buff_id)" type="buff"></jcl-effect>
                </div>
                <div class="u-detail-item">
                    <span class="u-detail-label">Buff 层数：</span>
                    <span>{{ selectedEvent.detail.stack }}</span>
                </div>
                <div class="u-detail-item">
                    <span class="u-detail-label">Buff 来源：</span>
                    <jcl-entity :entity="selectedEvent.detail.source"></jcl-entity>
                </div>
            </template>
            <template v-if="selectedEvent.event == '重伤'">
                <div class="u-damage-detail">
                    <el-table class="u-table w-table" :data="selectedEvent.detail.detail" :border="false">
                        <el-table-column label="时间">
                            <template #default="{ row }">
                                <span>{{ displayDigits(row.micro / 1000) + "s" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="来源">
                            <template #default="{ row }">
                                <span>{{ getEntityName(row.caster) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="招式">
                            <template #default="{ row }">
                                <span>{{ getResourceName(row.effect) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数值">
                            <template #default="{ row }">
                                <span>{{ row.value }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="会心">
                            <template #default="{ row }">
                                <span>{{ row.isCritical ? "会心" : "-" }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="w-card-title">携带BUFF列表</div>
                <div class="u-buff-detail">
                    <div
                        v-for="(buff, index) in selectedEvent.detail.buff"
                        :key="index"
                        class="u-buff"
                        :title="getResourceName('buff:' + buff.split('*')[0], { showID: true })"
                    >
                        <img class="u-buff-icon" :src="getResourceIcon('buff:' + buff.split('*')[0])" />
                        <span class="u-buff-stack">{{ buff.split("*")[1] }}</span>
                        <span class="u-buff-name">{{
                            getResourceName("buff:" + buff.split("*")[0], { showID: true })
                        }}</span>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup>
import { toRefs, ref } from "vue";
import JclEntity from "../common/jcl_entity.vue";
import JclEffect from "../common/jcl_effect.vue";
import EmptyGuide from "@/components/jcl/common/empty_guide.vue";
import { getResourceName, getResourceIcon, getEntityName } from "@/utils/jcl/common";
import { displayDigits } from "@/utils/jcl/commonNoStore";

const props = defineProps({
    data: Array,
});
const { data } = toRefs(props);

const selectedEvent = ref(null);
</script>

<style lang="less" scoped>
.m-blame-list {
    gap: 0;
    flex-grow: 1;
    overflow: auto;
    .scrollbar(#333, 10px);

    .u-eat-icon {
        .size(36px);
        filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);
    }
    .u-grave-icon {
        .size(36px);
        filter: invert(0.5) sepia(1) saturate(5) hue-rotate(90deg);
    }
    .u-event {
        border-bottom: 1px solid #ebeef522;
        padding: 16px 0;
        .pointer;
        &:hover {
            background-color: #ebeef522;
        }
    }
    .u-meta,
    .u-detail {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .u-detail {
        .mt(8px);
    }
    .u-type {
        .bold;

        &.is-buff {
            color: #2294f6;
        }
        &.is-death {
            color: #f56c6c;
        }
    }
    .u-time {
        float: left;
    }
}
.m-blame-detail {
    width: 360px;

    gap: 20px;
    .u-detail-item {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
    }

    .u-detail-label {
        .fz(14px);
        color: #999;
    }

    .u-damage-detail {
        max-height: 300px;
        flex-shrink: 0;
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 20px;
        .scrollbar(#333, 4px);
    }

    .u-buff-detail {
        max-height: 360px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        color: #fff;
        gap: 8px;
        .fz(12px, 16px);
        .bold;
        overflow-y: auto;
        .scrollbar(#333, 4px);

        .u-buff {
            .size(120px, 24px);
            display: flex;
            align-items: center;
            position: relative;
            white-space: nowrap;

            .u-buff-icon {
                .size(24px);
                .mr(4px);
                display: block;
            }

            .u-buff-stack {
                position: absolute;
                left: 14px;
                top: 10px;
                color: white;
            }

            .u-buff-name {
                .ellipsis;
            }
        }
    }
}
</style>
