<template>
    <ListLayout>
        <CompetitiveTrick />
    </ListLayout>
</template>

<script>
import { useStore } from "@/store";
import ListLayout from "@/layouts/ListLayout.vue";
import CompetitiveTrick from "@/components/CompetitiveTrick.vue";
export default {
    name: "PostView",
    components: {
        ListLayout,
        CompetitiveTrick,
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

<style lang="less"></style>
