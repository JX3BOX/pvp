<template>
    <div class="m-single-nav">
        <Author :uid="uid"></Author>
    </div>
</template>

<script>
import { useStore } from "@/store";
import Author from "@jx3box/jx3box-vue3-ui/src/single/Author.vue";
export default {
    name: "SingleNav",
    components: {
        Author,
    },
    computed: {
        uid() {
            return useStore().userId;
        },
    },
};
</script>
