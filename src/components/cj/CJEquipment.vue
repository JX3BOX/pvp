<template>
    <div class="m-cj-equipment">
        <div class="u-equipment-item" v-for="item in list" :key="item.key">
            <div class="u-title">
                {{ item.key }}
            </div>
            <div class="u-equipments" v-for="equipment in item.values" :key="equipment.id">
                {{ equipment.name }}
                <ItemSimple :item="getItemData(equipment.id)" :only-icon="true" effect="dark" iconSize="32px" />
                <!-- <Item :item_id="equipment.id"></Item> -->
            </div>
        </div>
    </div>
</template>

<script>
import { getBread } from "@/service/raw";
import { getItems } from "@/service/cj";
// import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { useStore } from "@/store";
const $store = useStore();
// import xfMap from "@jx3box/jx3box-data/data/xf/xf.json";

import { flattenDeep } from "lodash";

export default {
    name: "CJEquipment",
    data() {
        return {
            pvp_desert_weapon: {}, // 武器
            pvp_desert_equipment: {}, // 装备
            data: [],
        };
    },
    computed: {
        subtype: function () {
            return this.$route.query.subtype;
        },
        client() {
            return $store.client;
        },
        // 根据心法组合后的装备
        list() {
            const list = [];
            for (const [key, values] of Object.entries(this.pvp_desert_equipment)) {
                list.push({
                    key,
                    values,
                });
            }
            return list;
        },
        // 所有装备武器的id数组
        ids() {
            const ids = flattenDeep(this.list.map((item) => item?.values || [])).map((item) => item.id);
            return ids;
        },
    },
    watch: {
        ids(ids) {
            if (ids.length) {
                this.loadItems();
            }
        },
    },
    methods: {
        getItemData(id) {
            return this.data.find((item) => item.id === id) || { id };
        },
        loadKey(key) {
            // 读取本地数据
            const cache = sessionStorage.getItem(key);
            if (cache) {
                this[key] = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                getBread({ key }).then((res) => {
                    const obj = res.data?.data?.[0]?.html || "{}";
                    sessionStorage.setItem(key, obj);
                    this[key] = JSON.parse(obj);
                });
            }
        },
        loadItems() {
            // 读取本地数据
            const { ids } = this;
            if (!ids.length) return;
            const cache = sessionStorage.getItem(`desert_items_equipments_weapons`);
            if (cache) {
                this.data = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                getItems(ids).then((res) => {
                    let newData = res.data?.list || [];
                    this.data = newData;
                    // 将数据放入 sessionStorage
                    sessionStorage.setItem(`desert_items_equipments_weapons`, JSON.stringify(newData));
                });
            }
        },
    },
    mounted() {
        this.loadKey("pvp_desert_weapon");
        this.loadKey("pvp_desert_equipment");
    },
};
</script>

<style lang="less"></style>
