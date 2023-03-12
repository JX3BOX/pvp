<template>
    <div class="c-sidebar-right-msg">
        <i class="u-icon"><img svg-inline src="@/assets/img/ac.svg" /></i>
        <div class="u-msg">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "RightSide",
    data: function () {
        return {};
    },
};
</script>

<style lang="less">
@import "@/assets/css/right-msg.less";
</style>
