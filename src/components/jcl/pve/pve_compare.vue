<template>
    <div>
        <div class="m-compare-header">
            <div>
                <compare-option />
            </div>
            <div class="w-card">
                <compare-card-chart statType="damage" />
            </div>
            <div class="w-card">
                <compare-card-chart statType="treat" />
            </div>
            <div class="w-card">
                <compare-card-chart statType="beDamaged" />
            </div>
            <div class="w-card">
                <compare-card-chart statType="beTreated" />
            </div>
        </div>
        <div v-if="!compareSelectVisible" class="m-compare-main">
            <div class="m-compare-list">
                <compare-player-list :index="1" />
                <compare-player-list :index="2" />
                <compare-player-list :index="3" />
                <compare-player-list :index="4" />
            </div>
            <compare-effect-list />
        </div>
        <div v-else>
            <entity-select
                :isCompare="true"
                :onSelected="onSelected"
                :onSelectEntity="onSelectEntity"
                :entityList="compareEntity"
                :max="4"
            />
        </div>
    </div>
</template>

<script setup>
import { toRefs, watchPostEffect } from "vue";
import { useRouter } from "vue-router";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store.js";

import CompareOption from "./compare_option.vue";
import EntitySelect from "./entity_select.vue";
import CompareCardChart from "./compare_card_chart.vue";
import ComparePlayerList from "./compare_player_list.vue";
import CompareEffectList from "./compare_effect_list.vue";

// import EntitySelect from "./entity_select.vue"
// import CompareChart from "./compare_chart.vue";
// import CompareView from "./compare_view.vue";

const router = useRouter();
const store = useStore();

const { compareMode, compareEntity, compareSelectVisible } = toRefs(usePve());

watchPostEffect(() => {
    const id = store.info?.id;
    if (!id) return;
    const query = {
        id,
        tab: "compare",
    };
    if (compareMode.value) query.compareMode = compareMode.value;
    if (compareEntity.value[0]) query.entity1 = compareEntity.value[0];
    if (compareEntity.value[1]) query.entity2 = compareEntity.value[1];
    if (compareEntity.value[2]) query.entity3 = compareEntity.value[2];
    if (compareEntity.value[3]) query.entity4 = compareEntity.value[3];
    router.replace({ query });
});

const onSelectEntity = (data, value) => {
    if (value) {
        for (let i = 0; i < compareEntity.value.length; i++) {
            const id = compareEntity.value[i];
            if (id == null) {
                compareEntity.value[i] = data.id;
                return;
            }
        }
    } else {
        compareEntity.value = compareEntity.value.map((item) => (item !== data.id ? item : null));
    }
};

const onSelected = () => {
    compareSelectVisible.value = false;
};
</script>

<style lang="less" scoped>
.m-compare-header {
    .flex;
    gap: 30px;
    margin-bottom: 30px;
    > .w-card {
        flex: 1;
    }
}
.m-compare-main {
    display: flex;
    flex-direction: column;
    gap: 30px;
}
.m-compare-list {
    .flex;
    gap: 30px;
}
</style>
