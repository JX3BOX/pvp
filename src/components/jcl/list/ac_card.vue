<template>
    <div class="m-ac-card w-card-home">
        <p class="u-card-title">郑重声明</p>
        <div v-html="ac"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getBattleAc as _getBattleAc } from "@/service/jcl/helper";

const getBattleAc = () => {
    _getBattleAc().then((res) => {
        ac.value = res.data.data.html;
    });
};

const ac = ref("");
onMounted(() => {
    getBattleAc();
});
</script>

<style lang="less" scoped></style>
