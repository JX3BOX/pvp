import { $node, axios, $cms, $helper, $next } from "@jx3box/jx3box-common/js/https_v2";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";

const $oss = axios.create({
    baseURL: JX3BOX.__ossRoot,
});

function getSkills(params) {
    return $node().get("/skills", {
        params: params,
    });
}

async function getTalents() {
    let res = await $oss.get("/data/qixue/talents.json");
    return res.data;
}

function getTalentVersions() {
    return $oss.get("data/qixue/index.json");
}

async function getTalents2() {
    let res = await $oss.get("/data/talent2/talent2.json");
    return res.data;
}

// 获取技能
function getSkill(xf, client = "std") {
    const url =
        client === "std"
            ? `${JX3BOX.__dataPath}/bps/std/${xfmap[xf]["force"]}/skill.json`
            : `${JX3BOX.__dataPath}/bps/origin/${xf}/skill.json`;
    return fetch(url).then((res) => res.json());
}

// 创建热门门派排行榜
function createRankItem(data) {
    return $cms()
        .post(`/api/cms/bps/pvp-jjc-rank`, data)
        .then((res) => {
            return res.data;
        });
}

// 获取热门门派排行榜
async function getRankList(params) {
    return $cms()
        .get(`/api/cms/bps/pvp-jjc-rank`, {
            params: params,
        })
        .then((res) => {
            return res.data;
        });
}
// 更新排行榜
async function putRankList(id, data) {
    return $cms()
        .put(`/api/cms/bps/pvp-jjc-rank/${id}`, data)
        .then((res) => {
            return res.data;
        });
}
// 删除排行榜
async function delRankList(id) {
    return $cms()
        .delete(`/api/cms/bps/pvp-jjc-rank/${id}`)
        .then((res) => {
            return res.data;
        });
}

// 获取指定技能百科
function getWikkToSkill(params) {
    return $helper()
        .get("/api/wiki/posts/skill", {
            params: params,
        })
        .then((res) => {
            return res.data;
        });
}

// 获取所有日志数据
function getSandboxLogs(params) {
    return $next()
        .get("/api/game/reporter/sandbox", {
            params: params,
        })
        .then((res) => {
            return res.data;
        });
}

export {
    getSkills,
    getSkill,
    getTalents,
    getTalents2,
    getTalentVersions,
    getRankList,
    createRankItem,
    putRankList,
    delRankList,
    getWikkToSkill,
    getSandboxLogs,
};
