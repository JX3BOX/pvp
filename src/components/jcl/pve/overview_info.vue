<template>
    <div class="m-card-list">
        <div class="m-card-item">
            <p class="u-label">作战目标</p>
            <p class="u-stress">{{ displayOverview.target }}</p>
            <p class="u-small-value">{{ displayOverview.totalDuration }}</p>
        </div>
        <div class="m-card-item">
            <p class="u-label">总伤害</p>
            <p class="u-value">
                {{ displayOverview.totalDamage?.value }}
                <span class="u-suffix">{{ displayOverview.totalDamage?.unit }}</span>
            </p>
            <p class="u-value">
                {{ displayOverview.teamDps?.value }}
                <span class="u-suffix">{{ displayOverview.teamDps?.unit }}/s</span>
            </p>
        </div>
        <div class="m-card-item">
            <p class="u-label">总治疗</p>
            <p class="u-value">
                {{ displayOverview.totalTreat?.value }}
                <span class="u-suffix">{{ displayOverview.totalTreat?.unit }}</span>
            </p>
            <p class="u-value">
                {{ displayOverview.teamHps?.value }} <span class="u-suffix">{{ displayOverview.teamHps?.unit }}/s</span>
            </p>
        </div>
        <div class="m-card-item">
            <p class="u-label">总承伤</p>
            <p class="u-value">
                {{ displayOverview.totalBeDamaged?.value }}
                <span class="u-suffix">{{ displayOverview.totalBeDamaged?.unit }}</span>
            </p>
            <p class="u-value">
                {{ displayOverview.teamDeDps?.value }}
                <span class="u-suffix">{{ displayOverview.teamDeDps?.unit }}/s</span>
            </p>
        </div>
        <div class="m-card-item">
            <p class="u-label">总承疗</p>
            <p class="u-value">
                {{ displayOverview.totalBeTreat?.value }}
                <span class="u-suffix">{{ displayOverview.totalBeTreat?.unit }}</span>
            </p>
            <p class="u-value">
                {{ displayOverview.teamBeHps?.value }}
                <span class="u-suffix">{{ displayOverview.teamBeHps?.unit }}/s</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { displayDuration, displayBigNumberAndUnit } from "@/utils/jcl/commonNoStore";
import { useStore } from "@/pages/jcl/store";

const store = useStore();
const displayOverview = computed(() => {
    const { stats, entities, end } = store.result;
    if (!entities) return [];
    // 求目标NPC，应该是承伤最高的那个
    let target = "-";
    let maxBeDamaged = 0;
    for (let entity in stats.beDamaged) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") continue;
        const beDamagedValue = stats.beDamaged[entity].value;
        if (beDamagedValue > maxBeDamaged) {
            maxBeDamaged = beDamagedValue;
            target = entities[entity].name;
        }
    }
    // 求全团伤害
    let totalDamage = 0;
    let totalTreat = 0;
    let totalBeDamaged = 0;
    let totalBeTreat = 0;
    for (let entity in stats.damage) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalDamage += stats.damage[entity].value;
        }
    }
    for (let entity in stats.treat) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalTreat += stats.treat[entity].value;
        }
    }
    for (let entity in stats.beDamaged) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalBeDamaged += stats.beDamaged[entity].value;
        }
    }
    for (let entity in stats.beTreated) {
        if (!entities[entity]) continue;
        if (entities[entity].type === "player") {
            totalBeTreat += stats.beTreated[entity]?.value ?? 0;
        }
    }

    return {
        // 作战目标
        target,
        // 总伤害
        totalDamage: displayBigNumberAndUnit(totalDamage),
        // 团队秒伤
        teamDps: displayBigNumberAndUnit(totalDamage / end.sec),
        // 总治疗
        totalTreat: displayBigNumberAndUnit(totalTreat),
        // 团队秒疗
        teamHps: displayBigNumberAndUnit(totalTreat / end.sec),
        // 团队承伤
        totalBeDamaged: displayBigNumberAndUnit(totalBeDamaged),
        // 团队秒承伤
        teamDeDps: displayBigNumberAndUnit(totalBeDamaged / end.sec),
        // 团队承疗
        totalBeTreat: displayBigNumberAndUnit(totalBeTreat),
        // 团队每秒承疗
        teamBeHps: displayBigNumberAndUnit(totalBeTreat / end.sec),
        // 总时长
        totalDuration: displayDuration(end.sec),
    };
});
</script>

<style lang="less" scoped>
.m-card-list {
    .flex;
    gap: 30px;
    width: 100%;
    .m-card-item {
        flex: 1;
        padding: 20px;
        border-radius: 16px;
        background-color: #282828;

        .u-label {
            .fz(14px, 14px);
            margin-bottom: 10px;
        }
        .u-stress {
            .bold;
            .fz(32px,42px);
            margin-bottom: 6px;
        }
        .u-value {
            .fz(24px,30px);
            .bold;
        }
        // .u-suffix {
        //     font-size: 14px;
        // }
        .u-small-value {
            .bold;
            font-size: 12px;
        }
    }
}
</style>
