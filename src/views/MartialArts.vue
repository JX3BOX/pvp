<template>
    <div class="p-martial-content">
        <div class="p-martial-arts" v-show="!isSpecialSkill">
            <!-- 客户端切换 -->
            <div class="m-client">
                <div
                    class="u-fixed"
                    :class="{
                        'u-fixed__r': clientHoverStatus,
                    }"
                ></div>
                <router-link
                    class="u-client"
                    @mouseenter="hoverClient('left')"
                    @mouseleave="leaveClient"
                    :to="{ query: { subtype, tab, is_wujie: 0 } }"
                >
                    旗舰端
                </router-link>
                <router-link
                    class="u-client"
                    @mouseenter="hoverClient('right')"
                    @mouseleave="leaveClient"
                    :to="{ query: { subtype, tab, is_wujie: 1 } }"
                >
                    无界端
                </router-link>
            </div>

            <!-- 面板 -->
            <div class="m-martial-skills" v-loading="loading">
                <!-- 套路（武学面板的一行） -->
                <div class="m-martial-skill" v-for="(kungfu_row, kungfu_id) in kungfu_skills" :key="kungfu_id">
                    <!-- 套路标题 -->
                    <div class="u-title">
                        <span class="u-title-name">{{ kungfu_row[0]?.kungfu_name }}</span>
                        <img src="../assets/img/skillset.png" class="u-title-img" alt="" />
                    </div>
                    <!-- 套路技能 -->
                    <div class="m-skills">
                        <template v-for="(kungfu_item, index) in kungfu_row" :key="index">
                            <template v-if="index > 0 && clientOptionVal != 'wujie'">
                                <div class="m-connect" v-if="kungfu_row[index - 1].skill_id == kungfu_item.prev">
                                    <img class="u-img" src="@/assets/img/arrow.png" />
                                </div>
                            </template>
                            <div
                                class="m-skill"
                                v-if="!kungfu_item.belong"
                                :class="{
                                    'u-not-mount': !isCurrentMountSkill(kungfu_item.skill),
                                    'is-right': kungfu_item.firstRight,
                                }"
                                @click="isCurrentMountSkill(kungfu_item.skill) && setSkill(kungfu_item.skill)"
                            >
                                <el-popover
                                    width="400px"
                                    :show-after="100"
                                    :hide-after="0"
                                    :show-arrow="false"
                                    :offset="0"
                                    popper-class="m-skill-pop"
                                    placement="bottom-start"
                                >
                                    <div v-if="popover_skill">
                                        <skill-item-v2 :item="popover_skill"></skill-item-v2>
                                    </div>
                                    <template #reference>
                                        <div
                                            class="u-skill"
                                            :class="{ active: activeSkill == kungfu_item.skill.SkillID }"
                                        >
                                            <div class="m-skill-icon">
                                                <img
                                                    class="u-skill-icon"
                                                    :class="{
                                                        isWuJie: clientOptionVal == 'wujie',
                                                    }"
                                                    :src="iconLink(kungfu_item.skill.IconID, this.client)"
                                                    :alt="kungfu_item.skill.IconID"
                                                    @mousemove="showSkill(kungfu_item.skill)"
                                                />

                                                <img
                                                    v-if="
                                                        getSkillRecipe(
                                                            kungfu_item.skill?.SkillID,
                                                            kungfu_item.skill.Name
                                                        ).length
                                                    "
                                                    class="u-icon"
                                                    src="@/assets/img/challenge.png"
                                                    :ref="(el) => setRefs(el, kungfu_item.skill)"
                                                    @click.stop="
                                                        showRecipe(kungfu_item.skill?.SkillID, kungfu_item.skill.Name)
                                                    "
                                                />
                                                <img
                                                    v-if="audios[kungfu_item.skill?.SkillID]"
                                                    class="u-icon-audio"
                                                    src="@/assets/img/audio_icon.png"
                                                    @click.stop="showAudio(kungfu_item.skill?.SkillID, $event.target)"
                                                />
                                                <img
                                                    class="u-icon-switch"
                                                    v-if="
                                                        skillSwitchList[
                                                            kungfu_item.switchBelong || kungfu_item.skill_id
                                                        ]
                                                    "
                                                    src="@/assets/img/skill_switch.png"
                                                    @click.stop="
                                                        showSkillSwitch(kungfu_item, kungfu_id, index, $event.target)
                                                    "
                                                />
                                            </div>
                                            <span class="u-name" :title="kungfu_item.skill.Name">{{
                                                kungfu_item.skill.Name
                                            }}</span>
                                        </div>
                                    </template>
                                </el-popover>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="m-talent-box qx-container" v-show="subtype && subtype !== '通用'"></div>
            </div>
            <!-- 右侧心法被动 & 阵法 & 奇穴推荐 -->
            <div class="m-martial-extend" v-if="subtype && subtype !== '通用'">
                <div class="m-mount-info">
                    <div class="m-pasv">
                        <!-- 门派内功-->
                        <el-popover width="450px" popper-class="m-pasv-pop" effect="dark" :show-arrow="false">
                            <skill-item-v2 :item="pasvSkill"></skill-item-v2>
                            <template #reference>
                                <div class="m-pasv" :class="{ active: activeSkill == pasvSkill.SkillID }">
                                    <img
                                        :src="showMountIcon(mountid)"
                                        :alt="mountid"
                                        :title="pasvSkill.Name"
                                        class="u-pasv-pic"
                                        @click="setSkill(pasvSkill)"
                                    />
                                    <span class="u-name" :title="subtype">{{ subtype }}</span>
                                </div>
                            </template>
                        </el-popover>
                    </div>
                    <div class="m-zhenfa">
                        <!-- 阵法技能 -->
                        <el-popover width="500px" popper-class="m-pasv-pop" effect="dark" :show-arrow="false">
                            <div class="m-zhenfa-info">
                                <div class="u-zhenfa-bg" :style="zhenfaBg">
                                    <img
                                        :src="iconLink(formationSkill.IconID)"
                                        :alt="formationSkill.IconID"
                                        :title="formationSkill.Name"
                                        class="u-pic"
                                    />
                                </div>
                                <div class="u-desc" v-html="formationSkillDesc"></div>
                            </div>
                            <template #reference>
                                <div class="m-pasv" :class="{ active: activeSkill == formationSkill.SkillID }">
                                    <img
                                        :src="iconLink(formationSkill.IconID)"
                                        :alt="formationSkill.IconID"
                                        :title="formationSkill.Name"
                                        class="u-pasv-pic"
                                        @click="setSkill(formation_skill.skill[0])"
                                    />
                                    <span class="u-name" :title="formationSkill.Name">{{ formationSkill.Name }}</span>
                                </div>
                            </template>
                        </el-popover>
                    </div>
                </div>

                <TalentRecommend v-if="clientOptionVal != 'wujie'" />
            </div>

            <!-- 技能秘籍悬浮窗 -->
            <el-popover
                :visible="visiblePopover"
                :virtual-ref="iconRef"
                trigger="manual"
                transition="el-zoom-in-top"
                :width="226"
                popper-class="m-recipe-pop"
                virtual-triggering
                placement="right"
                effect="dark"
                :show-arrow="false"
                :offset="0"
                :popper-options="{
                    closeOnDocumentClick: true,
                }"
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

            <!-- 技能音效悬浮窗 -->
            <el-popover
                :visible="visibleAudioPopover"
                :virtual-ref="audioIconRef"
                virtual-triggering
                trigger="manual"
                transition="el-zoom-in-top"
                popper-class="m-audio-pop"
                placement="right"
                effect="dark"
                :width="320"
                :show-arrow="false"
                :offset="0"
            >
                <skill-audio
                    class="u-audio"
                    :src="audioUrl(audio.file)"
                    :remark="audio.remark"
                    v-for="audio in currentAudios"
                    :key="audio.file"
                ></skill-audio>
            </el-popover>

            <!-- 技能切换悬浮窗 -->
            <el-popover
                :visible="skillSwitchPopover"
                :virtual-ref="skillSwitchRef"
                virtual-triggering
                trigger="manual"
                transition="el-zoom-in-top"
                placement="right"
                popper-class="m-audio-pop"
                effect="dark"
                :width="320"
                :show-arrow="false"
                :offset="0"
            >
                <div
                    v-for="(item, key) in skillSwitchData.list"
                    :key="key"
                    style="cursor: pointer"
                    @click="skillSwitch(item)"
                >
                    {{ item.skill.Name }}
                    <span style="font-size: 10px; color: gray">{{ item.skill.Remark }}</span>
                </div>
            </el-popover>
        </div>

        <skillWiki ref="skillWiki" :is-pasv-skill="activeSkill == pasvSkill.SkillID"></skillWiki>

        <SpecialSkill :mount="mountid"></SpecialSkill>
    </div>
