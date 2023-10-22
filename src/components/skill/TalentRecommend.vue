<template>
    <div class="m-talent-recommend">
        <div class="m-talent-recommend__header">
            <div class="u-talent-title">
                奇穴推荐
                <el-select size="small" v-model="active" style="width: 150px" v-show="list?.length">
                    <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </div>
        </div>

        <div class="m-talent-recommend__content" v-if="Object.keys(activeData).length">
            <div class="m-talent-box">
                <div v-for="(item, index) in pzCode" :key="index" @click.stop="onSkillClick(item)">
                    <el-popover
                        width="400px"
                        :show-after="100"
                        :hide-after="0"
                        popper-class="m-skill-pop"
                        :show-arrow="false"
                        placement="bottom-start"
                        :offset="0"
                    >
                        <div class="m-talent-skill-item">
                            <div class="u-name u-block">
                                <span>{{ item.name }}</span>
                            </div>
                            <div class="u-descbox">
                                <div class="u-desc" v-html="format(popSkill(item.id)?.desc)"></div>
                            </div>
                        </div>
                        <template #reference>
                            <div class="m-talent-item" :class="{ active: item.id == activeSkill }">
                                <img class="u-skill-icon" :src="iconLink(item.icon)" :alt="item.icon" />
                                <span class="u-name" :title="item.name">{{ item.name }}</span>
                            </div>
                        </template>
                    </el-popover>
                </div>
            </div>
            <div class="m-talent-desc" v-html="nl2br(activeData?.desc)"></div>
        </div>
        <el-alert show-icon type="warning" title="暂无奇穴推荐" class="u-alert" v-else :closable="false"></el-alert>
    </div>
</template>

<script>
import { useStore } from "@/store";
import User from "@jx3box/jx3box-common/js/user.js";
import { getTalentRecommendList } from "@/service/talent_recommend";
import xf from "@jx3box/jx3box-data/data/xf/xf.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

const $store = useStore();

export default {
    name: "TalentRecommend",
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
                return JSON.parse(this.activeData.pzcode);
            } catch (error) {
                return [];
            }
        },
        activeSkill() {
            return $store.activeSkill;
        },
        qixueData() {
            const data = $store.qixueData[this.subtype] || {};
            if (Object.keys(data).length) {
                const _data = [];
                Object.values(data).forEach((item) => {
                    const _item = Object.values(item);
                    _data.push(..._item);
                });
                return _data;
            }
            return [];
        },
        // computedList() {}
    },
    watch: {
        mount: {
            immediate: true,
            handler() {
                this.loadRecommend();
                this.refMap = [];
            },
        },
    },
    methods: {
        iconLink,
        format: function (txt) {
            return txt?.replace(/\\n/g, "\n");
        },
        onSettingIconClick() {
            this.showDialog = true;
        },
        loadRecommend() {
            if (!this.mount) return;
            getTalentRecommendList({ mount: this.mount, client: this.client, subtype: "pvp" })
                .then((res) => {
                    this.list = res.data.data?.list || [];
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
        popSkill(id) {
            return this.qixueData?.find((item) => item.id == id) || null;
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill/talent_recommend.less";
</style>
