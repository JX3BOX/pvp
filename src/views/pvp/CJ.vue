<template>
    <DarkLayout>
        <div class="m-cj-content">
            <div class="m-cj-content__top">
                <CJIndex></CJIndex>
                <CJExtra></CJExtra>
            </div>
            <div class="m-cj-content__bottom">
                <CJIntro></CJIntro>
            </div>
        </div>
    </DarkLayout>
</template>

<script>
import DarkLayout from "@/layouts/pvp/DarkLayout.vue";
import CJIndex from "@/components/pvp/cj/CJIndex.vue";
import CJExtra from "@/components/pvp/cj/CJExtra.vue";
import CJIntro from "@/components/pvp/cj/CJIntro.vue";
export default {
    name: "CJ",
    components: { DarkLayout, CJIndex, CJExtra, CJIntro },
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted() {},
};
</script>
<style lang="less">
.m-cj-content {
    min-width: 1080px;
    overflow: auto;
    .m-cj-content__top {
        .flex;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 20px;
    }
}
</style>
