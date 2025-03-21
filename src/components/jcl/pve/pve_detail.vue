<template>
    <div>
        <entity-select
            v-if="entitySelectVisible"
            :entityList="entityList"
            :onSelected="onSelected"
            :onSelectEntity="onSelectEntity"
        />
        <div v-else>
            <pve-header-bar />
            <div class="m-main">
                <detail-info />
                <player-qixue />
                <detail-chart />
                <entity-view-effect />
                <entity-view-skill />
                <entity-view-buff />
            </div>
        </div>
    </div>
</template>

<script setup>
import PveHeaderBar from "@/components/jcl/pve/header_bar.vue";
import DetailInfo from "@/components/jcl/pve/detail_info.vue";
import EntityViewEffect from "./entity_view_effect.vue";
import EntityViewSkill from "./entity_view_skill.vue";
import EntityViewBuff from "./entity_view_buff.vue";
import PlayerQixue from "@/components/jcl/pve/player_qixue.vue";

import DetailChart from "@/components/jcl/pve/detail_chart.vue";
import EntitySelect from "@/components/jcl/pve/entity_select.vue";
import { usePve } from "@/pages/jcl/store_pve";
const { entityList, entity, entitySelectVisible } = toRefs(usePve());

const onSelectEntity = (data, v) => {
    if (v) {
        entityList.value.push(data.id);
        if (!entity.value) {
            entity.value = entityList.value[0];
        }
    } else {
        entityList.value = entityList.value.filter((item) => item !== data.id);
        if (entity.value === data.id) {
            entity.value = entityList.value[0];
        }
    }
};
const onSelected = () => {
    entitySelectVisible.value = false;
};
onBeforeMount(() => {
    if (entityList.value.length <= 0) {
        entitySelectVisible.value = true;
    }
});
</script>

<style lang="less" scoped>
.m-main {
    .flex;
    gap: 30px;
    flex-direction: column;
    gap: 30;
}
</style>
