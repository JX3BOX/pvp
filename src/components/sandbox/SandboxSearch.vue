<template>
    <div class="m-sandbox-search">
        <span class="u-camp" v-for="(item, key) in camps" :key="key" @click="changeCamp(key)">
            <b :class="key == camp ? 'active' : ''"></b>
            <span>{{ item }}</span>
        </span>
        <el-switch class="u-route" v-model="route" inactive-text="进攻路线"> </el-switch>
        <el-select class="u-server" v-model="id">
            <el-option v-for="item in servers" :key="item.id" :label="item.server" :value="item.id"> </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    name: "SandboxSearch",
    props: ["servers"],
    data: function () {
        return {
            id: 1,
            camp: "haoqi",
            camps: { haoqi: "浩气盟", eren: "恶人谷" },
            route: true,
        };
    },
    computed: {
        serverData: function () {
            return {
                id: this.id,
                route: this.route,
                camp: this.camp,
            };
        },
    },
    watch: {
        serverData: {
            handler() {
                this.toEmit();
            },
            deep: true,
        },
    },
    methods: {
        changeCamp(key) {
            this.camp = key;
        },
        toEmit: function () {
            this.$emit("sandboxChange", this.serverData);
        },
    },
    created: function () {
        this.toEmit();
    },
    mounted: function () {},
};
</script>
