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

// 获取所有奇穴方案列表
function getExtraPointList(params) {
    return $cms()
        .get("/api/cms/bps/talent-recommend", {
            params: params,
        })
        .then((res) => {
            return res.data;
        });
}

// 创建奇穴镇派方案
function createExtraPointItem(data) {
    return $cms()
        .post(`/api/cms/bps/talent-recommend`, data)
        .then((res) => {
            return res.data;
        });
}

// 修改奇穴镇派方案
function putExtraPointItem(id, data) {
    return $cms()
        .put(`/api/cms/bps/talent-recommend/${id}`, data)
        .then((res) => {
            return res.data;
        });
}
// 删除奇穴镇派
function delExtraPointItem(id) {
    return $cms()
        .delete(`/api/cms/bps/talent-recommend/${id}`)
        .then((res) => {
            return res.data;
        });
}

// 根据name或id查询数据(包括技能 buff,npc,物品，可交互物件)
function getAllDataToName(name, params) {
    return $node().get(`/skill/name/${name}`, {
        params: params,
    });
}

// 获取所有特殊技能分类列表
function getSpecialSkillList(mount) {
    return $cms()
        .get(`/api/cms/bps/pvp-special-skill/${mount}`)
        .then((res) => {
            return res.data;
        });
}

// // 创建特殊技能分类
function createSpecialSkillItem(data) {
    return $cms()
        .post(`/api/cms/bps/pvp-special-skill`, data)
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
    getExtraPointList,
    createExtraPointItem,
    putExtraPointItem,
    delExtraPointItem,
    getAllDataToName,
    getSpecialSkillList,
    createSpecialSkillItem,
};
