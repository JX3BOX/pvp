<template>
    <!-- 我的点位列表 -->
    <div class="m-my-points">
        <template v-if="originMyPoints.length">
            <!-- <el-radio-group class="m-status" v-model="statusFilter" @change="statusChange">
                <el-radio-button :label="status.value" v-for="status in statusList" :key="status.value">{{
                    status.label
                }}</el-radio-button>
            </el-radio-group> -->
            <template v-if="myPoints.length">
                <div class="u-point-item" v-for="pointItem in myPoints" :key="pointItem.id">
                    <div class="u-header">
                        <div class="u-title">
                            <img :src="pointItem.pointImg" :alt="pointItem.pointName" />
                            <span>{{ pointItem.pointName }}</span>
                            <el-tag
                                size="small"
                                effect="dark"
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
            <span v-else class="u-no-data">该分类下并无数据。</span>
        </template>
        <span v-else class="u-no-data">请打开编辑模式后，右键添加您的标点。</span>
    </div>
</template>

<script>
import { markRaw } from "vue";
import { formatTime } from "@/utils";
import { useStore } from "@/store";
import { statusMap } from "@/assets/data/desertPoints";
const $store = useStore();
export default {
    name: "CJPoints",
    data() {
        return {
            // statusFilter: "", // my points filter
            // point status map
            statusMap: markRaw(statusMap),
        };
    },
    computed: {
        statusFilter() {
            return $store.myPointsStatus;
        },
        myPoints() {
            return $store.myPoints;
        },
        originMyPoints() {
            return $store.originMyPoints;
        },
        // statusList() {
        //     const list = [
        //         {
        //             value: "",
        //             label: "全部",
        //         },
        //     ];
        //     for (const [key, value] of Object.entries(this.statusMap)) {
        //         list.push({
        //             value: key,
        //             label: value,
        //         });
        //     }
        //     return list;
        // },
    },
    watch: {
        statusFilter(val) {
            this.statusChange(val);
        },
    },
    methods: {
        formatTime,
        // change my points status
        statusChange(val) {
            if (val !== "") {
                $store.myPoints = $store.originMyPoints.filter((item) => item.status === ~~val);
            } else {
                $store.myPoints = $store.originMyPoints;
            }
        },
        toEdit(item) {
            $store.editPoint = item;
        },
        toDel(id) {
            $store.delPointId = id;
        },
    },
};
</script>

<style lang="less">
.m-my-points {
    .flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    .u-point-item {
        .flex;
        flex-direction: column;
        border-bottom: 1px dashed #333;
        box-sizing: border-box;
        padding: 10px;
        width: 100%;
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
            .none;
            align-items: center;
            justify-content: flex-end;
            .el-button.is-text {
                margin: 0;
                padding: 3px 5px;
                font-size: 12px;
            }
        }
        .u-content {
            font-size: 12px;
            padding: 5px 0;
        }
        .u-time {
            .flex;
            justify-content: flex-end;
            align-items: center;
            color: #999;
            font-size: 12px;
        }
        &:hover {
            .u-op {
                .flex;
            }
        }
    }
    .u-no-data {
        .dbi;
        padding-top: 20px;
        width: 100%;
        text-align: center;
        color: #999;
        font-size: 12px;
    }
}
</style>
