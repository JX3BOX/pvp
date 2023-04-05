<template>
    <div class="m-rank-list">
        <div class="m-rank-edit-icon" v-if="isEdit" @click="dialogFormVisible = true">
            <el-icon><Setting /></el-icon>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item
                :title="item['label']"
                :name="item['label']"
                v-for="(item, index) in statusRankList"
                :key="index"
            >
                <div class="m-rank-cont-list" v-for="(eitem, eindex) in toJson(item.content)" :key="eindex">
                    <div class="m-rank-cont-item">
                        <div class="m-rank-cont-img">
                            <img :src="getImgToName(eitem.name)" alt="" srcset="" />
                        </div>
                        <div class="m-rank-cont-text">{{ eitem.name }}</div>
                        <div class="m-rank-cont-num">{{ eitem.num }}人</div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-dialog v-model="dialogFormVisible" title="排行榜设置" center destroy-on-close @open="openDialogEventFn">
            <el-form>
                <el-form-item label="榜单" :label-width="formLabelWidth">
                    <el-select
                        v-model="labelVal"
                        filterable
                        allow-create
                        default-first-option
                        :reserve-keyword="false"
                        placeholder="请选择现有榜单或输入新的榜单"
                        @change="changeRankItem"
                    >
                        <el-option
                            v-for="item in labelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端" :label-width="formLabelWidth">
                    <el-select v-model="client" class="m-2" placeholder="Select" size="large">
                        <el-option
                            v-for="item in clientOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-switch :active-value="1" :inactive-value="0" v-model="status" />
                </el-form-item>
            </el-form>

            <div class="m-rank-form">
                <div class="m-left">排行</div>
                <div class="m-right">
                    <div class="m-rank-form-header">
                        <div>门派</div>
                        <div>数量</div>
                    </div>
                    <div class="m-rank-form-cont">
                        <draggable
                            :list="content"
                            ghost-class="ghost"
                            chosen-class="chosenClass"
                            animation="300"
                            itemKey="index"
                        >
                            <template #item="{ element, index }">
                                <div class="item-list" :key="element.id">
                                    <el-input placeholder="请输入门派" v-model="element.name" autocomplete="off" />
                                    <el-input placeholder="请输入数量" v-model="element.num" autocomplete="off" />

                                    <div class="m-rank-form-icon" @click="delRankItem(index)">
                                        <el-icon><DeleteFilled /></el-icon>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                        <div class="rank-item-create" @click="addRankItem()">
                            <el-icon><Plus /></el-icon>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="delRankList()">删除</el-button>
                    <el-button type="primary" @click="saveRankList()"> 保存 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { useStore } from "@/store";
import draggable from "vuedraggable";
import { getRankList, createRankItem, putRankList, delRankList } from "@/service/raw.js";
import school from "@jx3box/jx3box-data/data/xf/school.json";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user.js";

const $store = useStore();
export default {
    name: "SkillItem",
    components: {
        draggable,
    },
    data: function () {
        return {
            dialogFormVisible: false,
            activeNames: "1",
            status: 1, // number 状态 0 隐藏 1 显示
            label: "", //榜单
            formLabelWidth: "120",
            client: "std",
            content: [
                {
                    name: "七秀",
                    num: "1",
                    id: 0,
                },
            ],
            labelVal: "",
            labelOptions: [],
            clientOptions: [
                {
                    label: "正式服",
                    value: "std",
                },
                {
                    label: "怀旧服",
                    value: "origin",
                },
            ],
            rankList: [],
            thatRankId: 0,
            statusRankList: [],
        };
    },
    computed: {
        isEdit() {
            return User.isEditor();
        },
        thatClient() {
            return $store.client;
        },
    },
    methods: {
        async getRankList() {
            let data = await getRankList({
                client: this.client,
            });
            this.rankList = data.data.reverse();
            this.statusRankList = this.rankList.filter((item) => item.status && item.client == this.thatClient);
            this.labelOptions = [];
            data.data.forEach((res, index) => {
                this.labelOptions[index] = {
                    label: res.label,
                    value: res.label,
                };
            });
        },
        handleChange() {},
        addRankItem() {
            this.content[this.content.length] = {
                name: "",
                num: "",
            };
        },
        delRankItem(index) {
            this.content.splice(index, 1);
        },
        // 键入新的标题则创建
        async createRankItem() {
            let data = {
                client: this.client,
                status: this.status,
                label: this.labelVal,
                content: JSON.stringify(this.content || []),
            };
            let res = await createRankItem(data);
            if (res) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "保存成功" });
                this.getRankList();
            }
        },

        changeRankItem(val) {
            for (let i = 0; i < this.labelOptions.length; i++) {
                const el = this.labelOptions[i];
                if (el.value == val) {
                    this.loadRankItem(val);
                    return false;
                }
            }
            this.thatRankId = 0;
            this.content = [
                {
                    name: "七秀",
                    num: "1",
                    id: 0,
                },
            ];
            // this.createRankItem();
        },
        // 根据下拉框的选择 显示对应详情
        loadRankItem(val) {
            let thatItem = this.rankList.find(function (item) {
                return val == item.label;
            });

            this.client = thatItem.client || "";
            this.content = JSON.parse(thatItem.content || []);
            this.status = thatItem.status ? 1 : 0;
            this.labelVal = thatItem.label;
            this.thatRankId = thatItem.id;
        },
        async delRankList() {
            let res = await delRankList(this.thatRankId);
            if (res) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "删除成功" });
                this.getRankList();
            }
        },
        // 提交
        async saveRankList() {
            let data = {
                client: this.client,
                status: this.status,
                label: this.labelVal,
                content: JSON.stringify(this.content),
            };
            if (!this.thatRankId) {
                this.createRankItem();
                return false;
            }
            let res = await putRankList(this.thatRankId, data);
            if (res) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "保存成功" });
                this.getRankList();
            }
        },

        toJson(str) {
            return JSON.parse(str ? str : "[]");
        },
        getImgToName(name) {
            let schoolId = school[name] ? school[name].school_id : 1;
            return showSchoolIcon(schoolId);
        },
        // 打开弹出重新计算thatRankId
        openDialogEventFn() {
            this.labelVal = this.labelOptions[0].label;
            this.loadRankItem(this.labelVal);
        },
    },
    created() {
        this.getRankList();
    },
};
</script>
<style lang="less" scoped>
@import "@/assets/css/rank-list.less";
</style>
<style lang="less">
.m-rank-list {
    .el-collapse-item__header {
        font-size: 18px;
        padding-left: 24px;
    }
    .el-dialog__body {
        width: 500px;
        margin: 0 auto;
        .el-select {
            width: 100%;
        }
        .m-rank-form-cont {
            .item-list {
                .el-input {
                    margin-right: 15px;
                }
            }
        }
    }
}
</style>
