<template>
    <div>
        <div class="m-main">
            <div class="w-card m-main-setting">
                <p class="m-main-subtitle">设定</p>
                <div class="m-seeting-item">
                    <p class="u-title">有归属的单位</p>
                    <p class="u-seeting-action">
                        <span class="is-active"> 隐藏 </span>
                        <span> 显示 </span>
                    </p>
                </div>
                <div class="m-seeting-item">
                    <p class="u-title">无名的单位</p>
                    <p class="u-seeting-action">
                        <span class="is-active"> 隐藏 </span>
                        <span> 显示 </span>
                    </p>
                </div>
                <div class="m-seeting-item">
                    <p class="u-title">同模版的单位</p>
                    <p class="u-seeting-action">
                        <span class="is-active"> 隐藏 </span>
                        <span> 显示 </span>
                    </p>
                </div>
            </div>
            <div class="w-card m-main-player">
                <p class="m-main-subtitle">玩家</p>
                <player-card-list />
            </div>
            <div class="w-card m-main-npc">
                <p class="m-main-subtitle">NPC</p>
                <npc-list />
            </div>
        </div>
    </div>
</template>

<script setup>
import PlayerCardList from "@/components/jcl/list/player_card_list.vue";
import NpcList from "@/components/jcl/list/npc_list.vue";
</script>

<style lang="less" scoped>
.m-tools-bar {
    .mb(30px);
    .u-icon {
        width: 44px;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 8px;
        background: #282828;
        & img:hover {
            opacity: 0.5;
        }
    }
}

.m-main {
    .flex;
    gap: 30px;
    .m-main-subtitle {
        .fz(20px,26px);
        .mb(20px);
        .bold;
    }
    .m-main-setting {
        .flex;
        gap: 20px;
        flex-direction: column;
        width: 360px;
        .m-main-subtitle {
            .mb(0);
        }
        .m-seeting-item {
            .flex;
            justify-content: space-between;
            .fz(14px,18px);
            .bold;
            .u-seeting-action {
                .flex;
                gap: 20px;
                color: #939393;
                span {
                    cursor: pointer;
                    &:hover {
                        color: #fff;
                    }
                }
                .is-active {
                    color: #fff;
                }
            }
        }
    }

    .m-main-player {
        flex: 1;
    }
    .m-main-npc {
        flex: 1;
    }
}
</style>
