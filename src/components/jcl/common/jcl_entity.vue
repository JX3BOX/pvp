<template>
    <div class="w-entity" :title="title">
        <img class="w-entity-icon" :src="imgSrc" alt="" />
        <span class="w-entity-name">{{ name }}</span>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { getEntityName, getMountIcon } from "@/utils/jcl/common";
const props = defineProps({
    entity: {
        type: [Number, String],
        required: true,
    },
});
const { entity } = toRefs(props);
const title = computed(() => getEntityName(entity.value, { showID: true, showOrder: true, showRegion: true }));
const imgSrc = computed(() => getMountIcon(entity.value));
const name = computed(() => getEntityName(entity.value));
</script>

<style lang="less" scoped>
.w-entity {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-right: 4px;

    .w-entity-icon {
        .size(24px);
    }

    .w-entity-name {
        .ellipsis;
    }
}
</style>
