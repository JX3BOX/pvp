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
            <el-tabs v-model="type" type="card">
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
                    <ul class="m-collection-list" v-if="data && data.length">
                        <li class="u-item" v-for="(item, j) in data" :key="j">
                            <a :href="getItemLink(item)" target="_blank">
                                <img class="u-icon" :src="iconLink(item.icon, client)" />
                                <span class="u-name">{{ item.name }}</span>
                                <span class="u-xf"> ({{ getBelongTo(item) }}) </span>
                                <span class="u-desc">{{ item.desc }}</span>
                                <span class="u-remark">{{ item.content }}</span>
                            </a>
                        </li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { markRaw } from "vue";
import { useStore } from "@/store";
import { getSpecialSkillList, getSpecialSkillGroup } from "@/service/raw";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import schoolMap from "@jx3box/jx3box-data/data/xf/schoolid.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";

export default {
    name: "SpecialSkill",
    data() {
        return {
            data: [],

            isCollapse: false,

            types: [],
            type: "jianshang",
            icons: markRaw({
                jianshang: "Sugar",
                diyu: "Dessert",
                wudi: "IceCream",
                kongzhi: "HotWater",
                jiekong: "ColdDrink",
                qusan: "Watermelon",
                jianliao: "Grape",
                daduan: "Cherry",
                weiyi: "Apple",
                jixing: "MilkTea",
                jiansu: "Lollipop",
                chaofeng: "IceCreamRound",
                huifu: "IceDrink",
                chuantou: "KnifeFork",
                chuanci: "Scissor",
                guanti: "ForkSpoon",
            }),
        };
    },
    computed: {
        client() {
            return useStore().client;
        },
        subtype() {
            return this.$route.query.subtype;
        },
        school() {
            return xfmap[this.subtype]?.school || 0;
        },
        mount() {
            return xfmap[this.subtype]?.id || 0;
        },
    },
    watch: {
        type() {
            this.loadSkill();
        },
        subtype() {
            this.loadSkill();
        },
        isCollapse(val) {
            if (val) {
                this.loadGroup();
                this.loadSkill();
            }
        },
    },
    methods: {
        iconLink(id) {
            return iconLink(id);
        },
        loadSkill() {
            this.loading = true;
            getSpecialSkillList({ group: this.type, client: this.client, school: this.school })
                .then((res) => {
                    this.data = res.data.data.filter((item) => item?.mount == this.mount || !item?.mount);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadGroup() {
            getSpecialSkillGroup().then((res) => {
                this.types = res.data.data.map((item) => {
                    return {
                        ...item,
                        icon: this.icons[item.name],
                        key: item.name,
                    };
                });
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
