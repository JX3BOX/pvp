<template>
    <!-- 奇穴部分 -->
    <div class="qixue" style="margin: auto"></div>
    <!-- iframe部分(配装) -->
    <div class="iframe-container">
        <div class="button-container">
            <button class="styled-button" @click="toggleIframe">显示/隐藏配装</button>
        </div>
        <iframe v-if="showIframe && iframeSrc" :src="iframeSrc" class="centered-iframe" frameborder="0"></iframe>
    </div>
</template>

<script setup>
import { usePve } from "@/pages/jcl/store_pve.js";
import { useStore } from "@/pages/jcl/store";
import { toRefs, watchPostEffect, ref } from "vue";
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";
import xfId from "@jx3box/jx3box-data/data/xf/xfid.json";
import { entityToJBBB } from "@/utils/jcl/format.js";
import { Base64 } from "js-base64";
import axios from "axios";

const store = useStore();
const { entity } = toRefs(usePve());
const loading = ref(false);
const iframeSrc = ref(null); // 用于存储 iframe 的 URL

// 控制显示/隐藏的变量
const showIframe = ref(false);

// 切换 iframe 部分的显示/隐藏
function toggleIframe() {
    showIframe.value = !showIframe.value;
}

async function updateData() {
    const { entities, start } = store.result;
    loading.value = true;
    // 天外来客不配拥有奇穴
    if (entity.value === null || entities[entity.value].type == "npc") {
        return;
    }
    let talanet_pos = "";
    for (let pos of entities[entity.value].talents) {
        talanet_pos += pos.position.toString() + ",";
    }

    talanet_pos = talanet_pos.substring(0, talanet_pos.length - 1);
    //const name = PVP_constant.mountId2Name[entities[entity.value].mount];
    const name = xfId[entities[entity.value].mount];

    // 创建界面前先获取文件版本等信息
    axios
        .get("https://data.jx3box.com/talent/std/index.json")
        .then((response) => {
            const data = response.data;
            data.sort((a, b) => {
                if (a.version < b.version) {
                    return 1;
                }
                if (a.version > b.version) {
                    return -1;
                }
                return 0;
            });
            const file_version =
                "v" +
                new Date(parseInt(start.sec * 1000))
                    .toLocaleString()
                    .replace(/:\d{1,2}$/, " ")
                    .split(" ")[0]
                    .replaceAll("/", "");
            let version;
            for (let date of data) {
                if (file_version > date.version) {
                    version = date.version;
                    break;
                }
            }
            new JX3_QIXUE({
                container: ".qixue",
                xf: name,
                sq: talanet_pos,
                editable: false,
                client: "std",
                version: version,
            });
            loading.value = false;
        })
        .catch((error) => {
            this.$message.error(error);
            return;
        });
    let equip_obj = await entityToJBBB(entity.value, store);
    console.log(equip_obj);

    // 更新 iframe 的 src 地址
    const code = encodeURIComponent(Base64.encode(JSON.stringify(equip_obj)));
    iframeSrc.value = `https://www.jx3box.com/pz/iframe.html?code=${code}`;
    console.log(iframeSrc.value);
}
watchPostEffect(updateData);
</script>
<style scoped>
.iframe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
}

.button-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
}

.styled-button {
    background-color: #303133;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.styled-button:hover {
    background-color: #e4ece4;
    color: black;
}

.styled-button:active {
    background-color: #e4ece4;
    transform: translateY(4px);
}

.centered-iframe {
    width: 1280px;
    height: 720px;
}
</style>
