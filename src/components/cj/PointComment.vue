<template>
    <el-dialog
        :title="title"
        class="m-point-comment__dialog"
        width="90%"
        destroy-on-close
        :close-on-click-modal="false"
        v-model="dialogVisible"
        :before-close="handleClose"
    >
        <div class="m-point-content">
            <div class="u-header">
                <div class="u-info">
                    <img :src="point.pointImg" :alt="point.pointName" />
                    <span class="u-title">{{ point.pointName }}</span>
                </div>
            </div>
            <div class="u-content">
                {{ point.desc }}
            </div>
        </div>

        <el-divider content-position="left">评论</el-divider>

        <Comment :id="id" category="desert"></Comment>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { mapState } from "pinia";
import { useStore } from "@/store";
import Comment from "@jx3box/jx3box-vue3-ui/src/single/Comment.vue";
export default {
    name: "PointComment",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        point: {
            type: Object,
            required: true,
        },
    },
    emits: ["update:visible"],
    components: {
        Comment,
    },
    computed: {
        ...mapState(useStore, ["client"]),
        title() {
            return "评论";
        },
        id() {
            return ~~this.point.id;
        },
        dialogVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            },
        },
    },
    methods: {
        handleClose() {
            this.dialogVisible = false;
        },
    },
};
</script>

<style lang="less">
.m-point-comment__dialog {
    .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .m-point-content {
        .u-header {
            .flex;
            gap: 5px;
            align-items: center;
            justify-content: space-between;
            .u-info {
                .flex;
                gap: 5px;
                align-items: center;
                img {
                    .size(20px);
                }
            }
            .u-title {
                .bold;
            }
        }
        .u-content {
            padding: 10px 0;
        }
    }
}
</style>
