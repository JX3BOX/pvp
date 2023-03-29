<template>
    <div class="pvp-hot-sect-list">
        <div class="edit_icon" @click="dialogFormVisible = true">
            <el-icon><Setting /></el-icon>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="Consistency" name="1">
                <div class="_list">
                    <div class="_item">
                        <div class="_img">
                            <img src="" alt="" srcset="" />
                        </div>
                        <div class="_text">七秀</div>
                        <div class="_num">188人</div>
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
                        @change="changeRankItem()"
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
                            <template #item="{ element }">
                                <div class="item-list" :key="element.id">
                                    <el-input v-model="element.name" autocomplete="off" />
                                    <el-input v-model="element.num" autocomplete="off" />
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
                    <el-button @click="dialogFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false"> 保存 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import { getRankList, createRankItem } from "@/service/raw.js";

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
                    name: "七秀1",
                    num: "123",
                    id: 0,
                },
                {
                    name: "七秀2",
                    num: "123",
                    id: 1,
                },
                {
                    name: "七秀3",
                    num: "123",
                    id: 2,
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
        };
    },
    methods: {
        // /api/cms/bps/pvp-jjc-rank
        async getRankList() {
            let data = await getRankList();
            console.log(data);
        },
        handleChange() {},
        addRankItem() {
            this.content[this.content.length] = {
                name: "",
                num: "",
            };
        },
        // 键入新的标题则创建
        async createRankItem() {
            let data = {
                client: this.client,
                status: this.status ? "1" : "0",
                label: this.labelVal,
                content: "",
            };
            console.log(data);
            let res = await createRankItem(data);
            if (res) {
                this.getRankList();
            }
        },
        // 提交
        saveRankItem() {},
        changeRankItem() {
            console.log();
            if (this.labelOptions.indexOf(this.labelVal) == -1) {
                // 之前没有，需要创建
                this.createRankItem();
            }
        },
    },
    created() {
        this.getRankList();
    },
};
</script>
<style lang="less" scoped>
.pvp-hot-sect-list {
    ._list {
        ._item {
            display: flex;
            justify-content: center;
            align-items: center;
            ._text {
            }
            ._text {
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
            }
        }
    }
}
</style>
