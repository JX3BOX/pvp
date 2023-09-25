<template>
    <div v-loading="loading" class="m-cj-index" @click.prevent="contextMenuVisible = false">
        <div class="m-select">
            <label class="u-label">地图</label>
            <el-select v-model="map" @change="mapChange">
                <el-option v-for="item in maps" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="m-map-wrap">
            <div v-if="map" ref="map" class="m-map" :class="legend && 'is-point'" @contextmenu.prevent="showMenu">
                <!-- 地图 -->
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
                    </ul>
                </div>

                <!-- 示例点 -->
                <img
                    v-if="!pointForm.id && legend && (contextMenuVisible || showDialog)"
                    class="u-point__0"
                    :src="getPointInfo(legend)"
                    :style="{
                        top: contextMenuPosition.y - legendSize + 'px',
                        left: contextMenuPosition.x - legendSize / 2 + 'px',
                    }"
                />

                <!-- 点位 -->
                <div class="m-points">
                    <div
                        class="u-point"
                        :class="[point.belongToMe ? 'is-my-point' : '']"
                        v-for="point in showPoints"
                        :key="point.id"
                        :style="{
                            width: legendSize + 'px',
                            height: legendSize + 'px',
                            top: point.point.y - legendSize + 'px',
                            left: point.point.x - legendSize / 2 + 'px',
                        }"
                    >
                        <el-popover
                            v-if="point.id === visiblePopId"
                            placement="top"
                            :width="200"
                            trigger="manual"
                            :content="point.desc"
                            v-model:visible="visiblePop"
                            popper-class="u-point-pop"
                        >
                            <template #reference>
                                <img
                                    class="u-point__img"
                                    :style="{
                                        width: legendSize + 'px',
                                        height: legendSize + 'px',
                                    }"
                                    :src="point.pointImg"
                                    :alt="point.pointName"
                                    @click="handlerPop(point.id)"
                                />
                            </template>
                            <div class="u-header">
                                <div class="u-info">
                                    <img :src="point.pointImg" :alt="point.pointName" />
                                    <span class="u-title">{{ point.pointName }}</span>
                                </div>
                                <el-tag
                                    v-if="point.belongToMe"
                                    size="small"
                                    :type="point.status === 1 ? 'success' : point.status === 2 ? 'danger' : ''"
                                    >{{ statusMap[point.status] }}</el-tag
                                >
                            </div>
                            <div class="u-content">
                                {{ point.desc }}
                            </div>
                            <div v-if="point.belongToMe" class="u-footer">
                                <el-button size="small" type="primary" @click="toEdit(point)">编辑</el-button>
                                <el-button size="small" type="danger" @click="toDel(point.id)">删除</el-button>
                            </div>
                            <div v-else class="u-footer u-footer-info">
                                <div class="u-user">
                                    By: <img class="u-avatar" :src="point.avatar" :alt="point.name" />
                                    <span>{{ point.name }}</span>
                                </div>
                                <div class="u-time">
                                    {{ formatTime(point.updated_at) }}
                                </div>
                            </div>
                        </el-popover>
                        <img
                            v-else
                            class="u-point__img"
                            :style="{
                                width: legendSize + 'px',
                                height: legendSize + 'px',
                            }"
                            :src="point.pointImg"
                            :alt="point.pointName"
                            @click="handlerPop(point.id)"
                        />
                    </div>
                </div>

                <!-- <img class="u-path" src="../../assets/img/1_x653_y140.png" /> -->
                <!-- 1920 * 1080 下，在现有地图的基础上，往右 70px为基准点，往下50像素为基准点,放大1.1倍 -->
                <!-- 路线 -->
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
            <!-- 我的点位列表 -->
            <div v-if="myPoints.length" class="m-my-points">
                <div class="u-point-item u-point-title">
                    <span>我的标点</span>
                    <el-select v-model="statusFilter" size="small" style="width: 100px" @change="statusChange">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已通过" value="1"></el-option>
                    </el-select>
                </div>
                <div class="u-point-item" v-for="pointItem in myPoints" :key="pointItem.id">
                    <div class="u-header">
                        <div class="u-title">
                            <img :src="pointItem.pointImg" :alt="pointItem.pointName" />
                            <span>{{ pointItem.pointName }}</span>
                            <el-tag
                                size="small"
                                :type="pointItem.status === 1 ? 'success' : pointItem.status === 2 ? 'danger' : ''"
                                >{{ statusMap[pointItem.status] }}
                            </el-tag>
                        </div>
                        <div class="u-op">
                            <el-button type="primary" text @click="toEdit(pointItem)">编辑</el-button>
                            <el-button type="danger" text @click="toDel(pointItem.id)">删除</el-button>
                        </div>
                    </div>
                    <div class="u-content">{{ pointItem.desc }}</div>
                    <div class="u-time">UpdatedAt: {{ formatTime(pointItem.updated_at) }}</div>
                </div>
            </div>
        </div>

        <el-dialog
            v-if="showDialog"
            v-model="showDialog"
            :title="dialogTitle"
            append-to-body
            width="560"
            class="m-desert-point-pop"
        >
            <el-form
                ref="pointForm"
                class="m-desert-form"
                :model="pointForm"
                :rules="rules"
                label-position="right"
                label-width="60"
            >
                <el-form-item label="类型" prop="type">
                    <el-select v-model="pointForm.meta.type" style="width: 100%" @change="legendChange">
                        <el-option
                            v-for="legend in legends"
                            :key="legend.value"
                            :value="legend.value"
                            :label="legend.label"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="短评" prop="desc">
                    <el-input type="textarea" v-model="pointForm.desc" :rows="4" maxlength="50" show-word-limit />
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
import { getMapList, getPoints, addPoint, getMyPoints, delPoint, updatePoint } from "@/service/cj";
// import { reviewPoint } from "@/service/cj";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import CJIntro from "./CJIntro.vue";
import mapPath from "@/assets/data/mapPath.json";
import { cloneDeep, pick } from "lodash";
import User from "@jx3box/jx3box-common/js/user.js";
import moment from "moment";
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
            // paths data
            mapPath: markRaw(mapPath),
            // img cdn
            imgRoot: __imgPath + "pve/desert/",
            contextMenuVisible: false,
            contextMenuPosition: { x: 0, y: 0 },
            showDialog: false,
            originMyPoints: [],
            myPoints: [],
            points: [],
            legend: "", // 标点图例
            legendSize: 30, // legend show size
            legends: [
                {
                    label: "路线建议",
                    value: "path",
                    src: require("@/assets/img/desert/path.svg"),
                },
                {
                    label: "大量物资",
                    value: "goods",
                    src: require("@/assets/img/desert/goods.svg"),
                },
                {
                    label: "少量物资",
                    value: "small_goods",
                    src: require("@/assets/img/desert/small_goods.svg"),
                },
            ],
            // point status map
            statusMap: {
                0: "审核中",
                1: "已通过",
                2: "已拒绝",
            },
            pointForm: {
                point: {},
                meta: {
                    type: "", // 标点类型，对应图例 goods, path
                },
                desc: "",
                client: useStore().client,
            },
            rules: {
                desc: [{ required: true, message: "请输入短评", trigger: "blur" }],
            },
            btnLoading: false,
            visiblePopId: null,
            statusFilter: "", // my points filter
        };
    },
    computed: {
        dialogTitle() {
            return !this.pointForm?.id ? "新增标点" : "编辑标点";
        },
        // point popover visible
        visiblePop: {
            get() {
                return !!this.visiblePopId;
            },
            set(val) {
                this.visiblePopId = val;
            },
        },
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
        // Points to show, contains points pending reviewed and rejected
        showPoints() {
            const points = this.myPoints
                .filter((item) => item.status !== 1)
                .concat(this.points)
                .map((item) => {
                    return {
                        ...item,
                        avatar: item.point_author_info.user_avatar || User.anonymous.avatar_origin,
                        name: item.point_author_info.display_name,
                        belongToMe: ~~User?.profile?.uid === item.user_id, // my point
                        pointImg: this.getPointInfo(item.meta?.type),
                        pointName: this.getPointInfo(item.meta?.type, "label"),
                    };
                });
            return points;
        },
    },
    methods: {
        /**
         * format time
         * @params time
         * @return time String
         */
        formatTime(time) {
            return moment(time).format("YYYY-MM-DD hh:mm:ss");
        },
        // change map
        mapChange() {
            this.statusFilter = "";
            this.getPoints();
            this.getMyPoints();
        },
        // change my points status
        statusChange(val) {
            if (val) {
                this.myPoints = this.originMyPoints.filter((item) => item.status === ~~val);
            } else {
                this.myPoints = this.originMyPoints;
            }
        },
        /**
         * set popover status
         * @params id: point Id
         */
        handlerPop(id) {
            if (this.visiblePopId === id) {
                this.visiblePopId = null;
            } else {
                this.visiblePopId = id;
            }
        },
        /**
         * @return legend info
         */
        getPointInfo(legend, type = "src") {
            const info = legend ? this.legends.find((item) => item.value === legend)?.[type] : "";
            let defaultInfo = require("@/assets/img/desert/path.svg");
            if (type === "value") {
                defaultInfo = "path";
            }
            if (type === "label") {
                defaultInfo = "路线建议";
            }
            return info || defaultInfo;
        },
        /**
         * legend setting
         */
        setLegend(legend) {
            if (this.legend === legend.value) {
                this.legend = "";
            } else {
                this.legend = legend.value;
            }
        },
        /**
         * dialog legend type change
         */
        legendChange(value) {
            if (!this.pointForm.id) {
                this.legend = value;
            }
        },
        /**
         * show right menus
         */
        showMenu(event) {
            if (!this.legend) return;
            if (event.target.className === "u-point__img") {
                // the mouse click on the existing point
                return this.$message({
                    type: "warning",
                    message: "附近已存在标点",
                });
            }
            event.preventDefault();
            // get the location of container
            const mapRect = this.$refs.map.getBoundingClientRect();

            // calculate the location of the right-click menu
            this.contextMenuPosition = {
                x: event.clientX - mapRect.left,
                y: event.clientY - mapRect.top,
            };

            this.contextMenuVisible = true;
        },
        /**
         * menu item click
         */
        menuItemClicked(mode) {
            if (mode === "add") {
                if (!User.isLogin())
                    return this.$message({
                        type: "warning",
                        message: "请先登录",
                    });
                this.pointForm.meta.type = this.legend;
                this.showDialog = true;
            }
            this.contextMenuVisible = false;
        },
        /**
         * all maps
         */
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
        /**
         * return map image
         */
        getMapImage(mapId) {
            return `${__imgPath}map/maps/map_${mapId}_0.png`;
        },
        /**
         * return all points which is approved, it means status is 1
         */
        getPoints() {
            const params = { client: useStore().client, map: this.map };
            getPoints(params).then((res) => {
                this.points = res.data?.data || [];
            });
        },
        /**
         * return my points I submit, includes all status
         */
        getMyPoints(status) {
            if (!User.isLogin()) return;
            const params = { client: useStore().client, map: this.map };
            if (status !== undefined || status !== null) {
                params.status = status;
            }
            getMyPoints(params).then((res) => {
                const list = res.data?.data || [];
                this.myPoints = list.map((item) => {
                    return {
                        ...item,
                        pointImg: this.getPointInfo(item.meta?.type),
                        pointName: this.getPointInfo(item.meta?.type, "label"),
                    };
                });
                this.originMyPoints = cloneDeep(this.myPoints);
            });
        },
        /**
         * create/edit a point and wait for review
         */
        savePoint() {
            let formData = cloneDeep(this.pointForm);
            const id = this.pointForm.id;
            if (!id) {
                // add
                formData.map = this.map;
                formData.point = this.contextMenuPosition;
            } else {
                // update
                formData = pick(formData, ["map", "point", "meta", "desc", "client", "status"]);
                formData.status = 0;
            }
            this.btnLoading = true;
            const fn = id ? updatePoint(formData, id) : addPoint(formData);
            fn.then((res) => {
                this.handlerPoint(id ? { ...formData, id } : res.data.data, id);
            }).finally(() => {
                this.btnLoading = false;
            });
        },
        /**
         * @params data:addPoint / updatePoint return
         */
        handlerPoint(data, id) {
            this.$notify({
                title: "成功",
                message: `${id ? "修改" : "添加"}成功，等待审核中...`,
                type: "success",
            });
            const newData = {
                ...data,
                pointImg: this.getPointInfo(data.meta?.type),
                pointName: this.getPointInfo(data.meta?.type, "label"),
                point_author_info: {
                    user_avatar: User.profile.avatar_origin,
                    display_name: User.profile.name,
                },
            };
            if (id) {
                const index = this.myPoints.findIndex((item) => item.id === id);
                this.myPoints.splice(index, 1, newData);
            } else {
                this.myPoints.unshift(newData);
            }
            this.originMyPoints = cloneDeep(this.myPoints);
            this.legend = "";
            this.onClose();
        },
        /**
         * params[point]: point item
         */
        toEdit(point) {
            // hide point popover
            this.visiblePopId = null;
            // reset legend
            this.legend = "";

            this.pointForm = cloneDeep(point);
            this.showDialog = true;
        },
        /**
         * delete my point
         * @params id: point Id
         */
        toDel(id) {
            // hide point popover
            this.visiblePopId = null;

            this.$confirm("确定要删除该短评吗？删除后不可恢复。", "温馨提示", {
                confirmButtonText: "立即删除",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delPoint(id).then(() => {
                        this.myPoints = this.myPoints.filter((item) => item.id !== id);
                        this.originMyPoints = cloneDeep(this.myPoints);
                        this.$notify({
                            title: "成功",
                            message: "删除成功",
                            type: "success",
                        });
                    });
                })
                .catch(() => {});
        },
        /**
         * cancel
         */
        onCancel() {
            this.onClose();
        },
        /**
         * init data and status , and then close the dialog
         */
        onClose() {
            this.$refs.pointForm.clearValidate();
            this.pointForm = {
                point: {},
                meta: {
                    type: "path", // goods, path, small_goods
                },
                desc: "",
                client: useStore().client,
            };
            this.showDialog = false;
        },
        /**
         * validate the form data and submit it
         */
        onConfirm() {
            this.$refs.pointForm.validate((valid, fields) => {
                if (valid) {
                    this.savePoint();
                } else {
                    console.log("error submit!", fields);
                }
            });
        },
    },
    mounted() {
        this.getMapList();
        this.getPoints();
        this.getMyPoints();
        // reviewPoint(3).then((res) => {
        //     console.log(res);
        // });
    },
};
</script>

<style lang="less">
@import "@/assets/css/cj/index.less";
</style>
