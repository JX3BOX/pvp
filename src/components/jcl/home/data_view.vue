<template>
    <div class="m-data-view">
        <div class="u-left">
            <data-list :show-more="true" :page-size="14"></data-list>
        </div>
        <div class="u-right">
            <div class="u-title">
                <p class="u-colorful">数据大厅</p>
                <p>各路豪杰的战斗记录</p>
            </div>
            <ac-card></ac-card>
            <jba-card></jba-card>
        </div>
    </div>
</template>

<script setup>
import DataList from "@/components/jcl/list/data_list.vue";
import AcCard from "@/components/jcl/list/ac_card.vue";
import JbaCard from "@/components/jcl/list/jba_card.vue";
</script>

<style lang="less">
@import "@/assets/css/jcl/home/data_view.less";
</style>
