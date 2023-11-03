<template>
    <div class="m-special-skill">
        <div class="m-special-skill__header" @click="isCollapse = !isCollapse">
            <div class="u-special-title">
                <el-icon><Filter /></el-icon>技能分类

                <el-icon class="u-collapse-icon" :title="!isCollapse ? '展开' : '折叠'"
                    ><ArrowUp v-if="isCollapse" /><ArrowDown v-else
                /></el-icon>
            </div>
            <!-- <el-icon class="u-icon" v-if="isEditor" @click.stop="dialogFormVisible = true"><Setting /></el-icon> -->
        </div>

        <div class="m-special-skill__content" v-if="isCollapse">
            <el-tabs v-model="type">
                <el-tab-pane :label="item.label" :name="item.key" v-for="(item, i) in types" :key="i">
                    <template #label>
                        <span class="u-tab-icon">
                            <el-icon :size="16">
                                <component :is="item.icon"></component>
                            </el-icon>
                            {{ item.label }}
                        </span>
                    </template>
                    <div class="m-collection-box">
                        <div class="m-collection-header" v-html="item.desc"></div>
                    </div>

                    <ul class="m-collection-list">
                        <li class="u-item" v-for="(skill, j) in item.skills" :key="j">
                            <a :href="getItemLink(skill)" target="_blank">
                                <img class="u-icon" :src="iconLink(skill.icon, client)" />
                                <span class="u-name">{{ skill.name }}</span>
                                <span class="u-xf"> ({{ getBelongTo(skill) }}) </span>
                                <span class="u-desc">{{ skill.desc }}</span>
                                <span class="u-remark">{{ skill.content }}</span>
                            </a>
                        </li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { useStore } from "@/store";
import { getSpecialSkillGroup } from "@/service/raw";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import schoolMap from "@jx3box/jx3box-data/data/xf/schoolid.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";

export default {
    name: "SpecialSkill",
    data() {
        return {
            isCollapse: true,

            types: [],
            type: "",
        };
    },
    computed: {
        client() {
            return useStore().client;
        },
        subtype() {
            return this.$route.query.subtype || "冰心诀";
        },
        school() {
            return this.subtype === "通用" ? (this.subtype ? 0 : "") : xfmap[this.subtype]?.school;
        },
        mount() {
            return xfmap[this.subtype]?.id || 0;
        },
    },
    watch: {
        subtype() {
            this.loadGroup();
        },
        isCollapse: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.loadGroup();
                }
            },
        },
    },
    methods: {
        iconLink(id) {
            return iconLink(id);
        },
        loadGroup() {
            getSpecialSkillGroup().then((res) => {
                this.types = res.data.data
                    .map((item) => {
                        return {
                            ...item,
                            icon: item.extend,
                            key: item.name,
                        };
                    })
                    .filter((item) => !["chuanci", "chuantou", "guanti"].includes(item.key) && item.skills.length > 0)
                    .map((item) => {
                        return {
                            ...item,
                            skills: item.skills
                                .filter(
                                    (skill) =>
                                        (skill?.mount == this.mount || !skill?.mount) &&
                                        skill?.school == this.school &&
                                        skill?.client == this.client
                                )
                                .sort((a, b) => a.idKey - b.idKey),
                        };
                    });
                this.type = this.types[0]?.key;
            });
        },
        getBelongTo({ school, mount }) {
            return mount ? xfid[mount] : schoolMap[school];
        },
        getItemLink: function (item) {
            return getLink(item.type || "skill", item.id);
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/skill/special_skill.less";
</style>
