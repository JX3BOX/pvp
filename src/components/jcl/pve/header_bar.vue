<template>
    <div class="m-tools-bar">
        <div
            v-for="id in entityList"
            :key="id"
            class="m-entity-item"
            :class="{
                'is-active': entity == id,
            }"
            @click.stop="selectEntity(id)"
        >
            <img class="u-mount-icon" :src="getMountIcon(id)" alt="" />
            <span class="u-entity-name">{{ getEntityName(id) }}</span>
            <el-icon class="u-close-icon" @click.stop="delEntity(id)"><Close /></el-icon>
        </div>
        <div class="u-add-icon" @click="showSelectEntityView()">
            <el-icon><Plus /></el-icon>
        </div>
    </div>
</template>

<script setup>
import { usePve } from "@/pages/jcl/store_pve";
import { getMountIcon, getEntityName } from "@/utils/jcl/common";
import { Close } from "@element-plus/icons-vue";
const { entityList, entitySelectVisible, entity } = toRefs(usePve());

const delEntity = (id) => {
    const list = entityList.value.filter((item) => item !== id);
    if (id == entity.value && list.length) {
        entity.value = list[0];
    } else if (id == entity.value && !list.length) {
        entity.value = null;
        entitySelectVisible.value = true;
    }
    entityList.value = list;
};

const selectEntity = (id) => {
    entity.value = id;
};

const showSelectEntityView = () => {
    entitySelectVisible.value = true;
};
</script>

<style lang="less" scoped>
.m-tools-bar {
    .mb(10px);
    .flex;
    padding-bottom: 20px;
    align-items: center;
    overflow-x: auto;
    width: 100%;
    flex-wrap: nowrap; /* 防止换行 */
    gap: 10px;
    .m-entity-item {
        .flex;
        flex: 0 0 auto; /* 使子元素不收缩也不扩展 */
        align-items: center;

        flex-wrap: nowrap;
        padding: 10px;
        border-radius: 8px;
        background: #282828;
        cursor: pointer;
        &:hover {
            color: #000;
            background: #b6c4cc;
        }
        &:active {
            color: #000;
            background: #d3efff;
        }
        &.is-active {
            background: #b6c4cc;
            color: #000;
        }
        .u-mount-icon {
            width: 18px;
            height: 18px;
            margin-right: 4px;
        }
        .u-close-icon {
            cursor: pointer;
        }
        .u-entity-name {
            margin-right: 4px;
        }
    }
    .u-add-icon {
        .bold;
        .size(44px,38px);
        .flex;
        font-size: 20px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 8px;
        background: #282828;
        &:hover {
            color: #000;
            background: #b6c4cc;
        }
        &:active {
            color: #000;
            background: #d3efff;
        }
    }

    // .m-entity-item {
    //     display: flex;
    //     align-items: center;
    //     padding: 10px;
    //     border-radius: 8px;
    //     background: #b6c4cc;
    //     color: #000;
    //     .u-mount-icon {
    //         width: 18px;
    //         height: 18px;
    //         margin-right: 4px;
    //     }
    //     .u-close-icon {
    //         cursor: pointer;
    //     }
    //     .u-entity-name {
    //         margin-right: 4px;
    //     }
    // }
}
</style>
