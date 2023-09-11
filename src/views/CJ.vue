<template>
    <ListLayout>
        <div class="m-cj-content">
            <CJIndex></CJIndex>
            <CJExtra></CJExtra>
        </div>
    </ListLayout>
</template>

<script>
import ListLayout from "@/layouts/ListLayout.vue";
import CJIndex from "@/components/cj/CJIndex.vue";
import CJExtra from "@/components/cj/CJExtra.vue";
export default {
    name: "CJ",
    components: { ListLayout, CJIndex, CJExtra },
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted() {},
};
</script>
