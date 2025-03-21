<template>
    <div class="p-home">
        <div class="m-home">
            <home-slogan></home-slogan>
            <hr class="u-hr" />
            <file-select></file-select>
            <hr class="u-hr" />
            <data-view></data-view>
        </div>
    </div>
</template>

<script setup>
import HomeSlogan from "@/components/jcl/home/home_slogan.vue";
import FileSelect from "@/components/jcl/home/subject_list.vue";
import DataView from "@/components/jcl/home/data_view.vue";

defineComponent({
    name: "HomeIndex",
});
</script>

<style lang="less" scoped>
@import "@/assets/css/jcl/views/home.less";
</style>
