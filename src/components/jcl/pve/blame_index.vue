<template>
    <div class="m-pve-blame">
        <!-- 左上角筛选单位/将单位加入候选列表的部分 -->
        <div class="u-left">
            <BlameFilters :data="data"></BlameFilters>
        </div>
        <div class="u-right">
            <BlameList :data="data"></BlameList>
        </div>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store";

import BlameFilters from "./blame_filters.vue";
import BlameList from "./blame_list.vue";

const store = useStore();
const { blame_filters } = toRefs(usePve());

// 相关的数据（因为这个功能数据量不会很大
// 所以不需要太复杂
const data = computed(() => {
    const { buff_blame, player_death } = store.result;
    const result = [];
    if (blame_filters.value.death) {
        for (const player_id in player_death) {
            for (const death of player_death[player_id]) {
                result.push({
                    playerId: player_id,
                    time: death.time,
                    event: "重伤",
                    detail: death,
                });
            }
        }
    }
    if (blame_filters.value.buff) {
        for (const player_id in buff_blame) {
            for (const buff_id in buff_blame[player_id]) {
                for (const buff of buff_blame[player_id][buff_id]) {
                    result.push({
                        playerId: player_id,
                        time: buff.time,
                        event: "BUFF",
                        detail: buff,
                    });
                }
            }
        }
    }

    return result.sort((a, b) => a.time - b.time);
}, [store.result]);
</script>

<style lang="less" scoped>
.m-pve-blame {
    .mt(20px);
    display: flex;
    gap: 20px;

    .u-right {
        height: 760px;
        flex-grow: 1;
        display: flex;
        gap: 20px;
    }
}
</style>
