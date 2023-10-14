<template>
    <DarkLayout>
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
.m-cj-content {
    .flex;
    flex-wrap: wrap;
    gap: 20px;
    .m-map-index {
        flex: none;
    }
}
</style>
