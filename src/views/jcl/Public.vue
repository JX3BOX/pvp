<template>
    <div class="p-public">
        <div class="u-title">数据大厅</div>
        <div class="u-subtitle">
            <div class="u-subtitle-content">各路豪杰的最新记录</div>
            <router-link class="u-subtitle-switch" :to="{ name: 'mine' }">
                <el-icon><Switch /></el-icon>
                我的数据
            </router-link>
        </div>
        <div class="u-content">
            <data-list
                :mine="false"
                :enable-tab="true"
                :enable-paginate="true"
                :enable-search="true"
                :show-more="false"
                :page-size="20"
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
    name: "PublicIndex",
});
</script>

<style lang="less">
@import "@/assets/css/jcl/views/public.less";
</style>
