<template>
    <div class="m-cj-equipment">
        <div class="u-equipment-item" v-for="item in list" :key="item.key">
            <div class="u-equipment-title">
                {{ item.key }}
                <span v-if="item.values?.[0]?.name.split('·')?.[0]">
                    · {{ item.values?.[0]?.name.split("·")?.[0] }}</span
                >
            </div>
            <div class="u-equipments">
                <div class="u-item" v-for="equipment in item.values" :key="equipment.id" @click="getUrl(equipment.id)">
                    <ItemSimple
                        :item="getItemData(equipment.id)"
                        :only-icon="true"
                        effect="dark"
                        :with-name="false"
                        :no-pop="false"
                        iconSize="32px"
                    />
                </div>
                <el-popover placement="right-start" effect="dark" :width="740" trigger="click">
                    <template #reference>
                        <span class="u-link" @click="toCompare(item.values)">对比</span>
                    </template>
                    <div class="m-desert-compare">
                        <div class="u-compare-item" v-for="equipment in compares" :key="equipment.id">
                            <ItemSimple
                                :item="getItemData(equipment.id)"
                                :only-icon="true"
                                effect="dark"
                                :with-name="true"
                                :no-pop="true"
                                iconSize="32px"
                            />
                            <Item :item_id="equipment.id"></Item>
                        </div>
                    </div>
                </el-popover>
            </div>
        </div>
        <!-- <el-dialog
            v-if="showDialog"
            v-model="showDialog"
            title="装备对比"
            append-to-body
            width="800"
            class="m-desert-compare-pop"
        >
            <div class="m-desert-compare">
                <div class="u-compare-item" v-for="equipment in compares" :key="equipment.id">
                    <ItemSimple
                        :item="getItemData(equipment.id)"
                        :only-icon="true"
                        effect="dark"
                        :with-name="true"
                        :no-pop="true"
                        iconSize="32px"
                    />
                    <Item :item_id="equipment.id"></Item>
                </div>
            </div>
            <template #footer>
                <div class="m-footer">
                    <el-button @click="showDialog = false">取消</el-button>
                </div>
            </template>
        </el-dialog> -->
    </div>
</template>

<script>
import { getBread } from "@/service/raw";
import { getItems, getItem } from "@/service/cj";
import jx3boxData from "@jx3box/jx3box-common/data/jx3box.json";
import { useStore } from "@/store";
const $store = useStore();

import { flattenDeep } from "lodash";

export default {
    name: "CJEquipment",
    data() {
        return {
            showDialog: false,
            pvp_desert_weapon: {}, // 武器
            pvp_desert_equipment: {}, // 装备
            equipments: [],
            weapons: [],
            compares: [],
        };
    },
    computed: {
        allList() {
            return this.equipments.concat(this.weapons);
        },
        subtype: function () {
            return this.$route.query.subtype;
        },
        client() {
            return $store.client;
        },
        baseUrl() {
            return this.client == "origin" ? jx3boxData.__OriginRoot : jx3boxData.__Root;
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
            if (this.subtype && this.pvp_desert_weapon[this.subtype]?.length) {
                list.push({
                    key: "近身武器",
                    values: this.pvp_desert_weapon[this.subtype],
                });
            }
            return list;
        },
        // 所有装备的id数组
        ids() {
            const arr = Object.values(this.pvp_desert_equipment) || [];
            const ids = flattenDeep(arr).map((item) => item.id);
            return ids;
        },
        // 分开 一次最多50条
        weaponIds() {
            const arr = Object.values(this.pvp_desert_weapon);
            const ids = flattenDeep(arr).map((item) => item.id);
            return ids;
        },
    },
    watch: {
        ids(ids) {
            if (ids.length) {
                this.loadItems(ids, "equipments");
            }
        },
        weaponIds(ids) {
            if (ids.length) {
                this.loadItems(ids, "weapons");
            }
        },
    },
    methods: {
        toCompare(item) {
            this.compares = item;
            this.showDialog = true;
        },
        getItemData(id) {
            const item = this.allList.find((item) => item?.id === id);
            if (item?.id) {
                return item;
            }
            getItem(id).then((res) => {
                const item = res.data?.data?.item;
                return item;
            });
            return { id };
        },
        loadKey(key) {
            // 读取本地数据
            const cache = sessionStorage.getItem(key);
            if (cache) {
                this[key] = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                const clientKey = this.client === "origin" ? key + "_origin" : key;
                getBread({ key: clientKey }).then((res) => {
                    const obj = res.data?.data?.[0]?.html || "{}";
                    sessionStorage.setItem(key, obj);
                    this[key] = JSON.parse(obj);
                });
            }
        },
        loadItems(ids, key) {
            // 读取本地数据
            if (!ids.length) return;
            const cache = sessionStorage.getItem(`desert_items_${key}`);
            if (cache) {
                this[key] = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                getItems(ids).then((res) => {
                    let newData = res.data?.list || [];
                    this[key] = newData;
                    // 将数据放入 sessionStorage
                    sessionStorage.setItem(`desert_items_${key}`, JSON.stringify(newData));
                });
            }
        },
        getUrl(id) {
            const url = `/item/view/${id}`;
            window.open(url, "_blank");
        },
    },
    mounted() {
        this.loadKey("pvp_desert_weapon");
        this.loadKey("pvp_desert_equipment");
    },
};
</script>

<style lang="less">
.m-cj-equipment {
    .flex;
    flex-direction: column;
    gap: 10px;
    .u-equipment-item {
        .flex;
        justify-content: space-between;
        align-items: center;
        background-color: @navItemBg;
        padding: 4px 10px;
        .r(4px);
        font-size: 13px;
        .u-equipment-title {
            // color: #999;
            span {
                color: @colorDark;
            }
        }
        .u-equipments {
            .flex;
            gap: 5px;
            justify-content: flex-end;
            align-items: center;
            .u-item {
                .size(32px);
                cursor: pointer;
            }
            & > span {
                margin-left: 10px;
                color: @activeColorDark;
                font-size: 12px;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
}
.m-desert-compare {
    .flex;
    gap: 10px;
    justify-content: center;
    .u-compare-item {
        .flex;
        gap: 10px;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
}
</style>
