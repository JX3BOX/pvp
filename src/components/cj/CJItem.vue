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
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { useStore } from "@/store";
const $store = useStore();
export default {
    name: "CJItem",
    data() {
        return {
            visible: false,
            list: [
                {
                    Name: "月影沙",
                    id: "5_32265",
                },
                {
                    Name: "宽叶草伪装",
                    id: "5_32654",
                },
                {
                    Name: "沧溟石伪装",
                    id: "5_32647",
                },
            ],
            data: [],
        };
    },
    computed: {
        ids() {
            return this.list.map((item) => item.id).join(",");
        },
        client() {
            return $store.client;
        },
    },
    watch: {
        ids: {
            immediate: true,
            handler() {
                this.loadItems();
            },
        },
    },
    methods: {
        loadItems() {
            // 读取本地数据
            const { client, ids } = this;
            if (!ids) return;
            const cache = sessionStorage.getItem(`desert_items_${client}`);
            if (cache) {
                this.data = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                getItems(ids, client).then((res) => {
                    let newData = res.data?.list || [];
                    this.data = newData;
                    // 将数据放入 sessionStorage
                    sessionStorage.setItem(`desert_items_${client}`, JSON.stringify(newData));
                });
            }
        },
        getUrl(id) {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `item/view/${id}`;
            window.open(url, "_blank");
        },
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
