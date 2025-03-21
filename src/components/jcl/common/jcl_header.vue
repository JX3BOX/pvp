<template>
    <div class="c-jcl-header">
        <div class="c-jcl-left">
            <a href="/jcl" class="u-logo">
                <img src="@/assets/img/jcl/common/jcl.svg" alt="jcl-logo" />
            </a>
        </div>
        <div class="c-jcl-content">
            <slot></slot>
        </div>
        <nav class="c-jcl-right">
            <router-link class="u-link" to="/public">我的仓库</router-link>
            <router-link class="u-link" to="/mine">数据大厅</router-link>
            <a href="javascript:;" class="u-link" @click="open()"> 上传数据 </a>
            <a href="javascript:;" class="u-link" @click="toggleFullscreen()"> 全屏 </a>
            <a href="/tool/22456" class="u-link"> 帮助 </a>
        </nav>
        <file-select ref="fileSelectRef"></file-select>
    </div>
</template>

<script setup>
import { ref } from "vue";
import FileSelect from "@/components/jcl/common/file_select";
const fileSelectRef = ref(null);

const open = () => {
    fileSelectRef.value.open("team");
};

// / 封装全屏功能的函数
function toggleFullscreen() {
    const element = document.getElementById("m-jcl-main");
    if (
        !document.fullscreenElement && // W3C 标准
        !document.mozFullScreenElement && // Firefox
        !document.webkitFullscreenElement && // Chrome, Safari 和 Opera
        !document.msFullscreenElement
    ) {
        // IE/Edge
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            // Chrome, Safari 和 Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            // IE/Edge
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            // Chrome, Safari 和 Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            // IE/Edge
            document.msExitFullscreen();
        }
    }
}
</script>

<style lang="less">
@import "@/assets/css/jcl/common/jcl_header.less";
</style>
