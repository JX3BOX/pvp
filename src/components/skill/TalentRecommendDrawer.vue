<template>
    <el-drawer
        :model-value="modelValue"
        :title="title"
        @close="onCancel"
        class="m-talent-recommend__drawer m-rank-pop"
        append-to-body
    >
        <el-form :model="form" label-width="80px" label-position="left">
            <el-form-item label="心法">
                <el-input :model-value="subtype" disabled></el-input>
            </el-form-item>
            <el-form-item label="用途" prop="key">
                <el-select
                    v-model="active"
                    filterable
                    allow-create
                    placeholder="请选择用途或输入新用途"
                    style="width: 100%"
                    @change="onKeyChange"
                    default-first-option
                >
                    <el-option
                        v-for="item in computedData"
                        :key="item.key"
                        :label="item.key"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户端" prop="client">
                <el-select v-model="form.client" placeholder="选择客户端" style="width: 100%">
                    <el-option
                        v-for="item in clients"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="选择类型" style="width: 100%">
                    <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="适用类型" prop="subtype">
                <el-select v-model="form.subtype" placeholder="选择适用类型" style="width: 100%">
                    <el-option
                        v-for="item in subtypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="typeLabel" prop="code">
                <el-input v-model="form.code" :placeholder="typePlaceholder">
                    <template #prepend>
                        <a class="u-get" target="_blank" :href="typeHref">
                            <el-icon><Warning></Warning></el-icon>
                            获取编码
                        </a>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="配装编码" prop="pz_code">
                <el-input v-model="form.pz_code" placeholder="输入配装编码"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input v-model="form.desc" type="textarea" placeholder="输入描述" :rows="4"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <div>
                <el-button type="danger" class="u-del-btn" @click="onDelete" :disabled="saveLoading">删除</el-button>
                <el-button @click="onCancel" :disabled="saveLoading">取消</el-button>
                <el-button type="primary" @click="onSave" :disabled="saveLoading">保存</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script>
import { markRaw } from "vue";
import { mapState } from "pinia";
import { useStore } from "@/store";
import { addTalentRecommend, putTalentRecommend, delTalentRecommend } from "@/service/talent_recommend";
import { omit } from "lodash";
export default {
    name: "TalentRecommendDialog",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Array,
            default: () => [],
        },
        mount: {
            type: [String, Number],
            default: 0,
        },
        current: {
            type: [String, Number],
            default: "",
        },
    },
    emits: ["update:modelValue", "update"],
    data() {
        return {
            form: {
                type: "",
                subtype: "",
                key: "",
                client: "",
                code: "",
                pz_code: "",
                desc: "",
            },
            saveLoading: false,
            active: "",

            clients: markRaw([
                { label: "重制版", value: "std" },
                { label: "缘起", value: "origin" },
            ]),
            types: markRaw([
                { label: "奇穴", value: "talent" },
                { label: "镇派", value: "talent2" },
            ]),
            subtypes: markRaw([
                { label: "pvp", value: "pvp" },
                { label: "pve", value: "pve" },
            ]),
        };
    },
    computed: {
        ...mapState(useStore, ["client"]),
        title() {
            return "设置奇穴推荐";
        },
        typeLabel() {
            return this.form.type === "talent" ? "奇穴方案" : "镇派方案";
        },
        typePlaceholder() {
            return this.form.type === "talent" ? "奇穴方案编码" : "镇派方案编码";
        },
        typeHref() {
            return this.form.type === "talent" ? "/macro/talent" : "/macro/talent2";
        },
        subtype() {
            return this.$route.query?.subtype || "冰心诀";
        },
        computedData() {
            const arr = ["竞技场", "绝境战场", "大小攻防", "跑酷", "百战", "副本"];
            let data = [];

            arr.forEach((item) => {
                const itemData = this.data.filter((i) => i.key === item);
                if (itemData) {
                    data = data.concat(itemData);
                } else {
                    data.push({
                        key: item,
                        id: item,
                    });
                }
            });

            // arr中不存在的类型则添加
            this.data.forEach((item) => {
                if (!arr.includes(item.key)) {
                    data.push(item);
                }
            });

            return data;

            // return uniqBy(
            //     this.data.concat(
            //         ["竞技场", "绝境战场", "大小攻防", "跑酷", "百战", "副本"].map((item) => {
            //             return {
            //                 key: item,
            //                 id: item,
            //             };
            //         })
            //     ),
            //     "key"
            // );
        },
    },
    watch: {
        modelValue(val) {
            if (val) {
                if (this.current) {
                    this.active = this.current;
                    this.onKeyChange();
                }
            }
        },
    },
    methods: {
        init() {
            if (this.client === "std") {
                this.form.client = "std";
                this.form.type = "talent";
            } else {
                this.form.client = "origin";
                this.form.type = "talent2";
            }
        },
        onKeyChange() {
            const _data = this.data.find((item) => item.id == this.active);
            if (_data) {
                this.form = omit(_data, ["id"]);
            } else {
                this.form = {
                    type: "",
                    subtype: "",
                    key: "",
                    client: "",
                    code: "",
                    pz_code: "",
                    desc: "",
                };
            }
        },
        onCancel() {
            this.$emit("update:modelValue", false);
            // 重置表单
            this.form = {
                type: "",
                subtype: "",
                key: "",
                client: "",
                code: "",
                pz_code: "",
                desc: "",
            };
            this.active = "";
        },
        onSave() {
            const item = this.data.find((item) => item.id == this.active);
            if (item) {
                this.put();
            } else {
                this.create();
            }
        },
        create() {
            this.saveLoading = true;
            addTalentRecommend({ ...this.form, key: this.active, mount: this.mount })
                .then(() => {
                    this.$notify({
                        title: "成功",
                        message: "添加成功",
                        type: "success",
                    });
                    this.onCancel();
                    this.$emit("update");
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.saveLoading = false;
                });
        },
        put() {
            this.saveLoading = true;
            const data = omit(this.form, ["user_id", "updated_at", "created_at", "mount"]);
            putTalentRecommend(this.active, { ...data })
                .then(() => {
                    this.$notify({
                        title: "成功",
                        message: "修改成功",
                        type: "success",
                    });
                    this.onCancel();
                    this.$emit("update");
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.saveLoading = false;
                });
        },
        onDelete() {
            const item = this.data.find((item) => item.id == this.active);
            if (item) {
                this.$confirm("此操作将永久删除该奇穴推荐, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.saveLoading = true;
                        delTalentRecommend(this.active)
                            .then(() => {
                                this.$notify({
                                    title: "成功",
                                    message: "删除成功",
                                    type: "success",
                                });
                                this.onCancel();
                                this.$emit("update");
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                            .finally(() => {
                                this.saveLoading = false;
                            });
                    })
                    .catch(() => {});
            } else {
                this.onCancel();
            }
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/rank.less";

.m-talent-recommend__drawer {
    .u-get {
        .el-icon {
            .pr;
            top: 2px;
        }
    }
}
</style>
