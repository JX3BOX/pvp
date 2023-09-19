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
            <!-- <img class="u-path" src="../../assets/img/1_x653_y140.png" /> -->
            <!-- 1920 * 1080 下，在现有地图的基础上，往右 70px为基准点，往下50像素为基准点,放大1.1倍 -->
            <div class="u-paths" v-if="paths.length">
                <img
                    class="u-path"
                    :class="`u-path__${path.key}`"
                    :style="{ left: path.x + 70 + 'px', top: path.y + 50 + 'px' }"
                    v-for="path in paths"
                    :key="path.key"
                    :src="path.url"
                />
            </div>
        </div>
        <CJIntro v-if="map" :map="map"></CJIntro>
    </div>
</template>

<script>
import { markRaw } from "vue";
import { getMapList } from "@/service/cj";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import CJIntro from "./CJIntro.vue";
import mapPath from "@/assets/data/mapPath.json";
export default {
    name: "CJIndex",
    components: {
        CJIntro,
    },
    data() {
        return {
            loading: false,
            maps: [],
            map: null,
            mapPath: markRaw(mapPath),
            imgRoot: __imgPath + "pve/desert/",
        };
    },
    computed: {
        paths() {
            const paths = this.mapPath.find((item) => item.mapId === this.map)?.paths || [];
            if (paths.length) {
                return paths.map((item) => {
                    return {
                        ...item,
                        url:
                            this.map === 532 && item.key === "c3"
                                ? require("@/assets/img/c3.png")
                                : `${this.imgRoot}${this.map}/${item.key}.png`,
                    };
                });
            }
            return paths;
        },
    },
    methods: {
        loadPath() {},
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
                    if (data[key].indexOf("绝境") > -1 && data[key].indexOf("·") === -1) {
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
