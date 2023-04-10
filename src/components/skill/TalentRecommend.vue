<template>
    <div class="m-talent-recommend">
        <div class="m-talent-recommend__header">
            <div class="u-talent-title">
                奇穴推荐
                <el-select size="small" v-model="active" style="width: 150px" v-show="list?.length">
                    <el-option v-for="item in list" :key="item.key" :label="item.key" :value="item.id"></el-option>
                </el-select>
            </div>
            <el-icon v-if="isEditor" class="u-edit-icon" @click="onSettingIconClick"><Setting /></el-icon>
        </div>

        <div class="m-talent-recommend__content">
            <div class="m-talent-box">
                <div
                    class="m-talent-item"
                    v-for="(item, index) in pzCode"
                    :key="index"
                    @click.stop="onSkillClick(item)"
                    :class="{ active: item.id == activeSkill }"
                >
                    <img class="u-skill-icon" :src="iconLink(item.icon)" :alt="item.icon" />
                    <span class="u-name" :title="item.name">{{ item.name }}</span>
                </div>
            </div>
            <div class="m-talent-desc" v-html="nl2br(activeData?.desc)"></div>
        </div>

        <TalentRecommendDrawer v-model="showDialog" :data="list" :mount="mount" @update="loadRecommend" />
    </div>
</template>

<script>
import { useStore } from "@/store";
import User from "@jx3box/jx3box-common/js/user.js";
import { getTalentRecommendList } from "@/service/talent_recommend";
import xf from "@jx3box/jx3box-data/data/xf/xf.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
// components
import TalentRecommendDrawer from "./TalentRecommendDrawer.vue";

const $store = useStore();

export default {
    name: "TalentRecommend",
    components: {
        TalentRecommendDrawer,
    },
    data() {
        return {
            showDialog: false,

            list: [],
            active: "",
        };
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
        subtype() {
            return this.$route.query?.subtype || "冰心诀";
        },
        mount() {
            return xf[this.subtype]?.id || 0;
        },
        client() {
            return useStore().client;
        },
        activeData() {
            return this.list.find((item) => item.id == this.active) || {};
        },
        pzCode() {
            try {
                return JSON.parse(this.activeData.pz_code);
            } catch (error) {
                return [];
            }
        },
        activeSkill() {
            return $store.activeSkill;
        },
    },
    watch: {
        mount: {
            immediate: true,
            handler() {
                this.loadRecommend();
            },
        },
    },
    methods: {
        iconLink,
        onSettingIconClick() {
            this.showDialog = true;
        },
        loadRecommend() {
            if (!this.mount) return;
            getTalentRecommendList({ mount: this.mount, client: this.client })
                .then((res) => {
                    this.list = res.data.data || [];
                    this.active = this.list[0]?.id || "";
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        nl2br(str) {
            return (str && str.replace(/\n/g, "<br/>")) || "";
        },
        onSkillClick(item) {
            $store.setActiveSkill(item?.id);
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill/talent_recommend.less";
</style>
