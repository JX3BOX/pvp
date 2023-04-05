<template>
    <div class="m-competitive-trick">
        <CompetitiveTrickItemVue v-for="item in data" :key="item.id" :data="item" :subtype="subtype" />
    </div>
</template>

<script>
import { useStore } from "@/store";
import { getPosts } from "@/service/post";

import CompetitiveTrickItemVue from "./trick/CompetitiveTrickItem.vue";

export default {
    name: "CompetitiveTrick",
    components: {
        CompetitiveTrickItemVue,
    },
    data() {
        return {
            data: [],
        };
    },
    computed: {
        subtype() {
            return this.$route.params.subtype;
        },
        client() {
            return useStore().client;
        },
    },
    watch: {
        subtype: {
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    methods: {
        loadData() {
            getPosts({ type: "pvp", subtype: this.subtype, client: this.client })
                .then((res) => {
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/competitive-trick.less";
</style>
