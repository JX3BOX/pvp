<template>
    <div class="w-card-home m-jba-card">
        <p class="w-card-title">绑定魔盒助手</p>
        <p>*此令牌用于魔盒助手身份校验，切勿泄漏。</p>
        <div class="u-jba-token">
            <a v-if="!isLogin" class="u-jba-inner" :href="loginUrl">请先登录</a>
            <p v-else-if="!jbaToken" @click="getJbaToken" class="u-jba-inner">点击获取并复制临时令牌</p>
            <template v-else>
                <el-scrollbar>
                    <p class="u-jba-inner">{{ jbaToken }}</p>
                </el-scrollbar>
                <el-button link :icon="DocumentCopy" @click="copyToken()"></el-button>
            </template>
        </div>
        <div class="u-jba-help" v-html="jbaHelp"></div>
        <!-- <p class="u-jba-help">
            <el-icon><WarningFilled /></el-icon>使用教程
        </p>
        <p>请参考 此教程 在魔盒助手中输入此处生成的令牌，即可快速上传战斗数据</p> -->
    </div>
</template>

<script setup>
import { DocumentCopy } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getNewToken } from "@/service/jcl/team";
import { getJbaHelp } from "@/service/jcl/helper";
import User from "@jx3box/jx3box-common/js/user";

const jbaHelp = ref("");
const jbaToken = ref(null);
const getJbaToken = () => {
    getNewToken()
        .then((res) => {
            let {
                code,
                data: { token },
            } = res.data;
            if (code == 0) jbaToken.value = token;
        })
        .catch(() => {
            jbaToken.value = "QAQ";
            ElMessage.error("获取失败");
        });
};
const copyToken = () => {
    navigator.clipboard
        .writeText(jbaToken.value)
        .then(() => {
            ElMessage.success("复制成功");
        })
        .catch(() => {
            ElMessage.error("复制失败");
        });
};
const isLogin = User.isLogin();
const loginUrl = `/account/login?redirect=${location.href}`;

onMounted(() => {
    getJbaHelp().then((res) => {
        jbaHelp.value = res.data.data.html;
    });
});
</script>

<style lang="less">
@import "@/assets/css/jcl/list/jba_card.less";
</style>
