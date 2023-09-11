<template>
    <div v-loading="loading" class="m-cj-index">
        <div class="m-select">
            <label class="u-label">地图</label>
            <el-select v-model="map">
                <el-option v-for="item in maps" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div v-if="map" class="m-map">
            <img class="u-map" :src="getMapImage(map)" />
        </div>
    </div>
</template>

<script>
import { getMapList } from "@/service/cj";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "CJIndex",
    data() {
        return {
            loading: false,
            maps: [],
            map: null,
        };
    },
    methods: {
        async getMapList() {
            const cache = sessionStorage.getItem("cj_maps");
            if (cache) {
                const list = JSON.parse(cache);
                this.maps = list;
                this.map = list?.[0]?.value || null;
            } else {
                const res = await getMapList();
                const { data } = res;
                const list = [];
                for (let key in data) {
                    if (data[key].indexOf("绝境") > -1) {
                        list.push({
                            label: data[key],
                            value: ~~key,
                        });
                    }
                }
                sessionStorage.setItem("cj_maps", JSON.stringify(list));
                this.maps = list;
                this.map = list?.[0]?.value || null;
            }
        },
        getMapImage(mapId) {
            return `${__imgPath}map/maps/map_${mapId}_0.png`;
        },
    },
    mounted() {
        this.getMapList();
    },
};
</script>

<style lang="less">
@import "@/assets/css/cj/index.less";
</style>
