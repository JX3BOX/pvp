<template>
    <div class="m-extra-point">
        <div class="m-extra-point-recommend">
            <div class="m-extra-point-recommend-header">
                <div class="lf">
                    <el-select v-model="labelVal" class="m-2" placeholder="Select" size="large">
                        <el-option
                            v-for="item in labelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
                <div class="m-rank-edit-icon" v-if="isEdit" @click="dialogFormVisible = true">
                    <el-icon><Setting /></el-icon>
                </div>
            </div>
        </div>
        <div class="m-extra-point-content">
            <div class="m-cont"></div>
            <div class="m—desc"></div>
        </div>

        <!-- <div>
                 <el-input type="textarea" :autosize="{ minRows: 2}" v-model=""></el-input>
            </div> -->

        <el-dialog v-model="dialogFormVisible" title="奇穴方案设置" center destroy-on-close>
            <el-form>
                <el-form-item label="奇穴标题" :label-width="formLabelWidth">
                    <el-select
                        v-model="labelVal"
                        filterable
                        allow-create
                        default-first-option
                        :reserve-keyword="false"
                        placeholder="请选择现有榜单或输入新的榜单"
                        @change="changeExtraPointItem"
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
                <el-form-item label="客户端类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="subtype" class="ml-4">
                        <el-radio label="pve" size="large">pve</el-radio>
                        <el-radio label="pvp" size="large">pvp</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div class="m-rank-form">
                <div class="m-left">{{ filtersTypeName() }}描述</div>
                <div class="m-right">
                    <el-input v-model="desc" :rows="2" type="textarea" placeholder="Please input" />
                </div>
            </div>
            <div class="m-rank-form">
                <div class="m-left">
                    {{ filtersTypeName() }}编码
                    <a class="u-recipe-item" :href="recipeLink">
                        去复制<el-icon><Promotion /></el-icon>
                    </a>
                </div>
                <div class="m-right">
                    <el-input v-model="pz_code" :rows="2" type="textarea" placeholder="Please input" />
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="delExtraPoint">删除</el-button>
                    <el-button type="primary" @click="saveExtraPoint"> 保存 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { useStore } from "@/store";
import User from "@jx3box/jx3box-common/js/user.js";
import { createExtraPointItem, getExtraPointList, putExtraPointItem, delExtraPointItem } from "@/service/raw";
const $store = useStore();
export default {
    props: ["mountid"],
    data() {
        return {
            dialogFormVisible: true,
            formLabelWidth: "120",
            options: [],
            labelOptions: [],
            labelVal: "",
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

            client: "std",
            code: "",
            desc: "",
            subtype: "pvp",
            pz_code: "",

            ExtraPointList: [],
            thatExtraPointId: 0,
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
        filtersTypeName() {
            return this.client == "std" ? "奇穴" : "镇派";
        },

        recipeLink() {
            return `/item/search/`;
        },
        async getExtraPointList() {
            let data = await getExtraPointList({
                // client: this.client,
                // type: this.client == "std" ? "talent" : "talent2",
                mount: this.mountid,
            });
            console.log(data);
            this.ExtraPointList = data.data;
            this.labelOptions = [];
            data.data.forEach((res, index) => {
                this.labelOptions[index] = {
                    label: res.key,
                    value: res.key,
                };
            });
        },
        async saveExtraPoint() {
            let data = {
                type: this.client == "std" ? "talent" : "talent2",
                subtype: this.subtype,
                key: this.labelVal,
                client: this.client,
                code: "",
                pz_code: this.pz_code,
                desc: this.desc,
            };
            if (!this.thatExtraPointId) {
                this.createExtraPoint();
                return false;
            }
            let res = await putExtraPointItem(this.thatExtraPointId, data);
            if (res) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "保存成功" });
                this.getExtraPointList();
            }
        },

        async createExtraPoint() {
            let data = {
                mount: this.mountid,
                type: this.client == "std" ? "talent" : "talent2",
                subtype: this.subtype,
                key: this.labelVal,
                client: this.client,
                code: "",
                pz_code: this.pz_code,
                desc: this.desc,
            };
            let res = await createExtraPointItem(data);
            if (res) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "保存成功" });
                this.getExtraPointList();
            }
        },
        async delExtraPoint() {
            let res = await delExtraPointItem(this.thatExtraPointId);
            if (res) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "删除成功" });
                this.getExtraPointList();
            }
        },
        // 打开弹出重新计算thatExtraPointId
        openDialogEventFn() {
            this.labelVal = this.labelOptions[0].label;
            this.loadRankItem(this.labelVal);
        },
        // 根据下拉框的选择 显示对应详情
        loadExtraPointItem(val) {
            let thatItem = this.ExtraPointList.find(function (item) {
                return val == item.key;
            });

            this.client = thatItem.client || "std";
            this.subtype = thatItem.subtype || "pvp";
            this.pz_code = thatItem.pz_code || "";
            this.desc = thatItem.desc || "";

            this.thatExtraPointId = thatItem.id;
        },
        changeExtraPointItem(val) {
            for (let i = 0; i < this.labelOptions.length; i++) {
                const el = this.labelOptions[i];
                if (el.value == val) {
                    this.loadExtraPointItem(val);
                    return false;
                }
            }
            this.thatExtraPointId = 0;
            this.client = "std";
            this.subtype = "pvp";
            this.pz_code = "";
            this.desc = "";
            // this.createRankItem();
        },
    },
    created() {
        this.getExtraPointList();
    },
    mounted() {
        console.log(this.mountid);
    },
};
</script>
<style lang="less" scoped></style>
