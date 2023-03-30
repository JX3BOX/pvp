<template>
    <div class="m-sandboxMap">
        <div class="u-mapLine"></div>
        <!-- 恶人谷||浩气盟 -->
        <div v-for="item in camps" :key="item.key">
            <img class="u-pic" :src="imgPath(item.id, item.name, 'pic')" :style="positionStyle(item.name, 'pic')" />
            <img
                class="u-icon"
                :src="imgPath(item.key, item.name, 'camp')"
                :style="positionStyle(item.name, 'icon')"
                style="cursor: default"
            />
            <div class="u-name" :style="positionStyle(item.name, 'name')">{{ item.names }}</div>
        </div>

        <!-- 其他地点 -->
        <template v-if="maps.list && maps.list.length > 0">
            <div v-for="item in maps.list" :key="item.id">
                <img
                    class="u-pic"
                    :src="imgPath(item.id, item.camp, 'pic')"
                    :style="positionStyle(item.name_pinyin, 'pic')"
                />
                <!-- 简介 -->
                <div
                    class="u-icon"
                    :style="positionStyle(item.name_pinyin, 'icon')"
                    v-for="(item, o) in maps.list"
                    :key="o"
                >
                    <el-popover placement="top-start" width="240" trigger="hover">
                        <div class="u-box">
                            <img :src="imgPath(item.name_pinyin, item.camp, 'camp')" />
                            <div class="u-txt">
                                <div class="u-line">
                                    <span class="u-camp">{{ item.name }}</span>
                                </div>
                                <div class="u-line">
                                    <span>占领势力：</span>
                                    <span :class="item.camp">【{{ item.camp == "haoqi" ? "浩气盟" : "恶人谷" }}】</span>
                                </div>
                                <div class="u-line u-gang">
                                    <span>占领帮会：</span>
                                    <span :class="item.camp">- {{ item.gang }} -</span>
                                </div>
                            </div>
                            <div class="u-log" @click="showLog(item)">
                                <i class="el-icon-date"></i>
                            </div>
                        </div>
                        <template #reference>
                            <div @click="showLog(item)">
                                <img :src="imgPath(item.id, item.camp, 'icon')" />
                            </div>
                        </template>
                    </el-popover>
                </div>

                <div class="u-name" :style="positionStyle(item.name_pinyin, 'name')">{{ item.name }}</div>
            </div>
        </template>
        <template v-if="maps.detail && maps.detail.length > 0">
            <div class="detail" v-for="item in maps.detail" :key="item.id">
                <img
                    class="u-camps"
                    :src="imgPath(item.name_pinyin, camp, 'camp')"
                    :style="positionStyle(item.name_pinyin, 'camp')"
                />
                <!-- 攻防箭头 -->
                <template v-if="route">
                    <div v-for="attacks in item.castles" :key="attacks.id">
                        <img
                            v-for="arr in attacks.attacks"
                            :key="arr.id"
                            class="u-attacks"
                            :src="imgPath(arr, camp, 'arr')"
                            :style="positionStyle(attacks.name_pinyin, 'arr', arr.name_pinyin)"
                        />
                    </div>
                    <template v-if="item.attacks && item.attacks.length !== 0">
                        <div v-for="arr in item.attacks" :key="arr.id">
                            <img
                                class="u-attacks"
                                :src="imgPath(arr, camp, 'attacks')"
                                :style="positionStyle(item.name_pinyin, 'attacks', arr.name_pinyin)"
                            />
                        </div>
                    </template>
                </template>
            </div>
        </template>
    </div>
</template>
<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const __imgPath = JX3BOX.__imgPath;
const { placeArr, placeAttacks, placeCamp, placeImg, placeName } = require("@/assets/data/sandboxMap.json");
export default {
    name: "SandBoxMaps",
    props: ["maps", "camp", "route"],
    data: function () {
        return {
            camps: [
                { id: 27, name: "eren", names: "恶人谷", key: "erengu" },
                { id: 25, name: "haoqi", names: "浩气盟", key: "haoqimeng" },
            ],
        };
    },
    methods: {
        // 图片路径
        imgPath(name, camp, key) {
            switch (key) {
                case "pic":
                    return camp == "haoqi"
                        ? __imgPath + "image/camp/h" + name + ".png"
                        : __imgPath + "image/camp/e" + name + ".png";
                case "camp":
                    return __imgPath + "image/camp/" + name + ".png";
                case "icon":
                    return camp == "haoqi"
                        ? __imgPath + "image/camp/h" + this.icon(name) + ".png"
                        : __imgPath + "image/camp/e" + this.icon(name) + ".png";
                case "arr":
                case "attacks":
                    return camp == "haoqi" ? __imgPath + "image/camp/charr.png" : __imgPath + "image/camp/cearr.png";
                default:
                    return "";
            }
        },
        // 图片及文字的定位
        positionStyle(name, key, arr) {
            switch (key) {
                case "pic":
                    return placeImg[name];
                case "camp":
                    return placeCamp[name];
                case "icon":
                    return placeName[name];
                case "name": {
                    let { left, top } = placeName[name];
                    if (name == "LinFengBao" || name == "WuWangCheng") left = this.pixel(left, 15);
                    if (name == "eren" || name == "haoqi") left = this.pixel(left, 40);
                    left = this.pixel(left, 45);
                    top = this.pixel(top, -10);
                    return { left, top };
                }
                case "attacks":
                    return placeAttacks[name][arr];
                case "arr":
                    return placeArr[name][arr];
                default:
                    return "default";
            }
        },
        // icon 对应的图片名字转换
        icon(key) {
            switch (key) {
                case 301:
                    return "_lingfengbao";
                case 221:
                    return "_wuwangcheng";
                case 231:
                case 1031:
                case 92:
                case 1002:
                    return "02";
                case 1392:
                case 212:
                case 1012:
                case 1001:
                    return "03";
                case 131:
                case 1042:
                case 1051:
                case 351:
                    return "04";
                case 211:
                case 1531:
                    return "05";
                default:
                    return "01";
            }
        },
        // 定位的像素修改
        pixel(key, num) {
            let newKey = key.substr(0, key.length - 2);
            key = +newKey + num;
            return key + "px";
        },
        // 展示弹窗
        showLog(item) {
            item.img = __imgPath + "image/camp/" + item.name_pinyin + ".png";
            this.$emit("mapClick", item);
        },
    },
};
</script>
