<template>
    <div class="m-card-list">
        <div class="w-card m-card-item">
            <p class="m-player">
                <img class="u-mount-icon" :src="getMountIcon(entity)" alt="心法" />
                <span class="u-name" :title="getEntityName(entity, { showRegion: true })">{{
                    getEntityName(entity)
                }}</span>
            </p>
            <ul class="m-card-info">
                <li>
                    <span class="u-lable">类型：</span>
                    <span class="u-value"
                        >{{ entityInfo.type == "player" ? "玩家 " : "NPC" }} ({{ entityInfo.id }})</span
                    >
                </li>
                <li>
                    <!-- TODO: 参战时长哪里获取 -->
                    <span class="u-lable">参战时长：</span>
                    <span class="u-value"
                        >{{ displayDuration(fightDuration) || "-" }} ({{ fightDuration ? "100%" : "-" }}%)</span
                    >
                </li>
            </ul>
        </div>
        <div class="w-card m-card-item">
            <entity-card-chart type="damage" />
        </div>
        <div class="w-card m-card-item">
            <entity-card-chart type="treat" />
        </div>
        <div class="w-card m-card-item">
            <entity-card-chart type="beDamaged" />
        </div>
        <div class="w-card m-card-item">
            <entity-card-chart type="beTreated" />
        </div>
    </div>
</template>

<script setup>
import { getMountIcon, getEntityName, getEntity } from "@/utils/jcl/common";
import EntityCardChart from "./entity_card_chart.vue";
import { watchPostEffect } from "vue";
import getWorkerResponse from "@/utils/jcl/worker";
import { usePve } from "@/pages/jcl/store_pve";
import { displayDuration } from "@/utils/jcl/commonNoStore";
const { entity } = toRefs(usePve());
// const { end } = store.result;

const entityInfo = computed(() => {
    return getEntity(entity.value);
});

// 总时长
// const totalDuration = ref(0);
// 战斗时长
const fightDuration = ref(0);

const updateData = () => {
    getWorkerResponse("get_pve_entity_stat_chart", {
        entity: entity.value,
        entityTab: "beDamaged",
    }).then((data) => {
        fightDuration.value = data.overview.duration;
    });
};
watchPostEffect(updateData);
</script>

<style lang="less" scoped>
.m-card-list {
    .flex;
    gap: 30px;
    .m-card-item {
        flex: 1;
        .m-player {
            .flex;
            .mb(20px);
            gap: 10px;
            .u-mount-icon {
                width: 32px;
                height: 32px;
            }
            .u-name {
                .fz(24px,32px);
                .bold;
            }
        }
        .m-card-info {
            .flex;
            flex-direction: column;
            gap: 10px;
        }
        .u-lable {
            .fz(12px,16px);
            color: rgba(255, 255, 255, 0.5);
        }
        .u-value {
            .fz(12px,16px);
            color: #fff;
        }
    }
}
</style>
