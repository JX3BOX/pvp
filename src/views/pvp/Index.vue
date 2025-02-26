<template>
    <ListLayout>
        <MartialArts />
    </ListLayout>
</template>

<script>
import { useStore } from "@/pages/pvp/store";
import ListLayout from "@/layouts/pvp/ListLayout.vue";
import MartialArts from "@/views/pvp/MartialArts.vue";
export default {
    name: "IndexPage",
    components: {
        ListLayout,
        MartialArts,
    },
    props: [],
    data: function () {
        return {};
    },
    computed: {
        client() {
            return useStore().client;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pvp/index.less";
</style>
