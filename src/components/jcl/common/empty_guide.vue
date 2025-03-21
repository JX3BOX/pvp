<template>
    <div class="m-empty-guide" :style="innerStyle">
        <img class="u-empty-icon" src="@/assets/img/jcl/common/circle_arrow.svg" :style="iconStyle" />
        <div class="u-empty-tips" :style="tipsStyle">
            <div v-for="(tip, index) in tips" :key="index" class="u-empty-tip">{{ tip }}</div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";

const props = defineProps({
    rotate: {
        type: Number,
        default: 0,
    },
    tips: {
        type: [String, Array],
        default: () => ["在上方选择一项查看详情"],
    },
    to: {
        type: String,
        default: "column",
    },
    position: {
        type: String,
        default: "center",
    },
    align: {
        type: String,
        default: "center",
    },
    textAlign: {
        type: String,
        default: "center",
    },
    grow: {
        type: Boolean,
        default: true,
    },
    size: {
        type: Number,
        default: 95,
    },
});
const { rotate, to, tips, align, textAlign, position, size, grow } = toRefs(props);

const innerStyle = computed(() => ({
    textAlign: textAlign.value,
    alignItems: align.value,
    justifyContent: position.value,
    flexDirection: to.value,
    flexGrow: grow.value ? 1 : 0,
}));
const iconStyle = computed(() => ({
    width: `${size.value}px`,
    height: `${size.value}px`,
    transform: `rotate(${rotate.value}deg)`,
}));
const tipsStyle = computed(() => {
    const result = {
        textAlign: textAlign.value,
    };
    if (to.value == "row" || to.value == "row-reverse") {
        result.height = `${size.value}px`;
        result.justifyContent = "center";
    }
    return result;
});
</script>

<style lang="less">
.m-empty-guide {
    box-sizing: border-box;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 20px;
    color: #717273;
    .bold;
    .fz(20px,26px);
    gap: 20px;

    .u-empty-tips {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>
