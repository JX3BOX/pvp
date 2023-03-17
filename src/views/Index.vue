<template>
    <ListLayout>
        <MartialArts />
    </ListLayout>
</template>

<script>
import { useStore } from "@/store";
import ListLayout from "@/layouts/ListLayout.vue";
import MartialArts from "@/views/MartialArts.vue";
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
@import "@/assets/css/index.less";
</style>
