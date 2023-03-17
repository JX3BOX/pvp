<template>
    <AppLayout slug="sandbox">
        <div class="p-pxp-sandbox">
            <sandboxSearch :servers="servers" @sandboxChange="onSandbox" />
            <div class="m-sandbox-map">
                <sandboxMap :maps="sandMaps" :camp="camp" :route="route" @mapClick="mapClick"> </sandboxMap>
                <sandboxLog :item="itemLog" v-if="showLog" />
            </div>
            <div class="m-mark" v-if="showLog" @click="closeLog"></div>
        </div>
    </AppLayout>
</template>

<script>
import { useStore } from "@/store";
import AppLayout from "@/layouts/AppLayout.vue";
import sandboxSearch from "@/components/sandbox/search.vue";
import sandboxMap from "@/components/sandbox/maps.vue";
import sandboxLog from "@/components/sandbox/log.vue";
import { getCampDetail, getCamplist, getCampServers, getCampLog } from "@/service/sandbox";
export default {
    name: "SandBoxPage",
    components: {
        AppLayout,
        sandboxSearch,
        sandboxMap,
        sandboxLog,
    },
    props: [],
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
        client() {
            return useStore().client;
        },
        params: function () {
            return {
                sandmap_id: this.id,
                camp: this.camp,
            };
        },
    },
    mounted() {
        this.getServers();
        this.getSandbox();
    },
    methods: {
        //搜索更改 parms的条件
        onSandbox(data) {
            let { id, camp, route } = data;
            this.id = id;
            this.camp = camp;
            this.route = route;
            this.getSandbox();
        },
        //获取沙盘数据 含沙盘攻防路线
        getSandbox() {
            getCamplist(this.params).then((res) => {
                this.id = res.data.sandmap.id;
                this.sandMaps = { ...this.sandMaps, list: res.data.sandmap.castles };
            });
            getCampDetail(this.params).then((res) => {
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
};
</script>

<style lang="less">
@import "@/assets/css/index.less";
@import "~@/assets/css/sandbox.less";
</style>
