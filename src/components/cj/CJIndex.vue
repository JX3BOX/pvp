<template>
    <div class="m-map-wrap" v-loading="loading" @click="cancelRightMenu">
        <div class="m-map-op">
            <div class="m-select">
                <el-select style="width: 150px" v-model="map" @change="mapChange">
                    <template #prefix>地图</template>
                    <el-option
                        v-for="item in mapPath"
                        :key="item.mapId"
                        :label="item.name"
                        :value="item.mapId"
                    ></el-option>
                </el-select>
            </div>
            <!-- 图例 -->
            <div class="m-legends">
                <div
                    class="u-legend"
                    :class="selectedLegends.length === legends.length && 'is-active'"
                    @click="handleClickAll"
                >
                    <label class="u-label">全部</label>
                </div>
                <div
                    class="u-legend"
                    v-for="legend in legends"
                    :key="legend.value"
                    :class="
                        selectedLegends.includes(legend.value) &&
                        // selectedLegends.length !== legends.length &&
                        'is-active'
                    "
                    @click="setLegend(legend)"
                >
                    <el-tooltip effect="dark" :content="legend.label" placement="top">
                        <img class="u-legend__img" :src="legend.src" svg-inline :alt="legend.label" />
                    </el-tooltip>
                    <!-- <label class="u-label">{{ legend.label }}</label> -->
                </div>
            </div>

            <!-- 模式选择 -->
            <div class="u-op">
                <el-checkbox
                    class="u-mode"
                    v-model="isEditMode"
                    :disabled="!isLogin"
                    border
                    label="编辑模式"
                ></el-checkbox>
            </div>
        </div>
        <div class="m-map-index">
            <div
                v-if="map"
                ref="map"
                class="m-map"
                :class="isEditMode && 'is-point'"
                @contextmenu.prevent="showMenu"
                @mousemove.prevent="handleMouseMove"
            >
                <!-- 地图 -->
                <img class="u-map" :src="getMapImage(map)" />
                <!-- 坐标提示 -->
                <div class="u-context-tip" v-if="!contextMenuVisible && isEditMode" :style="tipStyle">
                    {{ `X: ${coordinates.x}, Y: ${coordinates.y}` }}
                </div>
                <!-- the point right-click menu -->
                <div
                    v-if="pointMenuVisible || contextMenuVisible"
                    class="u-context-menu"
                    ref="contextMenu"
                    :style="generateContextMenuStyle()"
                >
                    <ul v-if="contextMenuVisible">
                        <li @click="menuItemClicked('add')">
                            <el-icon size="16"><CirclePlus /></el-icon>
                            <span>新增</span>
                            <!-- <img v-if="getLegendSrc()" :src="getLegendSrc()" class="u-legend" /> -->
                        </li>
                    </ul>
                    <ul v-if="pointMenuVisible">
                        <li v-if="currentRightClickPoint.id && currentRightClickPoint.belongToMe" @click="toEdit(null)">
                            <el-icon size="16"><Edit /></el-icon>
                            <span>编辑</span>
                        </li>
                        <li
                            v-if="currentRightClickPoint.id && currentRightClickPoint.status === 1"
                            @click="toOpenComment(null)"
                        >
                            <el-icon size="16"><ChatDotRound /></el-icon>
                            <span>评论</span>
                        </li>
                        <li
                            v-if="isEditor && currentRightClickPoint.id && currentRightClickPoint.status !== 1"
                            @click="toReview(1)"
                        >
                            <el-icon size="16"><CircleCheck /></el-icon>
                            <span class="u-success">通过</span>
                        </li>
                        <li
                            v-if="isEditor && currentRightClickPoint.id && currentRightClickPoint.status === 0"
                            @click="toReview(2)"
                        >
                            <el-icon size="16"><CircleClose /></el-icon>
                            <span class="u-danger">拒绝</span>
                        </li>
                        <li
                            v-if="currentRightClickPoint.id && currentRightClickPoint.belongToMe"
                            @click="toDel(currentRightClickPoint.id)"
                        >
                            <el-icon size="16"><Delete /></el-icon>
                            <span class="u-danger">删除</span>
                        </li>
                        <!-- 已通过的标点重新打回 -->
                        <li
                            v-if="isEditor && currentRightClickPoint.id && currentRightClickPoint.status === 1"
                            @click="toReview(0)"
                        >
                            <el-icon size="16"><Remove /></el-icon>
                            <span class="u-danger">弃用</span>
                        </li>
                    </ul>
                </div>
                <!-- 示例点 -->
                <img
                    v-if="
                        !pointForm.id &&
                        selectedLegends.length &&
                        ((!pointMenuVisible && contextMenuVisible) || showDialog)
                    "
                    class="u-point__0"
                    :src="getPointInfo(selectedLegends[0])"
                    :style="generateExamplePointStyle()"
                />

                <!-- 点位 -->
                <div class="m-points">
                    <div
                        class="u-point"
                        :class="[point.belongToMe ? 'is-my-point' : '', point.isMark ? 'is-mark' : '']"
                        v-for="point in showPoints"
                        :key="point.id"
                        :style="generatePointStyle(point)"
                    >
                        <el-popover
                            v-if="point.id === visiblePopId"
                            placement="top"
                            :width="210"
                            trigger="manual"
                            :content="point.desc"
                            v-model:visible="visiblePop"
                            popper-class="u-point-pop"
                            effect="dark"
                        >
                            <template #reference>
                                <img
                                    class="u-point__img"
                                    :style="{
                                        width: '100%',
                                        height: '100%',
                                    }"
                                    :src="point.pointImg"
                                    :alt="point.pointName"
                                    :custom-data="
                                        JSON.stringify({
                                            id: point.id,
                                            status: point.status,
                                            belongToMe: point.belongToMe,
                                        })
                                    "
                                    @click="handlerPop(point.id)"
                                    @contextmenu.prevent.stop="showMenu"
                                />
                            </template>
                            <div class="u-header">
                                <div class="u-info">
                                    <img :src="point.pointImg" :alt="point.pointName" />
                                    <span class="u-title" :class="`u-legend__${point.meta.type}`">{{
                                        point.pointName
                                    }}</span>
                                    <span class="u-tip">
                                        {{ `(X: ${Math.floor(point.point.x)}, Y: ${Math.floor(point.point.y)})` }}
                                    </span>
                                </div>
                                <el-tag
                                    v-if="point.belongToMe"
                                    size="small"
                                    effect="dark"
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
                                <el-button
                                    v-if="point.status === 1"
                                    size="small"
                                    plain
                                    icon="ChatDotRound"
                                    @click="toOpenComment(point)"
                                    >评论</el-button
                                >
                            </div>
                            <div v-else class="u-footer u-footer-info">
                                <div class="u-user">
                                    <img class="u-avatar" :src="point.avatar" :alt="point.name" />
                                    <a :href="authorLink(point.post_author)" target="_blank">{{ point.name }}</a>
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
                                width: '100%',
                                height: '100%',
                            }"
                            :src="point.pointImg"
                            :alt="point.pointName"
                            :custom-data="
                                JSON.stringify({
                                    id: point.id,
                                    status: point.status,
                                    belongToMe: point.belongToMe,
                                })
                            "
                            @click="handlerPop(point.id)"
                            @contextmenu.prevent.stop="showMenu"
                        />
                    </div>
                </div>

                <!-- <img class="u-path" src="../../assets/img/1_x653_y140.png" /> -->
                <!-- 在现有地图的基础上，往右 70px为基准点，往下40像素为基准点 -->
                <!-- 路线 -->
                <div class="m-paths" v-if="map && paths.length">
                    <img
                        class="u-path"
                        :class="`u-path__${client}_${path.key}`"
                        :style="generatePathStyle(path)"
                        v-for="path in paths"
                        :key="path.key"
                        :src="path.url"
                    />
                </div>
            </div>

            <el-dialog
                v-if="showDialog"
                v-model="showDialog"
                :title="dialogTitle"
                append-to-body
                width="560"
                class="m-desert-point-pop"
                :before-close="onCancel"
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
                        <el-select v-model="pointForm.type" style="width: 100%" @change="legendChange">
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

            <!-- review points drawer -->
            <review-point
                v-if="map"
                v-model:visible="reviewVisible"
                :map="map"
                @init="initData"
                @mark="toMark"
            ></review-point>

            <!-- map introduce -->
            <!-- <CJIntro v-if="map" :map="map"></CJIntro> -->

            <!-- point comment -->
            <PointComment
                v-if="commentVisible && commentPoint.id"
                :point="commentPoint"
                v-model:visible="commentVisible"
            ></PointComment>
        </div>
    </div>
