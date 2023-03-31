<template>
    <div class="pvp-hot-sect-list">
        <div class="edit_icon" v-if="isEdit" @click="dialogFormVisible = true">
            <el-icon><Setting /></el-icon>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item
                :title="item['label']"
                :name="item['label']"
                v-for="(item, index) in RankList"
                :key="index"
            >
                <div class="_list" v-for="(eitem, eindex) in toJson(item.content)" :key="eindex">
                    <div class="_item">
                        <div class="_img">
                            <img :src="getImgToName(eitem.name)" alt="" srcset="" />
                        </div>
                        <div class="_text">{{ eitem.name }}</div>
                        <div class="_num">{{ eitem.num }}人</div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-dialog v-model="dialogFormVisible" title="排行榜设置" center>
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
                    <el-switch v-model="status" />
                </el-form-item>
            </el-form>

            <div class="_rank_form">
                <div class="_left">排行</div>
                <div class="_right">
                    <div class="_rank_form_header">
                        <div>门派</div>
                        <div>数量</div>
                    </div>
                    <div class="_rank_form_cont">
                        <draggable :list="content" ghost-class="ghost" chosen-class="chosenClass" animation="300">
                            <template #item="{ element, index }">
                                <div class="item-list" :key="element.id">
                                    <el-input placeholder="请输入门派" v-model="element.name" autocomplete="off" />
                                    <el-input placeholder="请输入数量" v-model="element.num" autocomplete="off" />

                                    <div class="_icon" @click="delRankItem(index)">
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
import draggable from "vuedraggable";
import { getRankList, createRankItem, putRankList, delRankList } from "@/service/raw.js";
import school from "@jx3box/jx3box-data/data/xf/school.json";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";

import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "SkillItem",
    components: {
        draggable,
    },
    data: function () {
        return {
            dialogFormVisible: false,
            activeNames: "1",
            client: "std", //客户端 std/origin
            status: true, // number 状态 0 隐藏 1 显示
            label: "", //榜单
            formLabelWidth: "120",
            lableOptions: [],
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
            RankList: [],
            thatRankId: 0,
        };
    },
    computed: {
        isEdit() {
            return User.isEditor();
        },
    },
    methods: {
        async getRankList() {
            let data = await getRankList({
                client: "std",
                status: "1",
            });
            this.RankList = data.data.reverse();
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
                status: this.status ? "1" : "0",
                label: this.labelVal,
                content: JSON.stringify([
                    {
                        name: "",
                        num: "",
                    },
                ]),
            };
            let res = await createRankItem(data);
            if (res) {
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
            this.createRankItem();
        },
        // 根据下拉框的选择 显示对应详情
        loadRankItem(val) {
            for (let i = 0; i < this.RankList.length; i++) {
                let el = this.RankList[i];

                if (val == el.label) {
                    this.client = el.client ? el.client : "";
                    this.content = JSON.parse(el.content ? el.content : []);
                    this.status = el.status ? true : false;
                    this.labelVal = el.label;
                    this.thatRankId = el.id;
                    return;
                }
            }
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
                status: this.status ? "1" : "0",
                label: this.labelVal,
                content: JSON.stringify(this.content),
            };
            console.log(data);
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
    },
    created() {
        this.getRankList();
    },
};
</script>
<style lang="less" scoped>
.pvp-hot-sect-list {
    position: relative;
    .edit_icon {
        font-size: 24px;
        position: absolute;
        top: 10px;
        right: 30px;
    }
    ._list {
        ._item {
            display: flex;
            // justify-content: center;
            align-items: center;
            width: 100%;
            padding: 0 21px;
            ._img {
                width: 60px;
                height: 60px;
                margin-right: 10px;
                image {
                    width: inherit;
                    height: inherit;
                }
            }
            ._text {
                width: 60px;
            }
            ._num {
            }
        }
    }

    ._rank_form {
        display: flex;
        justify-content: center;
        width: 100%;
        ._left {
            width: 140px;
            text-align: right;
            padding-right: 14px;
        }
        ._right {
            width: 100%;
            ._rank_form_header {
                display: flex;
                margin-bottom: 20px;
                div {
                    width: 100%;
                    text-align: center;
                }
            }
            .item-list {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            ._rank_form_cont {
                .rank-item-create {
                    width: 100%;
                    height: 30px;
                    background: #80ccff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    font-size: 21px;
                    border-radius: 6px;
                    margin: 12px 0px;
                }
                .item-list {
                    ._icon {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
