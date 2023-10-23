<template>
    <div v-if="data.length" class="m-cj-item">
        <div class="u-item" v-for="item in data" :key="item.id" @click="getUrl(item.id)">
            <ItemSimple :item="item" effect="dark" iconSize="32px" />
        </div>
    </div>
    <div v-else class="u-no-data">暂无道具。</div>
</template>

<script>
import { getItems } from "@/service/cj";
import { getBread } from "@/service/raw";
import jx3boxData from "@jx3box/jx3box-common/data/jx3box.json";
import { useStore } from "@/store";
const $store = useStore();
export default {
    name: "CJItem",
    data() {
        return {
            data: [],
            items: [],
            mapId: 0,
        };
    },
    computed: {
        currentMapId() {
            return $store.map || 0;
        },
        ids() {
            const commonIds = this.items.find((item) => item.mapId === 0)?.items || [];
            const mapIds = this.items.find((item) => item.mapId === this.mapId)?.items || [];
            return commonIds.concat(mapIds);
        },
        client() {
            return $store.client;
        },
        baseUrl() {
            return this.client == "origin" ? jx3boxData.__OriginRoot : jx3boxData.__Root;
        },
    },
    watch: {
        currentMapId: {
            immediate: true,
            handler(id) {
                this.mapId = id;
            },
        },
        ids: {
            immediate: true,
            handler() {
                this.loadItems();
            },
        },
    },
    methods: {
        loadMapItems() {
            // 读取本地数据
            const { client } = this;
            const cache = sessionStorage.getItem(`desert_item_ids_${client}`);
            if (cache) {
                this.items = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                const key = this.client === "origin" ? "pvp_desert_items_origin" : "pvp_desert_items";
                getBread({ key }).then((res) => {
                    const arr = res.data?.data?.[0]?.html || "[]";
                    sessionStorage.setItem(`desert_item_ids_${client}`, arr);
                    this.items = JSON.parse(arr);
                });
            }
        },
        loadItems() {
            // 读取本地数据
            const { client, ids, mapId } = this;
            if (!ids.length) return;
            const cache = sessionStorage.getItem(`desert_items_${client}_${mapId}`);
            if (cache) {
                this.data = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                getItems(ids, client).then((res) => {
                    let newData = res.data?.list || [];
                    this.data = newData;
                    // 将数据放入 sessionStorage
                    sessionStorage.setItem(`desert_items_${client}_${mapId}`, JSON.stringify(newData));
                });
            }
        },
        getUrl(id) {
            const url = this.baseUrl + `item/view/${id}`;
            window.open(url, "_blank");
        },
    },
    mounted() {
        this.loadMapItems();
    },
};
</script>

<style lang="less">
.m-cj-item {
    .u-item {
        margin-bottom: 10px;
        cursor: pointer;
    }
}
</style>