</template>

<script>
import { useStore } from "@/store";
const $store = useStore();
import { markRaw } from "vue";
// import CJIntro from "./CJIntro.vue";
import ReviewPoint from "./ReviewPoint.vue";
import PointComment from "./PointComment.vue";
import { getMapList, getPoints, addPoint, getMyPoints, delPoint, updatePoint, reviewPoint } from "@/service/cj";
import jx3boxData from "@jx3box/jx3box-common/data/jx3box.json";
import mapPath from "@/assets/data/mapPath.json";
import mapPath_origin from "@/assets/data/mapPath_origin.json";
import { cloneDeep, pick } from "lodash";
import User from "@jx3box/jx3box-common/js/user.js";
import { formatTime } from "@/utils";
import { legends, statusMap, getPointInfo } from "@/assets/data/desertPoints";
import { authorLink } from "@jx3box/jx3box-common/js/utils";

function computeScale(width) {
    let _coefficient = 1;
    switch (true) {
        case width >= 3420: {
            _coefficient = 2.5;
            break;
        }
        case width >= 3000: {
            _coefficient = 2;
            break;
        }
        case width >= 2560: {
            _coefficient = 1.5;
            break;
        }
        case width >= 2200: {
            _coefficient = 1.25;
            break;
        }
        default: {
            _coefficient = 1;
        }
    }
    return _coefficient;
}

