<template>
    <div class="p-martial-arts">
        <div class="m-martial-skills" v-loading="loading">
            <div v-for="kungfu in kungfus" :key="kungfu" class="m-martial-skill">
                <div class="u-title">
                    <span class="u-title-name">{{ showKungfuName(kungfu) }}</span>
                    <img src="../assets/img/skillset.png" class="u-title-img" alt="" />
                </div>
                <div class="m-skills" v-if="kungfusSkills[kungfu]">
                    <div class="m-skill" v-for="skill in kungfusSkills[kungfu]" :key="skill?.SkillID">
                        <template v-if="skill?.IconID">
                            <el-popover
                                v-if="hasSkill(skill) || subtype === '通用' || !subtype"
                                width="400px"
                                :show-after="100"
                                :hide-after="0"
                                popper-class="m-skill-pop"
                                :show-arrow="false"
                                placement="bottom-start"
                                :offset="0"
                            >
                                <div v-if="selectedSkill">
                                    <skill-item :item="selectedSkill"></skill-item>
                                </div>
                                <template #reference>
                                    <div class="u-skill">
                                        <img
                                            class="u-skill-icon"
                                            :src="iconLink(skill.IconID)"
                                            :alt="skill.IconID"
                                            @mousemove="showSkill(skill)"
                                        />
                                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                                    </div>
                                </template>
                            </el-popover>
                            <div v-else class="u-skill">
                                <img
                                    :src="iconLink(skill?.IconID)"
                                    :alt="skill.IconID"
                                    class="u-not-mount u-talent-icon"
                                />
                                <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                            </div>
                        </template>
                        <img
                            v-if="getSkillRecipe(skill?.SkillID).length"
                            class="u-icon"
                            src="@/assets/img/challenge.png"
                            :ref="(el) => setRefs(el, skill)"
                            @click.stop="showRecipe(skill?.SkillID)"
                        />
                    </div>
                </div>
            </div>

            <div class="m-talent-box qx-container" v-show="subtype && subtype !== '通用'"></div>
        </div>
        <div class="m-martial-extend" v-if="subtype && subtype !== '通用'">
            <div class="m-mount-info">
                <div class="m-pasv">
                    <!-- <div class="u-title">门派内功</div> -->
                    <el-popover width="450px" popper-class="m-pasv-pop" effect="dark">
                        <div class="m-pasv">
                            <div class="u-title">{{ subtype }}</div>
                            <div class="u-name">{{ pasv_info?.Name }}</div>
                            <div class="u-subtitle">被动招式</div>
                            <div class="u-desc" v-html="formatPasv(pasv_info)"></div>
                        </div>
                        <template #reference
                            ><img
                                :src="showMountIcon(pasv_info?.BelongKungfu)"
                                :alt="pasv_info?.BelongKungfu"
                                :title="pasv_info?.Name"
                                class="u-pasv-pic"
                        /></template>
                    </el-popover>
                </div>
                <div class="m-zhenfa">
                    <!-- <div class="u-title">阵法</div> -->
                    <el-popover width="500px" popper-class="m-pasv-pop" effect="dark">
                        <div class="u-desc" v-html="formatZhenfa(zhenfa_info)"></div>
                        <template #reference>
                            <div class="u-zhenfa-bg" :style="zhenfaBg">
                                <img
                                    :src="iconLink(zhenfa_info[0]?.IconID)"
                                    :alt="zhenfa_info[0]?.IconID"
                                    :title="zhenfa_info[0]?.Name"
                                    class="u-pic"
                                />
                            </div>
                        </template>
                    </el-popover>
                </div>
            </div>
        </div>

        <el-popover
            v-model:visible="visiblePopover"
            :virtual-ref="iconRef"
            trigger="manual"
            :width="226"
            popper-class="m-recipe-pop"
            virtual-triggering
            placement="right"
            effect="dark"
            :show-arrow="false"
            :offset="0"
        >
            <el-tooltip
                v-for="item in selectedRecipe"
                :key="item.idKey"
                popper-class="m-recipe-tooltip"
                placement="top"
            >
                <template #content>
                    <div class="m-recipe-detail">
                        <div class="u-name" :class="'isQuality-' + item.Quality">{{ item.Name }}</div>
                        <div>{{ item.Desc }}</div>
                    </div>
                </template>
                <a class="u-recipe-item" :href="recipeLink(item)">
                    <img :src="iconLink(item.IconID)" class="u-icon" alt="" />
                </a>
            </el-tooltip>
        </el-popover>
    </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "@/store";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getSkills, getTalents, getTalentVersions, getSkill } from "../service/raw";
