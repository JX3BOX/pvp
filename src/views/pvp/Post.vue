<template>
    <ListLayout>
        <CompetitiveTrick />
    </ListLayout>
</template>

<script>
import { useStore } from "@/pages/pvp/store";
import ListLayout from "@/layouts/pvp/ListLayout.vue";
import CompetitiveTrick from "@/components/pvp/CompetitiveTrick.vue";
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
