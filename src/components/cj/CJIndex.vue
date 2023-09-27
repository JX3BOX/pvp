<template>
    <div v-loading="loading" class="m-cj-index" @click.prevent="cancelRightMenu">
        <div class="m-select">
            <label class="u-label">地图</label>
            <el-select v-model="map" @change="mapChange">
                <el-option v-for="item in maps" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-icon v-if="isEditor" class="u-edit-icon" @click="reviewVisible = true"><Setting /></el-icon>
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

                <!-- 地图右键菜单 -->
                <div
                    v-if="contextMenuVisible"
                    class="u-context-menu"
                    :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
                >
                    <ul>
                        <li @click="menuItemClicked('add')">新增</li>
                    </ul>
                </div>
                <!-- the point right-click menu -->
                <div
                    v-if="pointMenuVisible"
                    class="u-context-menu"
                    :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
                >
                    <ul>
                        <li v-if="currentRightClickPoint.id && currentRightClickPoint.belongToMe" @click="toEdit(null)">
                            编辑
                        </li>
                        <li
                            v-if="currentRightClickPoint.id && currentRightClickPoint.belongToMe"
                            @click="toDel(currentRightClickPoint.id)"
                        >
                            删除
                        </li>
                        <li
                            v-if="currentRightClickPoint.id && currentRightClickPoint.status === 1"
                            @click="toOpenComment(null)"
                        >
                            评论
                        </li>
                        <li
                            v-if="isEditor && currentRightClickPoint.id && currentRightClickPoint.status !== 1"
                            @click="toReview(1)"
                        >
                            通过
                        </li>
                        <li
                            v-if="isEditor && currentRightClickPoint.id && currentRightClickPoint.status === 0"
                            @click="toReview(2)"
                        >
                            拒绝
                        </li>
                        <!-- 已通过的标点重新打回 -->
                        <li
                            v-if="isEditor && currentRightClickPoint.id && currentRightClickPoint.status === 1"
                            @click="toReview(0)"
                        >
                            弃用
                        </li>
                    </ul>
                </div>

                <!-- 示例点 -->
                <img
                    v-if="!pointForm.id && legend && ((!pointMenuVisible && contextMenuVisible) || showDialog)"
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
                        :class="[point.belongToMe ? 'is-my-point' : '', point.isMark ? 'is-mark' : '']"
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
                                    <span class="u-title">{{ point.pointName }}</span>
                                </div>
                                <el-tag
                                    v-if="point.belongToMe"
                                    size="small"
                                    :type="point.status === 1 ? 'success' : point.status === 2 ? 'danger' : ''"
                                    >{{ statusMap[point.status] }}</el-tag
                                >
                                <el-button v-else size="small" @click="toOpenComment(point)">评论</el-button>
                            </div>
                            <div class="u-content">
                                {{ point.desc }}
                            </div>
                            <div v-if="point.belongToMe" class="u-footer">
                                <el-button size="small" type="primary" @click="toEdit(point)">编辑</el-button>
                                <el-button size="small" type="danger" @click="toDel(point.id)">删除</el-button>
                                <el-button v-if="point.status === 1" size="small" @click="toOpenComment(point)"
                                    >评论</el-button
                                >
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
            <div class="m-my-points">
                <div class="u-point-item u-point-title">
                    <span>我的标点</span>
                    <el-select v-model="statusFilter" size="small" style="width: 100px" @change="statusChange">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已通过" value="1"></el-option>
                    </el-select>
                </div>
                <template v-if="myPoints.length">
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
                </template>
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

        <!-- review points drawer -->
        <review-point
            v-if="map"
            v-model:visible="reviewVisible"
            :map="map"
            @init="initData"
            @mark="toMark"
        ></review-point>

        <!-- map introduce -->
        <CJIntro v-if="map" :map="map"></CJIntro>

        <!-- point comment -->
        <PointComment
            v-if="commentVisible && commentPoint.id"
            :point="commentPoint"
            v-model:visible="commentVisible"
        ></PointComment>
    </div>
</template>

<script>
import { useStore } from "@/store";
import { markRaw } from "vue";
import CJIntro from "./CJIntro.vue";
import ReviewPoint from "./ReviewPoint.vue";
import PointComment from "./PointComment.vue";
import { getMapList, getPoints, addPoint, getMyPoints, delPoint, updatePoint, reviewPoint } from "@/service/cj";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import mapPath from "@/assets/data/mapPath.json";
import { cloneDeep, pick } from "lodash";
import User from "@jx3box/jx3box-common/js/user.js";
import { formatTime } from "@/utils";
import { legends, statusMap, getPointInfo } from "@/assets/data/desertPoints";
export default {
    name: "CJIndex",
    components: {
        CJIntro,
        ReviewPoint,
        PointComment,
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
            pointMenuVisible: false, // point right-click visible
            contextMenuVisible: false, // map ...
            contextMenuPosition: { x: 0, y: 0 },
            showDialog: false,
            originMyPoints: [],
            myPoints: [],
            points: [],
            legend: "", // 标点图例
            legendSize: 30, // legend show size
            legends: markRaw(legends),
            // point status map
            statusMap: markRaw(statusMap),
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
            reviewVisible: false, // review drawer show
            markPoints: [], // mark points
            currentRightClickPoint: {}, // current right-click img point
            commentVisible: false, // comment control
            commentPoint: {},
        };
    },
    computed: {
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
                .concat(this.points, this.markPoints)
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
    watch: {
        reviewVisible(bol) {
            if (!bol) {
                // clear mark points
                this.markPoints = [];
                // clear the mark of my points
                this.myPoints = this.myPoints.map((item) => {
                    item.isMark = false;
                    return item;
                });
            }
        },
    },
    methods: {
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
                confirmButtonText: "立即删除",
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
            // if in myPoints
            const myPointIndex = this.myPoints.findIndex((item) => item.id === point.id);
            if (myPointIndex !== -1) {
                this.myPoints[myPointIndex].isMark = !this.myPoints[myPointIndex]?.isMark;
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
        getPointInfo,
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
            event.preventDefault();
            // get the location of container
            const mapRect = this.$refs.map.getBoundingClientRect();

            // calculate the location of the right-click menu
            this.contextMenuPosition = {
                x: event.clientX - mapRect.left,
                y: event.clientY - mapRect.top,
            };
            if (event.target.className === "u-point__img") {
                // the mouse click on the existing point
                const data = event.target.getAttribute("custom-data")
                    ? JSON.parse(event.target.getAttribute("custom-data"))
                    : {};
                this.currentRightClickPoint = data;
                this.pointMenuVisible = true;
                return false;
            }
            this.pointMenuVisible = false;
            if (!this.legend) return;

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
            if (!point) {
                // from right-click
                point = this.myPoints.find((item) => item.id === this.currentRightClickPoint.id);
            }
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
        initData() {
            this.getPoints();
            this.getMyPoints();
        },
    },
    mounted() {
        this.getMapList();
        this.initData();
        // reviewPoint(3).then((res) => {
        //     console.log(res);
        // });
    },
};
</script>

<style lang="less">
@import "@/assets/css/cj/index.less";
</style>