export default {
    name: "CJIndex",
    components: {
        // CJIntro,
        ReviewPoint,
        PointComment,
    },
    data() {
        return {
            loading: false,
            maps: [],
            map: null,
            //coordinates
            showCoordinates: true,
            animationFrameId: null,
            coordinates: { x: 0, y: 0 },
            // img cdn
            imgRoot: jx3boxData.__imgPath + "pve/desert/",
            pointMenuVisible: false, // point right-click visible
            contextMenuVisible: false, // map ...
            contextMenuPosition: { x: 0, y: 0 },
            contextMenuPositionSave: { x: 0, y: 0 },
            showDialog: false,
            // originMyPoints: [],
            // myPoints: [],
            points: [],
            legendSize: 30, // legend show size
            legends: markRaw(legends),
            selectedLegends: [markRaw(legends).find(({ value }) => value === "goods").value], // 标点图例，默认大量物资
            // point status map
            statusMap: markRaw(statusMap),
            pointForm: {
                point: {},
                type: "", // 标点类型，对应图例 goods, path
                desc: "",
                client: useStore().client,
            },
            rules: {
                type: [{ required: true, message: "请选择类型", trigger: "change" }],
                desc: [{ required: true, message: "请输入短评", trigger: "blur" }],
            },
            btnLoading: false,
            visiblePopId: null,
            statusFilter: "", // my points filter
            markPoints: [], // mark points
            currentRightClickPoint: {}, // current right-click img point
            commentVisible: false, // comment control
            commentPoint: {},
            isEditMode: false, // 是否是编辑模式
            windowInnerWidth: window.innerWidth,
            coefficient: 1, //
        };
    },
    computed: {
        client() {
            return $store.client;
        },
        // paths data
        mapPath() {
            return markRaw(this.client === "origin" ? mapPath_origin : mapPath);
        },
        reviewVisible: {
            get() {
                return $store.reviewVisible;
            },
            set(val) {
                $store.reviewVisible = val;
            },
        },
        isLogin() {
            return User.isLogin();
        },
        isEditor() {
            return User.isEditor();
        },
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
                        url: `${this.imgRoot}${this.client === "origin" ? "origin_" : ""}${
                            this.map === 297 ? 296 : this.map
                        }/${item.key}.png`,
                    };
                });
            }
            return paths;
        },
        // Points to show, contains points pending reviewed and rejected
        showPoints() {
            const points = this.points.filter((item) => item.map === this.map); // current map points
            const showPoints = $store.myPoints
                .filter((item) => item.status !== 1) // points includes  status 0 2 of myPoints
                .concat(points, this.markPoints)
                .filter((item) => this.selectedLegends.includes(item.meta.type)) // filter legend
                .map((item) => {
                    return {
                        ...item,
                        avatar: item.point_author_info.user_avatar || User.anonymous.avatar_origin,
                        name: item.point_author_info.display_name,
                        belongToMe: ~~User?.profile?.uid === item.user_id, // my point
                        pointImg: this.getPointInfo(item.meta?.type),
                        pointName: this.getPointInfo(item.meta?.type, "label"),
                        post_author: item.user_id,
                    };
                });
            return showPoints;
        },
        editPoint() {
            return $store.editPoint;
        },
        delPointId() {
            return $store.delPointId;
        },
        tipStyle() {
            return {
                top: this.coordinates.y * this.coefficient + "px",
                left: this.coordinates.x * this.coefficient + "px",
            };
        },
    },
    watch: {
        reviewVisible(bol) {
            if (!bol) {
                // clear mark points
                this.markPoints = [];
                // clear the mark of my points
                $store.myPoints = $store.myPoints.map((item) => {
                    item.isMark = false;
                    return item;
                });
            }
        },
        isEditMode(bol) {
            if (!bol) {
                this.cancelRightMenu();
                this.coordinates = {
                    x: 0,
                    y: 0,
                };
            } else {
                const { length } = this.selectedLegends;
                if (length > 1 || length === 0) {
                    this.selectedLegends = [this.legends[0].value];
                }
            }
        },
        map(mapId) {
            $store.map = mapId;
        },
        editPoint(point) {
            if (!point) return;
            this.toEdit(point);
        },
        delPointId(id) {
            this.toDel(id);
        },
        windowInnerWidth(width) {
            this.coefficient = computeScale(width);
        },
    },
    methods: {
        authorLink,
        // get current legend src
        // unused
        getLegendSrc() {
            if (!this.legend) return "";
            return this.legends.find((item) => item.value === this.legend)?.src || "";
        },
        /**
         * @params {reviewStatus} 1 is pass, 2 is refuse, 0 is reviewing
         */
        toReview(reviewStatus) {
            const { id } = this.currentRightClickPoint;
            let message = "通过";
            if (reviewStatus === 2) {
                message = "拒绝";
            }
            if (reviewStatus === 0) {
                message = "弃用";
            }
            this.$confirm(`确定要${message}该短评吗？`, "温馨提示", {
                confirmButtonText: `立即${reviewStatus !== undefined ? message : "删除"}`,
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = true;

                    reviewPoint(id, reviewStatus)
                        .then(() => {
                            this.$message({
                                type: "success",
                                message: message + "成功",
                            });
                            this.initData();
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                })
                .catch(() => {});
        },
        // close the right-click menu
        cancelRightMenu() {
            this.pointMenuVisible = false;
            this.contextMenuVisible = false;
        },
        toOpenComment(point) {
            if (!point) {
                const clickPoint = this.currentRightClickPoint;
                if (clickPoint.status !== 1) {
                    return this.$message({
                        type: "warning",
                        message: "当前标点尚未审核通过",
                    });
                }
                this.commentPoint = this.showPoints.find((item) => item.id === clickPoint.id);
            } else {
                this.commentPoint = point;
            }
            this.commentVisible = true;
        },
        // set mark points
        toMark(point) {
            // reset legend
            this.selectedLegends = [point.meta.type];
            // if in myPoints
            const myPointIndex = $store.myPoints.findIndex((item) => item.id === point.id);
            if (myPointIndex !== -1) {
                $store.myPoints[myPointIndex].isMark = !$store.myPoints[myPointIndex]?.isMark;
                return;
            }
            // if not belong to me
            const index = this.markPoints.findIndex((item) => item.id === point.id);
            if (index === -1) {
                this.markPoints.push(point);
            } else {
                this.markPoints.splice(index, 1);
            }
        },
        /**
         * format time
         * @params time
         * @return time String
         */
        formatTime,
        // change map
        mapChange() {
            this.statusFilter = "";
            this.initData();
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
        getPointInfo,
        /**
         * legend setting
         */
        setLegend(legend) {
            const { value } = legend;
            const _index = this.selectedLegends.indexOf(value);
            const isLegendSelected = _index !== -1;
            const { length } = this.selectedLegends;
            // single selection in edit mode
            if (this.isEditMode) {
                this.selectedLegends = [value];
            } else {
                if (isLegendSelected) {
                    // chose at least one
                    if (length === 1) {
                        return;
                    }
                    this.selectedLegends.splice(_index, 1);
                } else {
                    this.selectedLegends.push(value);
                }
            }
        },
        /**
         * dialog legend type change
         */
        legendChange(value) {
            if (!this.pointForm.id) {
                // single selection in edit mode
                this.selectedLegends = [value];
            }
        },
        /**
         * show right menus
         */
        showMenu(event) {
            event.preventDefault();
            // get the location of container
            // const mapRect = this.$refs.map.getBoundingClientRect();
            // const mapW = mapRect.width;
            // const mapH = mapRect.height;

            // calculate the location of the right-click menu
            // this.contextMenuPosition = {
            //     x: event.clientX - mapRect.left,
            //     y: event.clientY - mapRect.top,
            // };
            this.contextMenuPosition = this.coordinates;
            // use to formData
            // this.contextMenuPositionSave = {
            //     x: event.clientX - mapRect.left,
            //     y: event.clientY - mapRect.top,
            // };
            this.contextMenuPositionSave = this.coordinates;
            if (event.target.className === "u-point__img") {
                // the mouse click on the existing point
                const data = event.target.getAttribute("custom-data")
                    ? JSON.parse(event.target.getAttribute("custom-data"))
                    : {};
                this.currentRightClickPoint = data;
                this.pointMenuVisible = true;
                this.pointMenuVisible = true;
                // this.adjustMenuPosition(mapW, mapH);
                return false;
            }
            this.pointMenuVisible = false;
            if (!this.isEditMode) return;

            this.contextMenuVisible = true;
            // this.adjustMenuPosition(mapW, mapH);
        },
        adjustMenuPosition(mapW, mapH) {
            this.$nextTick(() => {
                const contextMenu = this.$refs.contextMenu;
                const menuRect = contextMenu.getBoundingClientRect();
                const width = menuRect.width;
                const height = menuRect.height;
                const top = ~~contextMenu.style.top.split("px")[0];
                const left = ~~contextMenu.style.left.split("px")[0];
                const basePadding = 5;

                if (mapW - left - basePadding < width) {
                    this.contextMenuPosition.x = this.contextMenuPositionSave.x - width;
                }
                if (mapH - top - basePadding < height) {
                    this.contextMenuPosition.y = this.contextMenuPositionSave.y - height;
                }
            });
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
                this.pointForm.type = this.selectedLegends[0];
                this.showDialog = true;
            }
            this.cancelRightMenu();
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
            return `${jx3boxData.__imgPath}map/${this.client == "std" ? "maps" : "maps_origin"}/map_${mapId}_0.png`;
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
                $store.myPoints = list.map((item) => {
                    return {
                        ...item,
                        pointImg: this.getPointInfo(item.meta?.type),
                        pointName: this.getPointInfo(item.meta?.type, "label"),
                    };
                });
                $store.originMyPoints = cloneDeep($store.myPoints);
            });
        },
        /**
         * create/edit a point and wait for review
         */
        savePoint() {
            let formData = cloneDeep(this.pointForm);
            formData.meta = {
                type: formData.type,
            };
            delete formData.type;
            const id = this.pointForm.id;
            if (!id) {
                // add
                formData.map = this.map;
                formData.point = {
                    x: this.contextMenuPositionSave.x,
                    y: this.contextMenuPositionSave.y,
                };
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
                const index = $store.myPoints.findIndex((item) => item.id === id);
                if (index !== -1) {
                    // to get BelongToMe
                    newData.user_id = $store.myPoints.find((item) => item.id === id)?.user_id;
                }
                $store.myPoints.splice(index, 1, newData);
            } else {
                $store.myPoints.unshift(newData);
            }
            $store.originMyPoints = cloneDeep($store.myPoints);
            this.onClose();
        },
        /**
         * params[point]: point item
         */
        toEdit(point) {
            if (!point) {
                // from right-click
                point = $store.myPoints.find((item) => item.id === this.currentRightClickPoint.id);
            }
            // hide point popover
            this.visiblePopId = null;
            // reset legend
            // this.legend = "";

            this.pointForm = {
                ...cloneDeep(point),
                type: point.meta.type,
            };
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
                        $store.myPoints = $store.myPoints.filter((item) => item.id !== id);
                        $store.originMyPoints = cloneDeep($store.myPoints);
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
            $store.editPoint = null;
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
        initData() {
            this.getPoints();
            this.getMyPoints();
        },
        handleMouseMove(event) {
            if (this.animationFrameId) return;
            this.animationFrameId = requestAnimationFrame(() => {
                event.preventDefault();
                const mapRect = this.$refs.map.getBoundingClientRect();
                if (this.isEditMode) {
                    this.coordinates = {
                        x: Math.floor((event.clientX - mapRect.left) / this.coefficient),
                        y: Math.floor((event.clientY - mapRect.top) / this.coefficient),
                    };
                }
                this.animationFrameId = null;
            });
        },
        handleClickAll() {
            // can't select all in edit mode
            if (this.isEditMode) {
                return;
            }
            const length = this.selectedLegends.length;
            if (length < this.legends.length) {
                this.selectedLegends = this.legends.map(({ value }) => value);
            } else {
                this.selectedLegends = [];
            }
        },
        generatePathStyle(path) {
            return {
                left: (path.x + 70) * this.coefficient + "px",
                top: (path.y + 40) * this.coefficient + "px",
                transform: `scale(${this.coefficient})`,
            };
        },
        generatePointStyle(point) {
            return {
                width: this.legendSize * this.coefficient + "px",
                height: this.legendSize * this.coefficient + "px",
                top: (point.point.y - this.legendSize) * this.coefficient + "px",
                left: (point.point.x - this.legendSize / 2) * this.coefficient + "px",
            };
        },
        generateExamplePointStyle() {
            return {
                width: this.legendSize * this.coefficient + "px",
                height: this.legendSize * this.coefficient + "px",
                top: (this.contextMenuPositionSave.y - this.legendSize) * this.coefficient + "px",
                left: (this.contextMenuPositionSave.x - this.legendSize / 2) * this.coefficient + "px",
            };
        },
        generateContextMenuStyle() {
            return {
                top: this.contextMenuPosition.y * this.coefficient + "px",
                left: this.contextMenuPosition.x * this.coefficient + "px",
            };
        },
        handleResize() {
            this.windowInnerWidth = window.innerWidth;
        },
    },
    mounted() {
        if (!this.isLogin) {
            this.isEditMode = false;
        }
        this.getMapList();
        this.initData();
        // reviewPoint(3).then((res) => {
        //     console.log(res);
        // });
        this.coefficient = computeScale(window.innerWidth);
        window.addEventListener("resize", this.handleResize);
    },
    unmounted() {
        window.removeEventListener("resize", this.handleResize);
    },
    created() {},
};
</script>

<style lang="less">
@import "@/assets/css/cj/index.less";
</style>
