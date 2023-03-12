<template>
    <div class="p-martial-arts">
        <div v-for="kungfu in kungfus" :key="kungfu">{{ showKungfuName(kungfu) }}</div>
    </div>
</template>

<script>
import { useStore } from "@/store";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getSkills, getTalents } from "../service/raw";
// import { __iconPath, __ossRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import kungfumap_std from "@/assets/data/kungfu_std.json";
import kungfumap_origin from "@/assets/data/kungfu_origin.json";
import pasvmap from "@/assets/data/pasv.json";
import zhenfamap from "@/assets/data/zhenfa.json";
import kungfus from "@/assets/data/kungfuid.json";
import { cloneDeep, flattenDeep } from "lodash";
export default {
    name: "MartialArtsStd",
    props: [],
    data() {
        return {
            loading: false,
            data: [],
            talents: [],
            kungfuid: "pasv",
        };
    },
    computed: {
        subtype() {
            return this.$route.query.subtype || "通用";
        },
        mountid: function () {
            return xfmap[this.subtype]?.["id"] || "0";
        },
        client() {
            return useStore().client;
        },
        kungfus: function () {
            return this.kungfumap[this.mountid]["kungfus"];
        },
        skill_ids: function () {
            return flattenDeep(Object.values(this.kungfumap[this.mountid]["skills"]));
        },
        pasv_skills: function () {
            return pasvmap[this.subtype][this.client];
        },
        zhenfa_skills: function () {
            return (this.mountid && zhenfamap[this.mountid]) || [];
        },
        talent_skills: function () {
            return (this.mountid && this.talents?.[this.mountid]) || [];
        },
        talent2_skills: function () {
            return (this.mountid && this.talents2?.[this.mountid]) || [];
        },
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
            },
        },
        kungfuid: {
            immediate: true,
            handler: function () {
                this.loadSkills();
            },
        },
    },
    mounted: async function () {
        this.talents = await getTalents();
    },
    methods: {
        loadSkills: function () {
            this.loading = true;
            getSkills(this.params)
                .then((res) => {
                    let data = res.data || [];
                    if (this.kungfuid == "zhenfa") {
                        this.data = data;
                    } else if (this.kungfuid === "talent") {
                        this.data = this.handleTalentData(data);
                    } else {
                        this.data = this.removeLowLevelSkills(data);
                    }

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
    },
};
</script>
