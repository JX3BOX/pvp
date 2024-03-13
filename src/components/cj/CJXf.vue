<template>
    <!-- 吃鸡心法 -->
    <div class="m-cj-xf">
        <div class="m-xf-select">
            <div class="u-logo" :class="currentLogo.alt === '门派心法' && 'is-logo'">
                <img :src="currentLogo.src" :alt="currentLogo.alt" />
            </div>
            <el-select class="u-select" v-model="subtype" filterable @change="toRoute">
                <el-option v-for="(item, i) in xfMaps" :key="i" :value="item.name">
                    <div class="u-xf-option">
                        <img class="u-pic" :src="showMountIcon(item.id)" :alt="item.name" />
                        <span class="u-txt">{{ item.name }}</span>
                    </div>
                </el-option>
            </el-select>
        </div>
        <!-- origin没有，std有 -->
        <div class="m-xf-buff">
            <h4 class="u-xf-title">
                <el-icon><ZoomIn /></el-icon>心法加成
            </h4>
            <div v-if="client === 'std'" class="u-buff-wrap">
                <div class="u-buff" v-if="data.BuffID">
                    <img
                        :title="`IconID:${data.IconID}`"
                        :src="iconLink(data.IconID)"
                        :alt="data.Name"
                        @click="getUrl"
                    />
                    <div class="u-name-desc">
                        <div class="u-name">{{ data.Name }}</div>
                        <div class="u-desc" v-html="showDesc(data.Desc)"></div>
                    </div>
                </div>
                <div v-else class="u-no-data">当前心法没有加成。</div>
            </div>
            <div v-else class="u-no-data">缘起暂无心法加成。</div>
        </div>
    </div>
</template>

<script>
import { getBread } from "@/service/raw";
import xfMap from "@jx3box/jx3box-data/data/xf/xf.json";
import desertXfMap from "@/assets/data/desertXf.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { getBuff } from "@/service/cj";
import jx3boxData from "@jx3box/jx3box-common/data/jx3box.json";
import { useStore } from "@/store";
const $store = useStore();

export default {
    name: "CJXf",
    data() {
        return {
            // 冰心诀
            subtype: "冰心诀",
            data: {},
            desertXfMap: {},
        };
    },
    computed: {
        client() {
            return $store.client;
        },
        baseUrl() {
            return this.client == "origin" ? jx3boxData.__OriginRoot : jx3boxData.__Root;
        },
        tab: function () {
            return this.$route.query.tab;
        },
        xfMaps() {
            delete xfMap["山居剑意"];
            const defense = ["云裳心经", "离经易道", "补天诀", "相知", "灵素"];
            const healing = ["铁牢律", "洗髓经", "明尊琉璃体", "铁骨衣"];
            return Object.values(xfMap)
                .filter((item) => item.client.includes(this.client))
                .filter((item) => {
                    return ![...defense, ...healing].includes(item.name);
                });
        },
        // computedXfMaps() {
        //     return this.xfMaps.map((item) => {
        //         return {
        //             ...item,
        //             ...(desertXfMap?.[item.name] || {}),
        //         };
        //     });
        // },
        // 当前心法加成id
        currentXf() {
            const obj = this.subtype !== "" ? this.desertXfMap[this.subtype] || {} : {};
            return obj;
        },
        currentLogo() {
            const id = this.subtype !== "" ? xfMap[this.subtype].id : null;
            return {
                src: id !== null ? this.showMountIcon(id) : require("@/assets/img/logo.svg"),
                alt: id !== null ? xfMap[this.subtype].name : "门派心法",
            };
        },
    },
    watch: {
        "$route.query": {
            immediate: false,
            deep: true,
            handler(query) {
                const { subtype } = query;
                this.subtype = subtype || "冰心诀";
                this.data = {};
                if (subtype) {
                    this.loadBuff();
                } else {
                    // this.toRoute("冰心诀");
                }
            },
        },
    },
    methods: {
        showDesc(desc = "") {
            return desc.replace(/\\n/g, "");
        },
        iconLink,
        showMountIcon,
        toRoute(subtype) {
            this.$router.push({
                query: {
                    subtype,
                    tab: this.tab,
                },
            });
        },
        loadBuff() {
            // 读取本地数据
            const { client } = this;
            const { desertBuffId, desertBuffLevel } = this.currentXf;
            if (!desertBuffId) return;
            const cache = sessionStorage.getItem(`buff-${client}-${desertBuffId}-${desertBuffLevel}`);
            if (cache) {
                this.data = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                getBuff(desertBuffId, desertBuffLevel, client).then((res) => {
                    let newData = res.data?.list?.[0] || {};
                    this.data = newData;
                    // 将数据放入 sessionStorage
                    sessionStorage.setItem(
                        `buff-${client}-${desertBuffId}-${desertBuffLevel}`,
                        JSON.stringify(newData)
                    );
                });
            }
        },
        async loadKey() {
            // 读取本地数据
            const key = "pvp_desert_mount";
            const cache = sessionStorage.getItem(key);
            if (cache) {
                this.desertXfMap = JSON.parse(cache);
                // 没有缓存则发起请求获取数据
            } else {
                try {
                    const res = await getBread({ key });
                    const obj = res.data?.data?.[0]?.html;
                    if (obj) {
                        sessionStorage.setItem(key, obj);
                        this.desertXfMap = JSON.parse(obj);
                    }
                } catch (error) {
                    this.desertXfMap = desertXfMap;
                }
            }
        },
        getUrl() {
            const url = this.baseUrl + `app/database/?type=buff&query=${this.data.BuffID}&level=${this.data.Level}`;
            window.open(url, "_blank");
        },
    },
    async mounted() {
        await this.loadKey();
        const { subtype = "" } = this.$route.query || {};
        this.subtype = subtype || "冰心诀";
        this.data = {};
        if (subtype) {
            this.loadBuff();
        } else {
            this.toRoute("冰心诀");
        }
    },
};
</script>