import { iconLink, showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { getRecipe } from "@/service/node";
import relation from "@jx3box/jx3box-data/data/xf/relation.json";

import kungfumap_std from "@/assets/data/martial/kungfu_std.json";
import kungfumap_origin from "@/assets/data/martial/kungfu_origin.json";
import pasvmap from "@/assets/data/martial/pasv.json";
import zhenfamap from "@/assets/data/martial/zhenfa.json";
import kungfus from "@/assets/data/martial/kungfuid.json";

import { cloneDeep, flattenDeep } from "lodash";
// 奇穴
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";

import SkillItem from "@/components/SkillItem.vue";

export default {
    name: "MartialArts",
    components: {
        SkillItem,
    },
    props: [],
    data() {
        return {
            loading: false,
            data: [],
            talents: [],
            kungfuid: "pasv",

            talentDriver: null,
            recipe: [],
            version: "",

            iconRef: ref(null),
            visiblePopover: false,
            refMap: [],
            selectedRecipe: [],

            skills: [],
            selectedSkill: null,
        };
    },
    computed: {
        // 心法中文名
        subtype() {
            return this.$route.query.subtype || "通用";
        },
        school() {
            return relation.mount_belong_school[this.subtype];
        },
        // 心法id
        mountid: function () {
            return xfmap[this.subtype]?.["id"] || "0";
        },
        client() {
            return useStore().client;
        },
        // 门派技能套路id
        kungfus: function () {
            return this.kungfumap[this.mountid]["kungfus"];
        },
        // 门派技能数据
        kungfusSkills: function () {
            const obj = {};
            Object.entries(this.kungfumap[this.mountid]["skills"]).forEach(([key, value]) => {
                obj[key] = value.map((SkillID) => {
                    const currentSkill = this.data.find((d) => d.SkillID == SkillID);
                    return currentSkill;
                });
            });
            return obj;
        },
        // 门派技能id数组
        skill_ids: function () {
            return flattenDeep(Object.values(this.kungfumap[this.mountid]["skills"]));
        },
        // 心法被动id
        pasv_skills: function () {
            return pasvmap[this.subtype][this.client];
        },
        pasv_info: function () {
            return (
                this.data.filter((d) => d.SkillID === this.pasv_skills[0])?.sort((a, b) => b.Level - a.Level)?.[0] || {}
            );
        },
        // 阵法id
        zhenfa_skills: function () {
            return (this.mountid && zhenfamap[this.mountid]) || [];
        },
        zhenfa_info: function () {
            return this.data.filter((d) => d.SkillID === this.zhenfa_skills[0]);
        },
        zhenfaBg() {
            const school = xfmap[this.subtype]?.school;
            return {
                "background-image": `url(${require(`@/assets/img/matrix/${school}.png`)})`,
            };
        },
        // 奇穴id std
        talent_skills: function () {
            return (this.mountid && this.talents?.[this.mountid]) || [];
        },
        // 镇派id origin
        talent2_skills: function () {
            return (this.mountid && this.talents2?.[this.mountid]) || [];
        },
        // 所有技能id, 用于请求
        ids: function () {
            return [...this.skill_ids, ...this.pasv_skills, ...this.zhenfa_skills].join(",");
        },
        params: function () {
            return {
                ids: this.ids,
                client: this.client,
            };
        },
        kungfumap: function () {
            return this.client == "origin" ? kungfumap_origin : kungfumap_std;
        },
    },
    watch: {
        subtype: {
            async handler() {
                this.refMap = [];
                this.loading = true;
                await this.loadSkills();
                await this.getRecipe();
                await this.getSkill();
                this.loading = false;
                this.reloadTalent();
            },
            immediate: true,
        },
        kungfuid: {
            handler: function () {
                this.loadSkills();
            },
        },
    },
    mounted: async function () {
        this.talents = await getTalents();
        this.installTalent();
    },
    methods: {
        iconLink,
        showMountIcon,
        setRefs: function (ref, item) {
            if (ref) {
                this.refMap.push({
                    ref,
                    item,
                });
            }
        },
        showRecipe: function (id) {
            const index = this.refMap.findIndex((item) => item.item.SkillID == id);
            this.iconRef = this.refMap[index].ref;
            this.selectedRecipe = this.getSkillRecipe(id);
            this.visiblePopover = true;
        },
        async loadSkills() {
            this.loading = true;
            getSkills(this.params)
                .then((res) => {
                    this.data = res.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        removeLowLevelSkills: function (data) {
            let arr = [];
            let _data = [];
            // 只保留最高等级
            data.forEach((item) => {
                if (!arr.includes(item.SkillID)) {
                    arr.push(item.SkillID);
                    _data.push(item);
                } else {
                    let i = arr.indexOf(item.SkillID);
                    if (~~item.Level > ~~_data[i].Level) {
                        _data[i] = item;
                    }
                }
            });
            return _data;
        },
        handleTalentData: function (data) {
            const skills = {
                talent: this.talent_skills,
            };
            const talentSkills = cloneDeep(skills[this.kungfuid]);
            return talentSkills.map((item) => {
                return item.map((SkillID) => {
                    const currentTalent = data.find((d) => d.SkillID == SkillID);

                    return currentTalent;
                });
            });
        },
        async getSkill() {
            if (!this.subtype || this.subtype == "通用") {
                return;
            }
            getSkill(this.subtype, this.client).then((res) => {
                const skills = res?.find((item) => item?.kungfuName == this.subtype);
                this.skills = flattenDeep(
                    skills?.remarks?.map((item) => {
                        return item?.forceSkills;
                    })
                );
            });
        },

        // 技能popup
        showSkill: function (skill) {
            if (!this.subtype || this.subtype == "通用") {
                this.selectedSkill = {
                    skillName: skill.Name,
                    desc: skill.Desc,
                };
            } else {
                const { SkillID, SkillName } = skill;
                this.selectedSkill =
                    this.skills?.find((item) => item._id == SkillID || item.skillName == SkillName) || {};
            }
        },
        hasSkill: function ({ SkillID, SkillName }) {
            return this.skills?.find((item) => item._id == SkillID || item.skillName == SkillName);
        },

        // 技能套路名称
        showKungfuName: function (val) {
            return kungfus[val];
        },
        // 初始化奇穴模拟器（此时渲染使用空奇穴模板）
        installTalent: function () {
            getTalentVersions().then((res) => {
                this.version = res.data?.[0]?.version;
                this.talentDriver = new JX3_QIXUE();
                this.reloadTalent();
            });
        },
        reloadTalent() {
            if (!this.subtype || this.subtype == "通用") return;
            this.$nextTick(() => {
                if (!this.talentDriver) return;
                this.talentDriver?.then((talent) => {
                    talent.load({
                        version: this.version,
                        xf: this.subtype,
                        editable: true,
                    });
                });
            });
        },

        // 秘籍
        async getRecipe() {
            getRecipe({ school: this.school, client: this.client }).then((res) => {
                this.recipe = res.data;
            });
        },
        getSkillRecipe(id) {
            return this.recipe.filter((r) => r.SkillID == id);
        },
        recipeLink(item) {
            return `/item/search/${item.Name}`;
        },

        // 阵法描述
        formatZhenfa(arr) {
            let desc = "";
            const nums = ["一重粗识", "二重略懂", "三重巧熟", "四重精妙", "五重游刃", "六重忘我"];
            const name = arr[0]?.Name;
            // 去除最后一项
            arr = arr.slice(0, -1);
            arr.forEach((item, index) => {
                desc += `${nums[index]}：${item.Desc}</br>`;
            });
            return `${name}<br>${desc}`;
        },
        formatPasv(info) {
            if (!info.Desc) return;
            return info.Desc.replace(/\\n/g, "</br>");
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/martial.less";
</style>
