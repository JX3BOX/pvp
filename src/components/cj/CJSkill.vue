<template>
    <div class="m-cj-skill">
        <div class="m-search">
            <el-input class="u-input" v-model="search" placeholder="请输入 技能名称 查询" clearable></el-input>
            <el-select class="u-select" v-model="quality">
                <el-option
                    v-for="item in qualities"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                ></el-option>
            </el-select>
            <el-select class="u-select" v-model="skillType">
                <el-option v-for="item in types" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
        </div>
        <div v-if="list.length" class="m-skill-list">
            <div class="u-skill-item">
                <div class="u-td">技能名称</div>
                <div class="u-td">品质</div>
                <div class="u-td">效果</div>
            </div>
            <SkillItem :source="item" v-for="(item, index) in list" :key="item.dwSkillID + index"></SkillItem>
        </div>
        <div v-else class="u-no-data">暂无技能</div>
    </div>
</template>

<script>
import { getDeserts } from "@/service/cj";
import SkillItem from "./CJSkillItem.vue";
export default {
    name: "CJSkill",
    components: {
        SkillItem,
    },
    data() {
        return {
            loading: false,
            originList: [],
            list: [],
            allList: [],
            qualities: [],
            types: [],
            skillType: 0,
            quality: 0,
            search: "",
        };
    },
    computed: {
        client() {
            return "origin";
        },
        params() {
            return {
                skillType: this.skillType,
                quality: this.quality,
                search: this.search,
            };
        },
    },
    watch: {
        params: {
            deep: true,
            handler() {
                if (!this.quality && !this.skillType && !this.search) {
                    this.list = this.originList;
                } else {
                    this.list = this.originList.filter((item) => {
                        return (
                            (!this.quality || item.nQuality === this.quality) &&
                            (!this.skillType || item.nSkillType === this.skillType) &&
                            (!this.search || item.Skill.Name.indexOf(this.search) > -1)
                        );
                    });
                }
            },
        },
    },
    methods: {
        getTypes() {
            const list = this.allList;
            const typeKeys = Array.from(new Set(list.map((item) => item.nSkillType)));
            const qualityKeys = Array.from(new Set(list.map((item) => item.nQuality)));
            this.types = typeKeys.map((value) => {
                return {
                    label: list.find((item) => item.nSkillType === value)?.szSkillTypeDesc,
                    value: value,
                };
            });
            this.qualities = qualityKeys.map((value) => {
                return {
                    label: list.find((item) => item.nQuality === value)?.szQualityDesc,
                    value: value,
                };
            });
        },
        async load() {
            this.loading = true;
            const cache = sessionStorage.getItem(`deserts_${this.client}`);
            if (cache) {
                this.allList = JSON.parse(cache);
                this.getTypes();
                this.list = this.allList.filter((item) => item.dwSkillID);
                this.loading = false;
            } else {
                await getDeserts()
                    .then((res) => {
                        this.allList = res.data.data;
                        this.getTypes();
                        this.list = this.allList.filter((item) => item.dwSkillID);
                        sessionStorage.setItem(`deserts_${this.client}`, JSON.stringify(this.allList));
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
            this.originList = this.list;
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/skill.less";
</style>
