<template>
    <div class="w-effect" :title="title">
        <img class="w-effect-icon" :src="iconSrc" alt="" />
        <span class="w-effect-name">{{ name }}</span>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import { getResourceName, getResourceIcon } from "@/utils/jcl/common";
const props = defineProps({
    effect: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "skill",
    },
});
const { effect, type } = toRefs(props);
const key = computed(() => {
    const sp = effect.value.split(":");
    if (sp.length > 1) {
        return effect.value;
    } else {
        return `${type.value}:${effect.value}`;
    }
});
const iconSrc = computed(() => getResourceIcon(key.value));
const name = computed(() => getResourceName(key.value));
const title = computed(() => getResourceName(key.value, { showID: true }));
</script>

<style lang="less" scoped>
.w-effect {
    display: flex;
    align-items: center;
    gap: 6px;

    .w-effect-icon {
        .size(24px);
    }

    .w-effect-name {
        .ellipsis;
    }
}
</style>
