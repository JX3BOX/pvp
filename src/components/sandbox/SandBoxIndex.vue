<template>
    <div class="m-pvp-sandbox__content">
        <sandboxSearch :servers="servers" @sandboxChange="onSandbox" />
        <div class="m-sandbox-map">
            <sandboxMap :maps="sandMaps" :camp="camp" :route="route" @mapClick="mapClick"> </sandboxMap>
            <sandboxLog :item="itemLog" v-if="showLog" />
        </div>
        <div class="m-mark" v-if="showLog" @click="closeLog"></div>
    </div>
</template>
<script>
import sandboxSearch from "@/components/sandbox/SandboxSearch.vue";
import sandboxMap from "@/components/sandbox/SandboxMaps.vue";
import sandboxLog from "@/components/sandbox/SandboxLog.vue";
import { getCampDetail, getCamplist, getCampServers, getCampLog } from "@/service/sandbox";
export default {
    name: "SandBox",
    components: {
        sandboxSearch,
        sandboxMap,
        sandboxLog,
    },
    data: function () {
        return {
            sandMaps: "",
            servers: [],
            itemLog: "",

            id: 1,
            camp: "haoqi",
            route: true,

            showLog: false,
        };
    },
    computed: {
        parms: function () {
            return {
                sandmap_id: this.id,
                camp: this.camp,
            };
        },
    },
    methods: {
        //搜索更改 parms的条件
        onSandbox(data) {
            let { id, camp, route } = data;
            this.id = id;
            this.camp = camp;
            this.route = route;
            this.getSandbox();
            for (let i = 0; i < this.servers.length; i++) {
                const element = this.servers[i];
                if (element.id == id) {
                    this.$emit("sandboxChangeKey", element.server);
                    break;
                }
            }
        },
        //获取沙盘数据 含沙盘攻防路线
        getSandbox() {
            getCamplist(this.parms).then((res) => {
                this.id = res.data.sandmap.id;
                this.sandMaps = { ...this.sandMaps, list: res.data.sandmap.castles };
            });
            getCampDetail(this.parms).then((res) => {
                this.id = res.sandmap.id;
                this.sandMaps = { ...this.sandMaps, detail: res.sandmap.maps };
            });
        },
        //获取沙盘服务器列表
        getServers() {
            getCampServers().then((res) => {
                res.data.sandmaps.forEach((l) => {
                    this.servers.push({ id: l.id, server: l.server });
                });
            });
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

    created: function () {
        this.getServers();
        this.getSandbox();
    },
};
</script>
<style lang="less">
// @import "~@/assets/css/sandbox/sandbox.less";
</style>
