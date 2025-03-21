import { defineStore } from "pinia";

export const useStore = defineStore({
    id: "store",
    state: () => ({
        // 用户选择的分析方向
        subject: "team",
        // 用户选择的文件
        file: "",
        // 读取文件解码后内容
        raw: "",
        // 数据库信息
        info: "",
        // 分析结果相关
        worker: "",
        result: "",
    }),
    getters: {},
    actions: {},
});
