<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link to="/"
                ><el-icon><Collection /></el-icon
            ></router-link>
            <router-link to="/sandbox"
                ><el-icon><Compass /></el-icon
            ></router-link>
        </div>
    </div>
</template>

<script>
import { useStore } from "@/store";

export default {
    name: "BreadRouter",
    props: [],
    data: function () {
        return {};
    },
    computed: {
        client: function () {
            return useStore().client;
        },
    },
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/info.less";
</style>
