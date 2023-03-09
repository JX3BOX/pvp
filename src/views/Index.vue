<template>
    <div class="p-index">
        Index

        <img src="@/assets/img/test.png" style="width: 32px" />
        <img src="@/assets/img/test.svg" svg-inline style="width: 32px" />
    </div>
</template>

<script>
import { getApi } from "@/service/index";
export default {
    name: "IndexPage",
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    created: function () {
        getApi("params").then((res) => {
            console.log(res);
        });
    },
    components: {},
};
</script>

<style lang="less">
@import "@/assets/css/index.less";
</style>
