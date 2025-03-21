<template>
    <div class="m-compare-option">
        <div class="m-compare-mode">
            <div class="u-title">对比模式</div>
            <div class="u-tabs">
                <div
                    v-for="(item, index) in tabs"
                    :key="index"
                    class="u-tab"
                    :class="{ 'is-active': compareMode === item.name }"
                    @click="compareMode = item.name"
                >
                    <div class="u-icon"><img :src="item.icon" alt="" /></div>
                    <div class="u-title">{{ item.title }}</div>
                    <!-- <div class="u-subtitle">对比</div> -->
                </div>
            </div>
        </div>
        <div class="m-compare-entity">
            <p class="u-title">单位选择</p>
            <ul>
                <li
                    v-for="(id, index) in compareEntity"
                    :key="index"
                    :class="{
                        'is-active': id != null,
                    }"
                    @click.stop="showSelectView(id)"
                >
                    <div v-if="id == null">
                        <el-icon><Plus /></el-icon>
                    </div>
                    <div v-else>
                        <div class="u-entity">
                            <div class="u-entity-icon">
                                <img :src="getMountIcon(id)" alt="" />
                            </div>
                            <div class="u-entity-name">{{ getEntityName(id) }}</div>
                        </div>
                        <el-icon class="u-close" @click.stop="removeEntity(id)"><Close /></el-icon>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { getMountIcon, getEntityName } from "@/utils/jcl/common";
import { mapWritableState } from "pinia";
import { usePve } from "@/pages/jcl/store_pve";
import { useStore } from "@/pages/jcl/store";

export default {
    name: "CompareOption",
    data: () => ({
        tabs: [
            {
                title: "伤害",
                name: "damage",
                icon: require("@/assets/img/jcl/stat/damage.svg"),
            },
            {
                title: "治疗",
                name: "treat",
                icon: require("@/assets/img/jcl/stat/treat.svg"),
            },
            {
                title: "承伤",
                name: "beDamaged",
                icon: require("@/assets/img/jcl/stat/beDamaged.svg"),
            },
            {
                title: "承疗",
                name: "beTreated",
                icon: require("@/assets/img/jcl/stat/beTreated.svg"),
            },
            {
                title: "主动招式",
                name: "skill",
                icon: require("@/assets/img/jcl/stat/swirl.svg"),
            },
        ],
    }),
    computed: {
        ...mapWritableState(usePve, ["compareEntity", "compareSelectVisible", "compareMode"]),
        entities() {
            const store = useStore();
            return Object.values(store.result.entities)
                .slice(1)
                .filter((player) => player.type === "player");
        },
    },
    methods: {
        getMountIcon,
        getEntityName,
        removeEntity(id) {
            this.compareEntity = this.compareEntity.map((item) => (item == id ? null : item));
            const arr = this.compareEntity.filter((item) => item != null);
            if (arr.length == 0) {
                this.compareSelectVisible = true;
            }
        },
        showSelectView(id) {
            if (id == null) {
                this.compareSelectVisible = true;
            }
        },
    },
};
</script>

<style lang="less">
.m-compare-option {
    .w(400px);
    display: flex;
    flex-direction: column;
    gap: 20px;
    .u-title {
        .fz(20px,26px);
        .bold;
        .mb(10px);
    }
    .m-compare-entity {
        ul {
            .flex;
            gap: 10px;
            li {
                .flex;
                .size(100px,100px);
                box-sizing: border-box;
                font-size: 24px;
                padding: 10px;
                cursor: pointer;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                background: #282828;
                border-radius: 4px;
                &.is-active {
                    justify-content: start;
                }
                .u-close {
                    position: absolute;
                    top: 0;
                    right: 0;
                    cursor: pointer;
                    font-size: 12px;
                    padding: 4px;
                }
                .u-entity-icon {
                    width: 18px;
                    height: 18px;
                    padding-bottom: 10px;
                }
                .u-entity-name {
                    font-size: 14px;
                }

                &:nth-of-type(1):hover {
                    background: rgba(255, 97, 97, 1);
                }
                &:nth-of-type(2):hover {
                    background: rgba(40, 207, 90, 1);
                }
                &:nth-of-type(3):hover {
                    background: rgba(65, 105, 225, 1);
                }
                &:nth-of-type(4):hover {
                    background: rgba(232, 204, 58, 1);
                }
            }
        }
    }

    .m-compare-mode {
        .w(400px);

        .u-tabs {
            flex-grow: 1;
            display: flex;
            gap: 10px;
        }

        .u-tab {
            .pointer;
            .flex-center;
            .bold;
            box-sizing: border-box;
            gap: 5px;
            padding: 10px;
            flex-shrink: 0;
            flex-grow: 1;
            background: #282828;
            height: 100px;
            border-radius: 10px;
            color: #b3b3b3;
            transition: all 0.3s ease-in-out;
            .u-title {
                .mb(0);
                .fz(14px, 22px);
            }
            &:not(.is-active) .u-title {
                .size(17px, auto);
            }
            &:not(.is-active) {
                .u-subtitle,
                .u-icon {
                    display: none;
                }
            }

            &.is-active {
                transition: flex-grow 0.3s ease-in-out;
                flex-grow: 1.4;
                background: rgba(182, 196, 204, 1);
                color: #000;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;

                .u-title {
                    .fz(30px, 40px);
                }

                .u-subtitle {
                    .fz(16px, 21px);
                }
            }
        }

        .u-icon {
            .size(40px);
        }
    }
}
.m-select-popper {
    .u-entity {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .u-entity-icon {
        .size(30px, 30px);
    }

    .u-entity-name {
        display: block;
        flex-grow: 1;
    }
}
</style>
