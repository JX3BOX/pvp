<template>
    <div v-loading="loading" class="m-cj-index" @click.prevent="contextMenuVisible = false">
        <div class="m-select">
            <label class="u-label">地图</label>
            <el-select v-model="map">
                <el-option v-for="item in maps" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div v-if="map" ref="map" class="m-map" :class="legend && 'is-point'" @contextmenu.prevent="showMenu">
            <img class="u-map" :src="getMapImage(map)" />
            <!-- 图例 -->
            <div class="m-legends">
                <div
                    class="u-legend"
                    v-for="legend in legends"
                    :key="legend.value"
                    :class="legend.value === this.legend && 'is-active'"
                    @click="setLegend(legend)"
                >
                    <img class="u-legend__img" :src="legend.src" svg-inline :alt="legend.label" />
                    <label class="u-label">{{ legend.label }}</label>
                </div>
            </div>
            <!-- 右键菜单 -->
            <div
                v-if="contextMenuVisible"
                class="u-context-menu"
                :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
            >
                <ul>
                    <li @click="menuItemClicked('add')">新增</li>
                    <!-- <li @click="menuItemClicked('del')">移除</li> -->
                </ul>
            </div>

            <!-- <img class="u-path" src="../../assets/img/1_x653_y140.png" /> -->
            <!-- 1920 * 1080 下，在现有地图的基础上，往右 70px为基准点，往下50像素为基准点,放大1.1倍 -->
            <div class="m-paths" v-if="map && paths.length">
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

        <el-dialog v-model="showDialog" title="绝境战场" append-to-body width="560" class="m-desert-point-pop">
            <el-form
                ref="pointForm"
                class="m-desert-form"
                :model="pointForm"
                :rules="rules"
                label-position="right"
                label-width="60"
            >
                <el-form-item label="类型">
                    <el-select v-model="pointForm.meta.type" style="width: 100%" prop="type">
                        <el-option label="路线点" value="path"></el-option>
                        <el-option label="物资点" value="goods"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" v-model="pointForm.desc" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="m-footer">
                    <el-button @click="onCancel">取消</el-button>
                    <el-button type="primary" :loading="btnLoading" @click="onConfirm">保存</el-button>
                </div>
            </template>
        </el-dialog>

        <CJIntro v-if="map" :map="map"></CJIntro>
    </div>
</template>

<script>
import { useStore } from "@/store";
import { markRaw } from "vue";
import { getMapList, getPoints, addPoint } from "@/service/cj";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import CJIntro from "./CJIntro.vue";
import mapPath from "@/assets/data/mapPath.json";
import { cloneDeep } from "lodash";
import User from "@jx3box/jx3box-common/js/user.js";
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
            contextMenuVisible: false,
            contextMenuPosition: { x: 0, y: 0 },
            showDialog: false,
            points: [],
            legend: "", // 标点图例
            legends: [
                {
                    label: "路线点",
                    value: "path",
                    src: require("@/assets/img/desert/path.svg"),
                },
                {
                    label: "物资点",
                    value: "goods",
                    src: require("@/assets/img/desert/goods.svg"),
                },
            ],
            pointForm: {
                point: {},
                meta: {
                    type: "path", // 标点类型，对应图例 goods
                },
                desc: "",
                client: useStore().client,
            },
            rules: {
                desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
            },
            btnLoading: false,
        };
    },
    computed: {
        paths() {
            const paths = this.mapPath.find((item) => item.mapId === this.map)?.paths || [];
            if (paths.length) {
                return paths.map((item) => {
                    return {
                        ...item,
                        url: `${this.imgRoot}${this.map === 297 ? 296 : this.map}/${item.key}.png`,
                    };
                });
            }
            return paths;
        },
    },
    methods: {
        setLegend(legend) {
            if (this.legend === legend.value) {
                this.legend = "";
            } else {
                this.legend = legend.value;
            }
        },
        showMenu(event) {
            if (!this.legend) return;
            event.preventDefault();
            // 获取容器的位置
            const mapRect = this.$refs.map.getBoundingClientRect();

            // 计算右键菜单的位置
            this.contextMenuPosition = {
                x: event.clientX - mapRect.left,
                y: event.clientY - mapRect.top,
            };

            this.contextMenuVisible = true;
        },
        menuItemClicked(mode) {
            if (mode === "add") {
                if (!User.isLogin())
                    return this.$message({
                        type: "warning",
                        message: "请先登录",
                    });
                this.showDialog = true;
            }
            this.contextMenuVisible = false;
        },
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
        getPoints() {
            getPoints().then((res) => {
                this.points = res.data?.data || [];
            });
        },
        addPoint() {
            const data = cloneDeep(this.pointForm);
            data.map = this.map;
            data.point = this.contextMenuPosition;
            this.btnLoading = true;
            addPoint(data)
                .then(() => {
                    this.$notify({
                        title: "成功",
                        message: "添加成功，等待审核中...",
                        type: "success",
                    });
                    this.onClose();
                })
                .finally(() => {
                    this.btnLoading = false;
                });
        },
        onCancel() {
            this.onClose();
        },
        onClose() {
            this.$refs.pointForm.clearValidate();
            this.pointForm = {
                point: {},
                meta: {
                    type: "path", // goods
                },
                desc: "",
                client: useStore().client,
            };
            this.showDialog = false;
        },
        onConfirm() {
            this.$refs.pointForm.validate((valid, fields) => {
                if (valid) {
                    this.addPoint();
                } else {
                    console.log("error submit!", fields);
                }
            });
        },
    },
    mounted() {
        this.getMapList();
        this.getPoints();
    },
};
</script>

<style lang="less">
@import "@/assets/css/cj/index.less";
</style>