</template>

<script>
import { getKungfuPanel } from "@/service/node";
import { ref } from "vue";
import { groupBy } from "lodash";
import SkillItemV2 from "@/components/SkillItemV2.vue";

import { useStore } from "@/store";

import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getTalents, getBreadcrumb, getSkillAudios } from "../service/raw";
import { iconLink, showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { getRecipe } from "@/service/node";
import relation from "@jx3box/jx3box-data/data/xf/relation.json";
import schools from "@jx3box/jx3box-data/data/xf/school.json";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
// 奇穴
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";

import SkillWiki from "@/components/skill/SkillWiki.vue";
import TalentRecommend from "@/components/skill/TalentRecommend.vue";
import SpecialSkill from "@/components/skill/SpecialSkills.vue";
import SkillAudio from "@/components/skill/SkillAudio.vue";

const $store = useStore();

export default {
    name: "MartialArts",
    components: {
        SkillAudio,
        SkillWiki,
        TalentRecommend,
        SpecialSkill,
        SkillItemV2,
    },
    data() {
        return {
            loading: false,
            data: [],
            talents: [],
            kungfuid: "pasv",

            audios: {},
            currentAudios: [],
            audioIconRef: null,
            visibleAudioPopover: false,

            skillSwitchPopover: false,
            skillSwitchRef: null,
            skillSwitchList: {},
            skillSwitchData: {},

            talentDriver: null,
            recipe: [],
            version: {
                std: "",
                wujie: "",
            },

            iconRef: ref(null),
            visiblePopover: false,
            refMap: [],
            selectedRecipe: [],

            skills: [],
            subSkills: [],
            ExtraPointKey: "",

            isSpecialSkill: false,

            // 当前悬浮窗展示的技能
            popover_skill: null,

            // 心法被动增加属性技能
            pasv_skill: "",
            // 心法阵法描述
            formation_skill: "",
            // 套路技能
            kungfu_skills: {},

            clientHoverStatus: false,
        };
    },
    computed: {
        // 心法中文名
        subtype() {
            return this.$route.query.subtype || "冰心诀";
        },
        school() {
            return relation.mount_belong_school[this.subtype];
        },
        schoolid() {
            return schools[this.school].school_id;
        },
        kungfuId() {
            return xfmap[this.subtype]?.["kungfuId"];
        },
        // 心法id
        mountid: function () {
            return xfmap[this.subtype]?.["id"] || "0";
        },
        client() {
            return $store.client;
        },
        activeSkill() {
            return $store.activeSkill;
        },
        pasvSkill() {
            return this.pasv_skill?.skill || {};
        },
        formationSkill() {
            let result = { Name: "阵法", IconID: 13 };
            const skills = this.formation_skill?.skill;
            if (!skills) return result;
            result = skills[0];
            return result;
        },
        formationSkillDesc() {
            let result = "";
            const skills = this.formation_skill?.skill;
            if (!skills) return result;
            const nums = ["一重粗识", "二重略懂", "三重巧熟", "四重精妙", "五重游刃", "六重忘我", "七重归一"];
            skills.forEach((item, index) => {
                result += `<div>${nums[index]}：${item.Desc}</div>`;
            });

            return result;
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
        params: function () {
            return {
                ids: this.ids,
                client: this.client,
            };
        },
        // tl skillIds
        tlSkillIds: function () {
            return this.skills.map((item) => ~~item._id);
        },
        tab: function () {
            return this.$route.query.tab;
        },
        clientOptionVal: function () {
            return this.$route.query.is_wujie * 1 ? "wujie" : "std";
        },
    },
    watch: {
        subtype: {
            async handler() {
                this.refMap = [];
                this.loading = true;
                await this.loadMountKungfuPanel();
                await this.getRecipe();
                this.loading = false;
                this.reloadTalent();
                this.getAudioIndex();
            },
            immediate: true,
        },
        async clientOptionVal() {
            this.loading = true;
            await this.loadMountKungfuPanel();
            await this.getRecipe();
            this.reloadTalent();
            this.loading = false;
        },
    },
    mounted: async function () {
        this.talents = await getTalents();
        this.installTalent();
        // 虚拟触发。点击悬浮窗外部，关闭悬浮窗
        document.addEventListener("click", this.clickEvent);
    },
    beforeUnmount() {
        document.removeEventListener("click", this.clickEvent);
    },
    methods: {
        iconLink,
        showMountIcon,
        isCurrentMountSkill(skill) {
            // 无界端不做判断，技能都亮起
            if (this.clientOptionVal == "wujie") return true;
            return !skill.MountRequestDetail || skill.MountRequestDetail == this.mountid;
        },
        clickEvent: function (event) {
            const whiteList = ["m-recipe-pop", "m-audio-pop"];
            const target = event.target;
            if (!target.parentElement || whiteList.some((item) => target.closest(`.${item}`))) {
                return;
            }
            this.visibleAudioPopover = false;
            this.visiblePopover = false;
            this.skillSwitchPopover = false;
        },
        audioUrl: function (path) {
            return `${JX3BOX.__dataPath}/audio/src/${path}`;
        },
        setRefs: function (ref, item) {
            if (ref) {
                this.refMap.push({
                    ref,
                    item,
                });
            }
        },
        showRecipe: function (id, name) {
            const index = this.refMap.findIndex((item) => item.item.SkillID == id);
            if (this.iconRef == this.refMap[index].ref && this.visiblePopover) {
                this.visiblePopover = false;
                return;
            }
            this.iconRef = this.refMap[index].ref;
            this.selectedRecipe = this.getSkillRecipe(id, name);
            this.visiblePopover = true;
        },
        showAudio: function (id, ref) {
            if (this.audioIconRef == ref && this.visibleAudioPopover) {
                this.visibleAudioPopover = false;
                return;
            }
            this.currentAudios = this.audios[id];
            this.audioIconRef = ref;
            this.visibleAudioPopover = true;
        },
        showSkillSwitch(itemData, kungfu_id, listIndex, ref) {
            if (this.skillSwitchRef == ref && this.skillSwitchPopover) {
                this.skillSwitchPopover = false;
                return;
            }
            this.skillSwitchRef = ref;
            this.skillSwitchData = {};
            this.skillSwitchData.kungfu_id = kungfu_id;
            this.skillSwitchData.listIndex = listIndex;
            this.skillSwitchData.list = this.skillSwitchList[itemData.switchBelong || itemData.skill_id];
            this.skillSwitchPopover = true;
        },
        skillSwitch(itemData) {
            let listObj = JSON.parse(JSON.stringify(this.skillSwitchList[itemData.switchBelong || itemData.skill_id]));
            let fillVal = listObj[itemData.skill_id];
            fillVal.belong = "";
            this.kungfu_skills[this.skillSwitchData.kungfu_id][this.skillSwitchData.listIndex] = fillVal;
        },
        // 加载技能位置等信息
        async loadMountKungfuPanel() {
            let mount_id = this.mountid;
            let parClient = this.client;
            if (this.clientOptionVal == "wujie") {
                parClient = this.clientOptionVal;
                // 无界端-》藏剑id修改
                if (mount_id == 10144) mount_id = 100725;
                this.leaveClient();
            }
            getKungfuPanel({ client: parClient, mount_id }).then((res) => {
                this.kungfu_skills = {};
                const list = res.data.data;
                // 心法被动描述取第二个
                const pasv_skill = list.find((item) =>
                    this.clientOptionVal == "wujie" ? item.kungfu_id == -1 : item.column == -1
                );
                if (this.clientOptionVal != "wujie") {
                    pasv_skill.skill[0].Desc = pasv_skill.skill[1].Desc;
                    pasv_skill.skill[0].parse.desc = pasv_skill.skill[1].parse.desc;
                    pasv_skill.skill = pasv_skill.skill[0];
                }
                this.pasv_skill = pasv_skill;
                //
                if (this.clientOptionVal != "wujie") {
                    const formation_skill = list.find((item) => item.column == -2);
                    formation_skill.skill = formation_skill.skill.sort((a, b) => a.Level - b.Level);
                    this.formation_skill = formation_skill;
                } else {
                    this.formation_skill = "";
                }
                const kungfu_skills = groupBy(
                    list.filter((item) => item.column >= 0).sort((a, b) => a.column - b.column),
                    "kungfu_id"
                );
                for (const key in kungfu_skills) {
                    let firstRight = kungfu_skills[key].find((item) => item.column == 1);
                    if (firstRight) firstRight.firstRight = true;

                    kungfu_skills[key].forEach((item) => {
                        if (item.belong) {
                            item.switchBelong = item.belong;
                            if (!this.skillSwitchList[item.belong]) {
                                this.skillSwitchList[item.belong] = {};
                            }
                            this.skillSwitchList[item.belong][item.skill_id] = item;

                            kungfu_skills[key].forEach((parItem) => {
                                if (parItem.skill_id == item.belong) {
                                    this.skillSwitchList[item.belong][parItem.skill_id] = parItem;
                                }
                            });
                        }
                    });
                }
                // 无界端删除多余技能
                if (this.clientOptionVal == "wujie") {
                    delete kungfu_skills["-1"];
                    delete kungfu_skills["0"];
                    delete kungfu_skills["5"];

                    let seenNames = [];
                    for (const key in kungfu_skills) {
                        kungfu_skills[key] = kungfu_skills[key].filter((item) => {
                            if (seenNames.indexOf(item.skill.Name) == -1 && item.skill.IconID !== null) {
                                seenNames.push(item.skill.Name);
                                return true;
                            }
                            return false;
                        });
                        if (kungfu_skills[key].length == 0) {
                            delete kungfu_skills[key];
                        }
                    }
                }
                this.kungfu_skills = kungfu_skills;
                this.setSkill(this.pasv_skill.skill);
            });
        },
        // 技能popup
        showSkill(skill) {
            this.popover_skill = skill;
        },
        // 设置activeSkill
        setSkill(skill) {
            $store.setActiveSkill(skill?.SkillID);
        },

        // 初始化奇穴模拟器（此时渲染使用空奇穴模板）
        installTalent: async function () {
            await getBreadcrumb("pvp_talent_version").then((res) => {
                this.version.std = res.data?.data?.html;
            });
            await getBreadcrumb("pvp_talent_version_mobile").then((res) => {
                this.version.wujie = res.data?.data?.html;
            });
            this.talentDriver = new JX3_QIXUE({
                version: this.version[this.clientOptionVal],
                client: this.clientOptionVal,
            });
            this.reloadTalent();
        },
        reloadTalent() {
            if (!this.subtype || this.subtype == "通用") return;
            this.$nextTick(() => {
                if (!this.talentDriver) return;
                this.talentDriver?.then((talent) => {
                    $store.qixueData = talent?._data;
                    talent.load({
                        version: this.version[this.clientOptionVal],
                        xf: this.subtype,
                        editable: true,
                        client: this.clientOptionVal,
                    });
                });
            });
        },

        // 秘籍
        async getRecipe() {
            let school = this.school;
            if (this.clientOptionVal == "wujie") school = this.subtype;
            getRecipe({ school, client: this.client }).then((res) => {
                this.recipe = res.data;
            });
        },
        getSkillRecipe(id, name) {
            if (this.clientOptionVal == "wujie") {
                return this.recipe.filter((r) => r.KungfuName == name);
            } else {
                return this.recipe.filter((r) => r.SkillID == id);
            }
        },
        recipeLink(item) {
            return `/item/search/${item.Name}`;
        },
        // 技能音频索引文件
        getAudioIndex() {
            getSkillAudios(this.schoolid).then((data) => {
                this.audios = data;
            });
        },
        hoverClient(side) {
            if (side == "left") {
                this.clientHoverStatus = false;
            } else {
                this.clientHoverStatus = true;
            }
        },
        leaveClient() {
            if (this.clientOptionVal == "wujie") {
                this.clientHoverStatus = true;
            } else {
                this.clientHoverStatus = false;
            }
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/martial.less";
.p-martial-content {
    display: flex;
    flex-direction: column;
}
</style>
