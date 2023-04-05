<template>
    <div class="m-extra-point">
        <div class="m-extra-point-recommend">
            <div class="m-extra-point-recommend-header">
                <div class="lf">
                    <el-select
                        v-model="labelVal"
                        class="m-2"
                        placeholder="Select"
                        size="large"
                        v-show="ExtraPointList.length > 0"
                    >
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
        <div class="m-extra-point-content" v-show="ExtraPointList.length > 0">
            <div class="m-cont">
                <div class="m-cont-img" v-for="(item, index) in strToJson(thatExtraPointData.pz_code)" :key="index">
                    <img :src="iconLink(item.icon)" alt="" srcset="" />
                    <div class="_name">{{ item.name }}</div>
                </div>
            </div>
            <div class="m-tit">奇穴描述：</div>
            <div class="m—desc">{{ thatExtraPointData.desc }}</div>
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
                    <el-input
                        v-model="desc"
                        :rows="2"
                        type="textarea"
                        placeholder="请添加相关描述"
                        :autosize="autosize"
                    />
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
                    <el-input
                        v-model="code"
                        :rows="2"
                        type="textarea"
                        placeholder="请前往复制对应编码填入"
                        :autosize="autosize"
                    />
                </div>
            </div>

            <div class="m-rank-form">
                <div class="m-left">
                    配装编码
                    <a class="u-recipe-item" :href="recipeLink">
                        去复制<el-icon><Promotion /></el-icon>
                    </a>
                </div>
                <div class="m-right">
                    <el-input
                        v-model="pz_code"
                        :rows="2"
                        type="textarea"
                        placeholder="请前往复制对应编码填入"
                        :autosize="autosize"
                    />
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
import { iconLink } from "@jx3box/jx3box-common/js/utils";
const $store = useStore();
export default {
    props: ["mountid"],
    data() {
        return {
            dialogFormVisible: false,
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
            autosize: { minRows: 2, maxRows: 4 },
            thatExtraPointData: {},
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
        iconLink,
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
            if (!this.thatExtraPointId && this.labelOptions.length > 0) {
                this.labelVal = this.labelOptions[0].value;
                this.loadExtraPointItem(this.labelVal);
            }
        },
        async saveExtraPoint() {
            let data = {
                type: this.client == "std" ? "talent" : "talent2",
                subtype: this.subtype,
                key: this.labelVal,
                client: this.client,
                code: this.code,
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
                code: this.code,
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
            this.code = thatItem.code || "";

            this.thatExtraPointId = thatItem.id;
            this.thatExtraPointData = thatItem;
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
        strToJson(data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                return [];
            }
        },

        // 抛出给父组件方法刷新子组件
        reloadElement() {
            this.code = "";
            this.desc = "";
            this.pz_code = "";
            this.ExtraPointList = [];
            this.thatExtraPointId = 0;
            this.thatExtraPointData = {};
            this.getExtraPointList();
        },
    },
    created() {},
    mounted() {
        this.getExtraPointList();
        console.log(this.mountid);
    },
};
</script>
<style lang="less" scoped>
.m-extra-point-recommend-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    .lf {
    }
    .m-rank-edit-icon {
        color: #fff;
        font-size: 22px;
        margin-left: 10px;
        cursor: pointer;
    }
}

.m-extra-point-content {
    .m-cont {
        display: flex;
        flex-wrap: wrap;
        .m-cont-img {
            margin-right: 8px;
            margin-bottom: 12px;
            img {
                width: 38px;
                height: 38px;
            }
            ._name {
                color: #fff;
                font-size: 12px;
                text-align: center;
            }
        }
    }
    .m-tit {
        font-size: 16px;
        color: #fff;
        margin: 10px 0;
    }
    .m—desc {
        font-size: 14px;
        color: #fff;
        height: 150px;
        border: 1px solid #27381a;
        overflow-y: hidden;
        padding: 15px;
        border-radius: 8px;
    }
}
</style>
