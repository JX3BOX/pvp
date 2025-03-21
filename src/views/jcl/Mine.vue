<template>
    <div class="p-mine">
        <div class="u-title">我的数据</div>
        <div class="u-subtitle">
            <div class="u-subtitle-content">刻骨铭心的沙场回忆</div>
            <router-link class="u-subtitle-switch" :to="{ name: 'public' }">
                <el-icon><Switch /></el-icon>
                数据大厅
            </router-link>
        </div>
        <div class="u-content">
            <data-list
                :mine="true"
                :enable-tab="false"
                :enable-paginate="true"
                :enable-search="true"
                :show-more="false"
            ></data-list>
            <div class="u-bottom">
                <ac-card></ac-card>
                <jba-card></jba-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import AcCard from "@/components/jcl/list/ac_card.vue";
import JbaCard from "@/components/jcl/list/jba_card.vue";
import DataList from "@/components/jcl/list/data_list.vue";

import { defineComponent } from "vue";

defineComponent({
    name: "MineIndex",
});
</script>

<style lang="less">
@import "@/assets/css/jcl/views/mine.less";
</style>
