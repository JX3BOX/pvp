<template>
    <div class="m-pvp-sandbox__content" ref="sandboxMap">
        <sandboxSearch :servers="servers" @sandboxChange="onSandbox" />
        <div class="m-sandbox-map">
            <sandboxMaps :maps="sandMaps" :camp="camp" :route="route" @mapClick="mapClick"> </sandboxMaps>
            <sandboxLog :item="itemLog" v-if="showLog" />
        </div>
        <div class="m-mask" v-if="showLog" @click="closeLog"></div>
    </div>
</template>
<script>
import { onClickOutside } from "@vueuse/core";
import sandboxSearch from "@/components/pvp/sandbox/SandboxSearch.vue";
import { getCamplist, getCampLog } from "@/service/pvp/sandbox";
import sandboxMaps from "@/components/pvp/sandbox/SandboxMaps.vue";
import sandboxLog from "@/components/pvp/sandbox/SandboxLog.vue";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
export default {
    name: "SandBox",
    components: {
        sandboxSearch,
        sandboxMaps,
        sandboxLog,
    },
    data: function () {
        return {
            sandMaps: {},
            servers: servers_std,
            itemLog: "",
            route: false,
            camp: "haoqi",
            showLog: false,
            server: servers_std[0] || "",
        };
    },
    computed: {
        parms: function () {
            return {
                server: this.server,
            };
        },
    },
    mounted() {
        onClickOutside(this.$refs.sandboxMap, () => {
            if (this.showLog) {
                this.showLog = false;
            }
        });
    },
    methods: {
        //搜索更改 parms的条件
        onSandbox(data) {
            let { server, camp, route } = data;
            this.server = server;
            this.camp = camp;
            this.route = route;
        },
        //获取沙盘数据 含沙盘攻防路线
        getSandbox() {
            getCamplist(this.parms).then((res) => {
                console.log(res);
                this.sandMaps = { list: res.data.castles };
            });
            this.$emit("sandboxChangeKey", this.server);
        },
        // 点击展示日志
        mapClick(item) {
            getCampLog(this.id, item.id).then((res) => {
                item.list = res.data.data;
                this.itemLog = item;
                this.showLog = true;
            });
        },
        closeLog() {
            this.showLog = false;
        },
    },
    watch: {
        parms: {
            immediate: true,
            deep: true,
            handler: function () {
                this.getSandbox();
            },
        },
    },
};
</script>
<style lang="less">
// @import "~@/assets/css/pvp/sandbox/sandbox.less";
</style>
