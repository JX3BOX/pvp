<template>
    <ListLayout>
        <SandBox />
    </ListLayout>
</template>

<script>
import { useStore } from "@/store";
import ListLayout from "@/layouts/ListLayout.vue";
import SandBox from "@/components/SandBox.vue";
export default {
    name: "SandBoxPage",
    components: {
        ListLayout,
        SandBox,
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
