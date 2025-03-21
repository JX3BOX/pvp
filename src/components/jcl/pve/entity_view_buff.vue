<template>
    <div>
        <div class="m-entity-skill">
            <div class="u-left w-card">
                <div class="w-card-title">BUFF</div>
                <entity-buff-table />
            </div>
            <div class="u-right">
                <EntityBuffChart />
            </div>
        </div>
    </div>
</template>

<script setup>
import EntityBuffChart from "./entity_buff_chart.vue";
import EntityBuffTable from "./entity_buff_table.vue";
</script>

<style lang="less" scoped>
@import "@/assets/css/jcl/pve/overview_list.less";
.m-entity-skill {
    .flex;
    height: 760px;
    gap: 30px;
    > .u-left {
        flex: 1;
        .u-table {
            .u-center {
                display: flex;
                align-items: center;
            }
            .u-mount-icon {
                .size(18px, 18px);
                margin-right: 10px;
            }
            .u-entity-name {
                flex: 1;
                .ellipsis;
            }
        }
    }
    > .u-right {
        width: 1052px;
    }
}
</style>
