<template>
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
</template>

<script>
import { formatTime } from "@/utils";
export default {
    name: "CJPoints",
    data() {
        return {
            myPoints: [],
            statusFilter: "", // my points filter
        };
    },
    methods: {
        formatTime,
    },
};
</script>

<style lang="less"></style>
