<template>
    <MapLayout>
        <h1 class="u-header">绝境战场</h1>
        <div class="m-cj-content">
            <CJIndex></CJIndex>
            <CJExtra></CJExtra>
        </div>
    </MapLayout>
</template>

<script>
import MapLayout from "@/layouts/MapLayout.vue";
import CJIndex from "@/components/cj/CJIndex.vue";
import CJExtra from "@/components/cj/CJExtra.vue";
export default {
    name: "CJ",
    components: { MapLayout, CJIndex, CJExtra },
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
    gap: 20px;
    .m-map-index {
        flex: none;
    }
    .m-cj-extra {
        flex: 1;
    }
}
</style>
