<template>
    <div class="p-martial-arts">
        <div class="m-martial-skills">
            <div v-for="kungfu in kungfus" :key="kungfu" class="m-martial-skill">
                <div class="u-title">{{ showKungfuName(kungfu) }}</div>
                <div class="m-skills" v-if="kungfusSkills[kungfu]">
                    <div
                        class="m-skill"
                        v-for="skill in kungfusSkills[kungfu]"
                        :key="skill?.SkillID"
                        :title="`${skill?.SkillName}`"
                    >
                        <img v-if="skill?.IconID" :src="iconLink(skill.IconID)" :alt="skill.IconID" />
                        <img
                            v-if="getSkillRecipe(skill?.SkillID).length"
                            class="u-icon"
                            src="@/assets/img/challenge.png"
                            :ref="(el) => setRefs(el, skill)"
                            @click="showRecipe(skill?.SkillID)"
                        />
                        <!-- <div class="m-recipe">{{ getSkillRecipe(skill?.SkillID) }}</div> -->
                    </div>
                </div>
            </div>

            <div class="m-talent-box qx-container"></div>
        </div>
        <div class="m-martial-extend">
            <div class="m-mount-info">
                <div class="m-zhenfa">
                    <div class="u-title">阵法</div>
                    <el-popover width="500px">
                        <div v-html="formatZhenfa(zhenfa_info)"></div>
                        <template #reference>
                            <img
                                :src="iconLink(zhenfa_info[0]?.IconID)"
                                :alt="zhenfa_info[0]?.IconID"
                                :title="zhenfa_info[0]?.Name"
                                class="u-pic"
                            />
                        </template>
                    </el-popover>
                </div>
                <div class="m-pasv">
                    <div class="u-title">门派内功</div>
                    <el-popover width="450px">
                        <div v-html="formatPasv(pasv_info)"></div>
                        <template #reference
                            ><img
                                :src="showMountIcon(pasv_info?.BelongKungfu)"
                                :alt="pasv_info?.BelongKungfu"
                                :title="pasv_info?.Name"
                                class="u-pic"
                        /></template>
                    </el-popover>
                </div>
            </div>
        </div>

        <el-popover
            v-model:visible="visiblePopover"
            :virtual-ref="iconRef"
            trigger="manual"
            width="300px"
            popper-class="m-recipe-pop"
            virtual-triggering
        >
            <div class="u-recipe-item" v-for="item in selectedRecipe" :key="item.idKey" :title="item.Desc">
                <img :src="iconLink(item.IconID)" class="u-icon" alt="" />
                <span class="u-name" :class="'isQuality-' + item.Quality">{{ item.RecipeName }}</span>
            </div>
        </el-popover>
    </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "@/store";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getSkills, getTalents, getTalentVersions } from "../service/raw";
import { iconLink, showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { getRecipe } from "@/service/node";
import relation from "@jx3box/jx3box-data/data/xf/relation.json";

import kungfumap_std from "@/assets/data/kungfu_std.json";
import kungfumap_origin from "@/assets/data/kungfu_origin.json";
import pasvmap from "@/assets/data/pasv.json";
import zhenfamap from "@/assets/data/zhenfa.json";
import kungfus from "@/assets/data/kungfuid.json";

import { cloneDeep, flattenDeep } from "lodash";
// 奇穴
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";

export default {
    name: "MartialArts",
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
            handler: function () {
                // this.kungfuid = "pasv";
                this.loadSkills();
                this.getRecipe();
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
        loadSkills: function () {
            this.loading = true;
            getSkills(this.params)
                .then((res) => {
                    this.data = res.data;

                    /**
                     * TODO:
                     * 1. 技能套路
                     * 2. 阵眼
                     * 3. 门派内功
                     * 4. 秘籍
                     */
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
        getRecipe() {
            getRecipe({ school: this.school, client: this.client }).then((res) => {
                this.recipe = res.data;
            });
        },
        getSkillRecipe(id) {
            return this.recipe.filter((r) => r.SkillID == id);
        },

        // 阵法描述
        formatZhenfa(arr) {
            let desc = "";
            // 去除最后一项
            arr = arr.slice(0, -1);
            arr.forEach((item) => {
                desc += `${item.Desc}</br>`;
            });
            return desc;
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
