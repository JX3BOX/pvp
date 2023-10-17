<template>
    <ListLayout>
        <SkillChange></SkillChange>
    </ListLayout>
</template>

<script>
import { useStore } from "@/store";
import ListLayout from "@/layouts/ListLayout.vue";
import SkillChange from "@/components/SkillChange.vue";
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
