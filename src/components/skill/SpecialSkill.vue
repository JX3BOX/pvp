<template>
    <div class="m-special-skill">
        <div class="m-special-skill-recommend">
            <div class="m-special-skill-recommend-header">
                <div class="m-rank-edit-icon" v-if="isEdit" @click="dialogFormVisible = true">
                    <el-icon class="m-el-icon"><Setting /></el-icon>
                </div>
            </div>
        </div>
        <div class="m-special-skill-content">
            <el-tabs v-model="thatSpecialIndex" class="demo-tabs" @tab-click="handleClick(index)">
                <el-tab-pane :label="item.name" :name="index" v-for="(item, index) in SpecialSkillList" :key="index">
                    <div
                        class="m-cont m-special-skill-minw-cont"
                        v-for="(eitem, eindex) in item.skills ? item.skills : []"
                        :key="eindex"
                    >
                        <div class="m-cont-lf">
                            <img :src="iconLink(eitem.icon)" alt="" srcset="" />
                            <div class="m-cont-lf-name">{{ eitem.name }}</div>
                        </div>
                        <div class="m-cont-rg">
                            <div class="m-cont-rg-desc">{{ eitem.desc }}</div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="no-special-skill" v-show="SpecialSkillList.length < 1">当前心法特殊技能正在整理中，敬请期待</div>
        <el-dialog v-model="dialogFormVisible" title="特殊技能设置" center destroy-on-close>
            <div class="m-dialog-search">
                <div class="m-dialog-search-head">
                    <el-input v-model="searchValue" placeholder="请输入技能id或技能名" @keyup.enter="searchData">
                        <template #prepend>ID / 名称</template>
                        <template #append
                            ><el-button @click="searchData"
                                ><el-icon><Search /></el-icon></el-button
                        ></template>
                    </el-input>
                </div>
                <div class="m-dialog-search-cont">
                    <div
                        class="m-cont"
                        v-for="(eitem, eindex) in searchContList"
                        :key="eindex"
                        @click="changeSearchItem(eitem)"
                    >
                        <div class="m-cont-lf">
                            <img :src="iconLink(eitem.IconID)" alt="" srcset="" />
                            <div class="_name">{{ eitem.SkillName }}</div>
                        </div>
                        <div class="m-cont-rg">
                            <div class="_desc">{{ eitem.Desc }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-dialog-content">
                <div class="m-head-tab-create" @click="createSpaciaList">
                    <el-icon><Plus /></el-icon>
                </div>

                <el-tabs v-model="thatSpecialIndex" class="demo-tabs m-item" @tab-click="handleClick(index)">
                    <el-tab-pane
                        :label="item.name"
                        :name="index"
                        v-for="(item, index) in SpecialSkillList"
                        :key="index"
                    >
                        <template #label>
                            <div class="m-item-head">
                                <div class="m-head-tabs">
                                    <div class="m-head-tab">
                                        <el-input v-model="item.name" @click="thatSpecialIndex = index"></el-input>
                                        <div class="m-head-tab-del" @click.stop="delSpaciaList(index)">
                                            <el-icon><CloseBold /></el-icon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="m-cont" v-for="(eitem, eindex) in item.skills ? item.skills : []" :key="eindex">
                            <div class="m-cont-lf">
                                <img :src="iconLink(eitem.icon)" alt="" srcset="" />
                                <div class="">{{ eitem.name }}</div>
                            </div>
                            <div class="m-cont-rg">
                                <div class="">{{ eitem.desc }}</div>
                            </div>
                            <div class="del" @click="delSpaciaListItem(index, eindex)">
                                <el-icon><Delete /></el-icon>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <div class="dialog-desc">请先添加特殊技能类目后搜索技能选择添加入当前类目</div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="saveSpecialSkill"> 保存 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { useStore } from "@/store";
import User from "@jx3box/jx3box-common/js/user.js";
import { getAllDataToName, getSpecialSkillList, createSpecialSkillItem } from "@/service/raw";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
const $store = useStore();
export default {
    props: ["mountid"],
    data() {
        return {
            SpecialSkillList: [
                {
                    name: "特殊技能分类1", // tab页名称
                    skills: [
                        {
                            icon: "icon1", // 技能图标
                            name: "技能示例", // 技能名称
                            desc: "技能描述示例", // 技能描述
                        },
                    ],
                },
            ],
            searchContList: [], //搜索结果
            searchValue: "", //搜索内容
            thatSpecialIndex: 0,

            dialogFormVisible: false,
            formLabelWidth: "120",

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

        // 获取所有specialSkill
        async getSpecialSkill() {
            let resdata = await getSpecialSkillList(this.mountid);
            console.log(resdata);
            if (resdata.data) {
                return (this.SpecialSkillList = this.strToJson(resdata.data.content));
            }
            this.SpecialSkillList = [];
        },
        strToJson(data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                return [];
            }
        },

        // 搜索内容
        async searchData() {
            let params = {
                strict: "0", //是否精确查询
                per: "10",
                page: "1",
                client: this.thatClient,
                school: "",
            };
            let data = await getAllDataToName(this.searchValue, params);
            console.log(data);
            this.searchContList = data.data.list || [];
        },

        // 选择技能
        changeSearchItem(item) {
            console.log(item);
            this.searchValue = "";
            this.searchContList = [];
            console.log(this.thatSpecialIndex);
            console.log(this.SpecialSkillList);

            this.SpecialSkillList[this.thatSpecialIndex].skills.push({
                icon: item.IconID, // 技能图标
                name: item.Name, // 技能名称
                desc: item.Desc, // 技能描述
            });
        },

        // 创建类型页
        createSpaciaList() {
            let data = [
                {
                    name: "示例：特殊技能", // tab页名称
                    skills: [],
                },
            ];
            this.SpecialSkillList.push(data);
        },
        // 删除大特殊技能类
        delSpaciaList(index) {
            this.thatSpecialIndex == index ? (this.thatSpecialIndex = 0) : "";
            this.SpecialSkillList.splice(index, 1);
        },
        handleClick(val) {
            console.log(val);
        },
        // 删除指定技能
        delSpaciaListItem(index, eindex) {
            this.SpecialSkillList[index].skills.splice(eindex, 1);
        },
        // 保存方案
        async saveSpecialSkill() {
            let data = {
                mount: this.mountid, // 心法id
                content: JSON.stringify(this.SpecialSkillList),
            };
            let res = await createSpecialSkillItem(data);
            if (res) {
                this.dialogFormVisible = false;
                this.$message({ type: "success", message: "保存成功" });
                this.getSpecialSkill();
            }
            //
        },
    },
    created() {},
    mounted() {
        console.log(this.mountid);
        this.getSpecialSkill();
    },
};
</script>
<style lang="less" scoped>
@import "@/assets/css/skill/special-skill.less";
</style>
<style lang="less">
.m-special-skill {
    .m-dialog-content {
        .el-tabs__item {
            padding-left: 0;
        }
    }

    .m-special-skill-content {
        .el-tabs__active-bar {
            background-color: #3292ff;
        }
        .el-tabs__item.is-active {
            color: #3292ff;
        }
        .el-tabs__item {
            color: #fff;
        }
    }
}
</style>
