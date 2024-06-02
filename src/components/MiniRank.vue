<template>
    <div class="m-ladder-carousel" v-if="slideList.length">
        <el-carousel class="m-carousel" autoplay indicator-position="none">
            <el-carousel-item v-for="(item, index) in slideList" :key="index">
                <a class="u-link" :href="item.link">
                    <el-image class="u-cover" :src="item.img" :alt="item.title" fit="contain" />
                </a>
            </el-carousel-item>
        </el-carousel>
    </div>
    <div class="m-rank-ladder-mini" v-loading="loading">
        <div class="m-ladder-header">
            <h3 class="m-ladder-title">
                <span class="u-title">
                    <img class="u-icon" svg-inline src="@/assets/img/side/rank.svg" /> 竞技场热门榜
                </span>
                <!-- <el-icon v-if="isEditor" class="u-edit-icon" @click="onSettingIconClick"><Setting /></el-icon> -->
            </h3>
            <el-select class="m-ladder-select" v-model="active" placeholder="请选择" size="small">
                <el-option
                    v-for="item in filterRankList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
            </el-select>
        </div>

        <div class="m-ladder-rank">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="输出" name="dps">
                    <ul v-if="content?.dps.length" class="m-ladder-rank__content">
                        <li v-for="(item, index) in content.dps" :key="item.name" class="u-link">
                            <span class="u-order" :class="highlight(index)">{{ index + 1 }}</span>
                            <img :src="showMountIcon(item.id)" alt="" class="u-img" />
                            <span class="u-team">{{ showMountName(item.id) }}</span>
                            <span class="u-server">{{ item.num }}</span>
                        </li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="治疗" name="hps">
                    <ul v-if="content?.hps.length" class="m-ladder-rank__content">
                        <li v-for="(item, index) in content.hps" :key="item.name" class="u-link">
                            <span class="u-order" :class="highlight(index)">{{ index + 1 }}</span>
                            <img :src="showMountIcon(item.id)" alt="" class="u-img" />
                            <span class="u-team">{{ showMountName(item.id) }}</span>
                            <span class="u-server">{{ item.num }}</span>
                        </li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-drawer
            v-model="showDialog"
            title="竞技场热门榜设置"
            class="m-rank-pop"
            append-to-body
            width="600px"
            @close="onCancel"
        >
            <el-form :model="form" ref="form" label-position="top">
                <el-form-item label="榜单名称">
                    <div class="m-rank-name">
                        <el-select
                            v-model="activeName"
                            filterable
                            allow-create
                            placeholder="请选择现有榜单或输入新的榜单"
                            style=""
                            @change="onLabelChange"
                            default-first-option
                        >
                            <el-option
                                v-for="item in rankList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-icon @click="onEdit" v-if="activeName && !isNaN(activeName)"><Setting></Setting></el-icon>
                    </div>
                    <div v-if="tmpName" class="u-tmp-name"><em>修改后：</em>{{ tmpName }}</div>
                </el-form-item>
                <el-form-item label="客户端">
                    <el-select v-model="form.client" placeholder="请选择客户端" style="width: 100%">
                        <el-option
                            v-for="item in clients"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" class="m-status">
                    <template #label>
                        <span class="u-status">状态</span>
                        <el-tooltip content="控制榜单是否显示">
                            <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                    </template>
                    <el-switch v-model="form.status" :inactive-value="0" :active-value="1"></el-switch>
                </el-form-item>
                <el-form-item label="内容" class="m-content">
                    <draggable v-model="form.content" item-key="index" animation="300" handle=".u-rank-icon">
                        <template #item="{ element, index }">
                            <div class="m-content-item">
                                <el-icon class="u-rank-icon"><Rank /></el-icon>
                                <!-- <el-select
                                    v-model="element.id"
                                    placeholder="请选择门派名称"
                                    popper-class="u-school-select"
                                    style="width: 300px"
                                    filterable
                                >
                                    <el-option
                                        v-for="item in schoolMap"
                                        :value="item.id"
                                        :key="item.id"
                                        :label="item.name"
                                    >
                                        <img :src="showSchoolIcon(item.id)" alt="" class="u-img" />
                                        <span>{{ item.name }}</span>
                                    </el-option>
                                </el-select> -->
                                <el-select
                                    v-model="element.id"
                                    placeholder="请选择心法名称"
                                    popper-class="u-school-select"
                                    style="width: 300px"
                                    filterable
                                >
                                    <el-option v-for="item in xfMap" :value="item.id" :key="item.id" :label="item.name">
                                        <img :src="showMountIcon(item.id)" alt="" class="u-img" />
                                        <span>{{ item.name }}</span>
                                    </el-option>
                                </el-select>
                                <el-input v-model="element.num" placeholder="请输入心法人数"></el-input>
                                <div class="u-action">
                                    <el-button
                                        size="small"
                                        circle
                                        icon="Delete"
                                        type="danger"
                                        @click="form.content.splice(index, 1)"
                                        :disabled="form.content.length === 1"
                                    ></el-button>
                                    <el-button
                                        v-if="!index"
                                        class="u-add-icon"
                                        circle
                                        size="small"
                                        icon="Plus"
                                        @click="form.content.push({ ...default_content })"
                                    ></el-button>
                                </div>
                            </div>
                        </template>
                    </draggable>
                </el-form-item>
                <el-form-item label="快速输入">
                    <el-input v-model="quickInput" :rows="8" type="textarea" @change="onQuickInputChange"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <div>
                    <el-button type="danger" class="u-del-btn" @click="onDelete" :disabled="saveLoading"
                        >删除</el-button
                    >
                    <el-button @click="onCancel" :disabled="saveLoading">取消</el-button>
                    <el-button type="primary" @click="onSave" :disabled="saveLoading">保存</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
