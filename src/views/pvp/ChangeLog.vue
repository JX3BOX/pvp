<template>
    <ListLayout>
        <SkillChange></SkillChange>
    </ListLayout>
</template>

<script>
import { useStore } from "@/pages/pvp/store";
import ListLayout from "@/layouts/pvp/ListLayout.vue";
import SkillChange from "@/components/pvp/SkillChange.vue";
export default {
    name: "ChangeLog",
    components: {
        ListLayout,
        SkillChange,
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
