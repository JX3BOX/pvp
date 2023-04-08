<template>
    <el-drawer :model-value="modelValue" @close="onCancel" title="特殊技能设置" class="m-special-skill__drawer">
        <div class="m-dialog-tab">
            <el-button @click="onAddTab">新增合集</el-button>
            <el-tabs v-model="activeIndex" type="card" closable class="m-tabs-sort" @tab-remove="onTabRemove">
                <el-tab-pane v-for="(item, index) in content" :key="index" :label="item.name" :name="index + 1 + ''">
                    <template #label>
                        <div class="u-tab-box">
                            <span class="u-tab-name" :title="item.name">{{ index + 1 + "号位-" + item.name }}</span>
                        </div>
                    </template>
                    <div class="m-content">
                        <el-input v-model="item.name" placeholder="输入合集名称">
                            <template #prepend>
                                <span>合集名称</span>
                            </template>
                        </el-input>

                        <el-divider content-position="left">合集内容</el-divider>

                        <div class="m-special-skills">
                            <el-button type="primary" @click="onAddSkill">添加技能</el-button>

                            <div class="m-skill" v-for="skill in item.skills" :key="skill.SkillID">
                                <div class="u-skill">
                                    <img class="u-skill-icon" :src="iconLink(skill.IconID)" :alt="skill.IconID" />
                                    <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                                </div>
                                <div class="u-desc">
                                    <el-input
                                        type="textarea"
                                        placeholder="输入技能描述"
                                        :rows="5"
                                        v-model="skill.desc"
                                    ></el-input>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <template #footer>
            <div>
                <el-button @click="onCancel" :disabled="saveLoading">取消</el-button>
                <el-button type="primary" @click="onSave" :disabled="saveLoading">保存</el-button>
            </div>
        </template>
    </el-drawer>
    <SkillDialog v-model="showDialog" @select="onSkillSelect" />
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import SkillDialog from "./SkillDialog.vue";
import { createSpecialSkillItem } from "@/service/raw";
import { cloneDeep } from "lodash";

const default_content = {
    name: "",
    skills: [],
};
export default {
    name: "SpecialSkillDrawer",
    components: {
        SkillDialog,
    },
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
            type: Number,
            default: 0,
        },
        client: {
            type: String,
            default: "std",
        },
    },
    emits: ["update:modelValue", "update"],
    data() {
        return {
            content: [],
            activeIndex: "1",

            saveLoading: false,
            showDialog: false,
        };
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                if (val.length) {
                    this.content = val;
                } else {
                    this.content = [cloneDeep(default_content)];
                }
            },
        },
    },
    methods: {
        iconLink,
        onCancel() {
            this.$emit("update:modelValue", false);
        },
        onSubmit() {
            this.$emit("update:modelValue", false);
        },
        // 宏数据验证
        checkName() {
            let data = this.content;
            let result = true;
            data.forEach((item, index) => {
                if (!item.name) {
                    this.$notify({
                        title: "提醒",
                        message: `第${index + 1}个合集没有填写名称`,
                        type: "warning",
                    });
                    result = false;
                }
            });
            return result;
        },
        onSave() {
            // 验证
            if (!this.checkName()) {
                return;
            }

            const data = {
                mount: this.mount,
                content: JSON.stringify(this.content),
                client: this.client,
            };
            createSpecialSkillItem(data).then(() => {
                this.$notify({
                    title: "成功",
                    message: "保存成功",
                    type: "success",
                });
                this.onCancel();
                this.$emit("update");
            });
        },
        onAddTab() {
            this.content.push(cloneDeep(default_content));
        },
        onTabRemove(name) {
            if (this.content.length < 2) {
                this.$alert("必须保留1个合集", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个合集吗，删除后无法找回", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.content.splice(i, 1);
                        // 调整focus位置
                        this.activeIndex = "1";
                    }
                },
            });
        },
        onAddSkill() {
            this.showDialog = true;
        },
        onSkillSelect(item) {
            console.log(item);
            this.content[this.activeIndex - 1].skills.push({
                SkillID: item.SkillID,
                Name: item.Name,
                IconID: item.IconID,
                desc: item.Desc,
            });
        },
    },
};
</script>
