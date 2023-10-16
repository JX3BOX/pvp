<template>
    <el-drawer title="标点审核" v-model="drawer" append-to-body destroy-on-close modal-class="m-review-drawer">
        <div class="m-review-points">
            <div class="u-point-item" v-for="pointItem in list" :key="pointItem.id">
                <div class="u-header">
                    <div class="u-title">
                        <img :src="pointItem.pointImg" :alt="pointItem.pointName" />
                        <span>{{ pointItem.pointName }}</span>
                        <el-tag size="small">待审核</el-tag>
                    </div>
                    <div class="u-op">
                        <el-button size="small" icon="MapLocation" @click="toMark(pointItem)">标记</el-button>
                        <el-popconfirm title="确定通过该短评吗？" hideIcon @confirm="toReview(pointItem.id, 1)">
                            <template #reference>
                                <el-button type="success" size="small">通过</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm title="确定拒绝该短评吗？" hideIcon @confirm="toReview(pointItem.id, 2)">
                            <template #reference>
                                <el-button type="danger" size="small">拒绝</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
                <div class="u-content">
                    {{ pointItem.desc }}
                    <span>
                        <el-icon>
                            <map-location />
                        </el-icon>
                        <b>({{ pointItem.point.x }},{{ pointItem.point.y }})</b>
                    </span>
                </div>
                <div class="u-user">
                    <img class="u-avatar" :src="pointItem.avatar" :alt="pointItem.name" />
                    <a :href="authorLink(pointItem.user_id)" target="_blank">{{ pointItem.name }}</a>
                </div>
                <div class="u-time">UpdatedAt: {{ formatTime(pointItem.updated_at) }}</div>
            </div>
        </div>

        <el-pagination
            class="m-pagination"
            background
            :page-size="per"
            layout="prev, pager, next"
            :total="total"
            v-model:current-page="page"
            small
            hide-on-single-page
            @current-change="load"
        >
        </el-pagination>
        <template #footer>
            <div class="m-footer">
                <el-button @click="onClose">取消</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script>
import { markRaw } from "vue";
import { useStore } from "@/store";
import { mapState } from "pinia";
import { getUnAuditedPoints, reviewPoint } from "@/service/cj";
import { formatTime } from "@/utils";
import { legends, getPointInfo } from "@/assets/data/desertPoints";
import { authorLink } from "@jx3box/jx3box-common/js/utils";

import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "ReviewPoint",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        map: {
            type: Number,
            required: true,
        },
    },
    emits: ["update:visible", "init", "mark"],
    data() {
        return {
            loading: false,
            list: [],
            per: 6,
            page: 1,
            total: 0,
            legends: markRaw(legends),
        };
    },
    computed: {
        ...mapState(useStore, ["client"]),
        drawer: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            },
        },
    },
    watch: {
        drawer: {
            immediate: true,
            handler(bol) {
                if (bol) {
                    this.load();
                }
            },
        },
    },
    methods: {
        authorLink,
        formatTime,
        getPointInfo,
        /**
         * @params {id} point id
         * @params {status} 1 is pass, 2 is refuse
         */
        toReview(id, status) {
            this.loading = true;
            reviewPoint(id, status)
                .then(() => {
                    this.$message({
                        type: "success",
                        message: `${status === 1 ? "审核通过" : "审核拒绝"}成功`,
                    });
                    this.load();
                    this.$emit("init");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        /**
         * @params {point} point
         */
        toMark(point) {
            this.$emit("mark", {
                ...point,
                isMark: true,
            });
        },
        load() {
            const params = {
                client: this.client,
                map: this.map,
                per: this.per,
                page: this.page,
            };
            this.loading = true;
            getUnAuditedPoints(params).then((res) => {
                const list = res.data?.data?.list || [];
                this.list = list.map((item) => {
                    return {
                        ...item,
                        avatar: item.point_author_info.user_avatar || User.anonymous.avatar_origin,
                        name: item.point_author_info.display_name,
                        pointImg: this.getPointInfo(item.meta?.type),
                        pointName: this.getPointInfo(item.meta?.type, "label"),
                    };
                });
                this.total = res.data?.data?.total || 0;
            });
        },
        onClose() {
            this.drawer = false;
        },
    },
};
</script>

<style lang="less">
.m-review-drawer {
    .m-review-points {
        .u-point-item {
            .flex;
            flex-direction: column;
            border-bottom: 1px dashed #eee;
            box-sizing: border-box;
            padding: 10px;
            &.u-point-title {
                font-weight: bold;
                flex-direction: row;
                justify-content: space-between;
            }
            .u-header {
                .flex;
                justify-content: space-between;
                align-items: center;
                height: 25px;
                box-sizing: border-box;
            }
            .u-title {
                .flex;
                align-items: center;
                gap: 5px;
                font-size: 14px;
                img {
                    .size(20px);
                }
            }
            .u-op {
                .flex;
                align-items: center;
                justify-content: flex-end;
                .el-button.is-text {
                    margin: 0;
                    padding: 3px 5px;
                    font-size: 12px;
                }
            }
            .u-content {
                span {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                }
                font-size: 12px;
                padding: 10px 0;
            }
            .u-time,
            .u-user {
                .flex;
                justify-content: flex-end;
                align-items: center;
                color: #999;
                gap: 5px;
                font-size: 12px;
                .u-avatar {
                    .size(20px);
                    .r(20px);
                }
                a {
                    color: #999;
                    &:hover {
                        color: #0366d6;
                    }
                }
            }
        }
    }
    .m-pagination {
        margin-top: 20px;
        .flex;
        justify-content: center;
    }
}
</style>
