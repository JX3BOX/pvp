<template>
    <!-- 吃鸡心法 -->
    <div class="m-cj-xf">
        <div class="m-xf-select">
            <div class="u-logo" :class="currentLogo.alt === '门派心法' && 'is-logo'">
                <img :src="currentLogo.src" :alt="currentLogo.alt" />
            </div>
            <el-select class="u-select" v-model="subtype" filterable @change="toRoute">
                <el-option label="全部心法" value="">
                    <div class="u-xf-option">
                        <img class="u-pic" src="@/assets/img/logo.svg" alt="全部心法" />
                        <span class="u-txt">全部心法</span>
                    </div>
                </el-option>
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
            <h4 class="u-title">
                <el-icon><ZoomIn /></el-icon>心法加成
            </h4>
            <div v-if="client === 'std'" class="u-buff">
                <div class="u-buff" v-if="data.BuffID">
                    <img
                        :title="`IconID:${data.IconID}`"
                        :src="iconLink(data.IconID)"
                        :alt="data.Name"
                        @click="getUrl"
                    />
                    <div class="u-name-desc">
                        <div class="u-name">{{ data.Name }}</div>
                        <div class="u-desc">{{ data.Desc }}</div>
                    </div>
                </div>
                <div v-else class="u-no-data">当前心法没有加成。</div>
            </div>
            <div v-else class="u-no-data">缘起暂无心法加成。</div>
        </div>
    </div>
</template>

<script>
import xfMap from "@jx3box/jx3box-data/data/xf/xf.json";
import desertXfMap from "@/assets/data/desertXf.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { getBuff } from "@/service/cj";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { useStore } from "@/store";
const $store = useStore();

export default {
    name: "CJXf",
    data() {
        return {
            subtype: "",
            data: {},
        };
    },
    computed: {
        client() {
            return $store.client;
        },
        tab: function () {
            return this.$route.query.tab;
        },
        xfMaps() {
            delete xfMap["山居剑意"];
            return Object.values(xfMap).filter((item) => item.client.includes(this.client));
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
            const obj = this.subtype !== "" ? desertXfMap[this.subtype] || {} : {};
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
            immediate: true,
            deep: true,
            handler(query) {
                const { subtype } = query;
                this.subtype = subtype || "";
                this.data = {};
                if (subtype) {
                    this.loadBuff();
                }
            },
        },
    },
    methods: {
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
        getUrl() {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `app/database/?type=buff&query=${this.data.BuffID}&level=${this.data.Level}`;
            window.open(url, "_blank");
        },
    },
};
</script>