import { markRaw } from "vue";
import { mapState } from "pinia";
import { useStore } from "@/store";
import { getRankList, createRankItem, putRankList, delRankList, getRankItem } from "@/service/rank.js";
import schoolid from "@jx3box/jx3box-data/data/xf/schoolid.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import mountGroup from "@jx3box/jx3box-data/data/xf/mount_group.json";
import { showSchoolIcon, showMountIcon } from "@jx3box/jx3box-common/js/utils";
import { getConfigBanner } from "@/service/raw.js";
import User from "@jx3box/jx3box-common/js/user.js";
import draggable from "vuedraggable";
import rankMap from "@/assets/data/rankMap.json";
import cloneDeep from "lodash/cloneDeep";

const default_content = {
    id: "",
    num: 0,
};

export default {
    name: "MiniRank",
    components: {
        draggable,
    },
    data() {
        return {
            clients: markRaw([
                { label: "重制版", value: "std" },
                { label: "缘起", value: "origin" },
            ]),
            activeTab: "dps",

            active: "",
            rankList: [],
            loading: false,
            data: {},

            showDialog: false,

            form: {
                label: "",
                client: "",
                status: 0,
                content: [
                    {
                        ...default_content,
                    },
                ],
            },
            saveLoading: false,
            activeName: "",
            tmpName: "",

            quickInput: "",

            slideList: [],
        };
    },
    computed: {
        ...mapState(useStore, ["client"]),
        filterRankList() {
            return this.rankList.filter((item) => item.status);
        },
        isEditor() {
            return User.isEditor();
        },
        content() {
            try {
                const content = this.data.content ? this.data.content : [];
                const hps = mountGroup.mount_group["治疗"];
                return {
                    dps: content
                        .filter((item) => !hps.includes(~~item.id))
                        .sort((a, b) => {
                            return b.num - a.num;
                        }),
                    hps: content
                        .filter((item) => hps.includes(~~item.id))
                        .sort((a, b) => {
                            return b.num - a.num;
                        }),
                };
            } catch (error) {
                return {
                    dps: [],
                    hps: [],
                };
            }
        },
        schoolMap() {
            return Object.entries(schoolid)
                .map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                    };
                })
                .filter((item) => item.id != 0);
        },
        xfMap() {
            const tank = mountGroup.mount_group["坦克"];
            return Object.entries(xfid)
                .map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                    };
                })
                .filter((item) => item.id != 0 && !tank.includes(~~item.id));
        },
    },
    watch: {
        active: {
            handler() {
                this.loadRankItem();
            },
        },
    },
    mounted() {
        this.loadRankList();
        this.loadMenu();
    },
    methods: {
        showSchoolName(id) {
            return this.schoolMap.find((item) => item.id == id)?.name || "";
        },
        showMountName(id) {
            return xfid[id] || "";
        },
        loadRankList() {
            this.loading = true;
            getRankList({ client: this.client, status: 1 })
                .then((res) => {
                    this.rankList = res.data ? res.data.reverse().slice(0, 10) : [];
                    // 如果激活的榜单不存在，就默认选中第一个
                    if (!this.rankList?.find((item) => item.id == this.active)) {
                        this.active = this.rankList.filter((item) => item.status)[0]?.id;
                    } else {
                        this.active = this.rankList[0]?.id;
                    }
                    // this.loadRankItem();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadRankItem() {
            getRankItem(this.active)
                .then((res) => {
                    this.data = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        showSchoolIcon,
        showMountIcon,
        highlight(i) {
            return `u-order-${i + 1}`;
        },
        onSettingIconClick() {
            this.form.client = this.client;
            this.showDialog = true;
        },
        loadMenu() {
            getConfigBanner({ client: this.client, status: 1, per: 5, type: "banner", subtype: "pvp" }).then((res) => {
                this.slideList = cloneDeep(res.data.data.list);
            });
        },
        // 弹窗  ==================
        onLabelChange() {
            const rank = this.rankList.find((item) => item.id == this.activeName);
            if (rank) {
                this.form.status = rank.status;
                this.form.client = rank.client;
                this.form.label = rank.label;
                this.form.content = rank.content;
            }
        },
        onCancel() {
            this.showDialog = false;
            // 重置内容
            this.form = {
                label: "",
                client: this.client,
                status: 0,
                content: [
                    {
                        ...default_content,
                    },
                ],
            };
            this.activeName = "";
            this.tmpName = "";
        },
        onSave() {
            const item = this.rankList.find((item) => item.id == this.activeName);
            if (item) {
                this.put();
            } else {
                this.create();
            }
        },
        create() {
            this.saveLoading = true;
            createRankItem({
                label: this.activeName,
                client: this.form.client,
                status: this.form.status,
                content: JSON.stringify(this.form.content),
            })
                .then(() => {
                    this.loadRankList();
                    this.$notify({
                        title: "成功",
                        message: "创建榜单成功",
                        type: "success",
                    });
                    this.onCancel();
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.saveLoading = false;
                });
        },
        put() {
            this.saveLoading = true;
            putRankList(this.activeName, {
                label: this.tmpName || this.form.label,
                client: this.form.client,
                status: this.form.status,
                content: JSON.stringify(this.form.content),
            })
                .then(() => {
                    this.loadRankList();
                    this.$notify({
                        title: "成功",
                        message: "更新榜单成功",
                        type: "success",
                    });
                    this.onCancel();
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.saveLoading = false;
                });
        },
        onDelete() {
            const item = this.rankList.find((item) => item.id == this.form.label || item.label == this.form.label);
            if (item) {
                this.$confirm("此操作将永久删除该榜单, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.saveLoading = true;
                        delRankList(item.id)
                            .then(() => {
                                this.loadRankList();
                                this.$notify({
                                    title: "成功",
                                    message: "删除榜单成功",
                                    type: "success",
                                });
                                this.onCancel();
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                            .finally(() => {
                                this.saveLoading = false;
                            });
                    })
                    .catch(() => {});
            } else {
                this.onCancel();
            }
        },
        onEdit() {
            const name = this.tmpName || this.form.label;
            this.$prompt("请输入榜单名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: name,
            })
                .then(({ value }) => {
                    this.tmpName = value;
                })
                .catch(() => {});
        },

        // quickinput
        onQuickInputChange() {
            if (!this.quickInput) return;
            // 去除左右中括号 '{}', \n 和 空格
            const value = this.quickInput
                .replace(/[\\{\\}\n\s]/g, "")
                .split(",")
                .map((item) => {
                    const _val = item.split(":");
                    return {
                        id: String(rankMap[_val[0]]),
                        num: _val[1],
                    };
                })
                .sort((a, b) => b.num - a.num);
            // console.log(value);
            this.form.content = value;
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/rank.less";
</style>
