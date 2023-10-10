<template>
    <DarkLayout>
        <h2 class="u-header">绝境战场</h2>
        <div class="m-cj-content">
            <CJIndex></CJIndex>
            <CJExtra></CJExtra>
        </div>
    </DarkLayout>
</template>

<script>
import DarkLayout from "@/layouts/DarkLayout.vue";
import CJIndex from "@/components/cj/CJIndex.vue";
import CJExtra from "@/components/cj/CJExtra.vue";
export default {
    name: "CJ",
    components: { DarkLayout, CJIndex, CJExtra },
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted() {},
};
</script>
<style lang="less" scoped>
.u-header {
    text-align: center;
    margin-top: 0;
    margin-bottom: 10px;
}
.m-cj-content {
    .flex;
    flex-wrap: wrap;
    gap: 20px;
    .m-map-index {
        flex: none;
    }
}
</style>
