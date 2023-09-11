<template>
    <div class="u-skill-item">
        <div class="u-td">
            <el-popover
                class="u-skill-popover"
                placement="right-start"
                trigger="hover"
                :visible-arrow="false"
                :width="350"
            >
                <template #reference>
                    <div class="u-skill-icon">
                        <img :src="iconLink(iconId || data.IconID, client)" @click.stop="getUrl(data.SkillID)" />
                    </div>
                </template>
                <jx3-skill :data="data"></jx3-skill>
            </el-popover>
            <div v-if="source?.Skill?.Name" class="u-item-name">
                {{ source.Skill.Name }}
            </div>
        </div>
        <div class="u-td">
            {{ source.szQualityDesc }}
        </div>
        <div class="u-td">
            {{ source.szSkillTypeDesc }}
        </div>
    </div>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import Jx3Skill from "./Skill.vue";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "SkillItem",
    props: {
        source: {
            type: Object,
            required: true,
        },
    },
    components: {
        Jx3Skill,
    },
    watch: {
        source: {
            immediate: true,
            deep: true,
            handler(source) {
                this.data = source.Skill;
            },
        },
    },
    computed: {
        iconId() {
            return ~~this.source?.Skill?.IconID || 0;
        },
        id() {
            return ~~this.source?.Skill?.SkillID || 0;
        },
    },
    data() {
        return {
            client: "origin",
            data: {},
        };
    },
    methods: {
        iconLink,
        getUrl(id) {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `app/database/?type=skill&query=${id}`;
            window.open(url, "_blank");
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/cj/skill_item.less";
</style>
