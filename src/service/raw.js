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

// 获取指定技能百科
function getWikiToSkill(params) {
    return $helper()
        .get("/api/wiki/post", {
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

// 获取所有特殊技能分类列表
function getSpecialSkillList(mount) {
    return $cms().get(`/api/cms/bps/pvp-special-skill/${mount}`);
}

// 创建特殊技能分类
function createSpecialSkillItem(data) {
    return $cms().post(`/api/cms/bps/pvp-special-skill`, data);
}

// 获取历史版本
function getVersions({ type, id }, params) {
    return $helper().get(`/api/wiki/post/versions`, {
        params: {
            ...params,
            type,
            source_id: id,
        },
    });
}

function getWikiById(post_id, params) {
    return $helper().get(`/api/wiki/post/${post_id}`, {
        params,
    });
}

export {
    getSkills,
    getSkill,
    getTalents,
    getTalents2,
    getTalentVersions,
    getWikiToSkill,
    getSandboxLogs,
    getSpecialSkillList,
    createSpecialSkillItem,
    getVersions,
    getWikiById,
};
