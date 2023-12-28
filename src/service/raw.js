import { $node, axios, $cms, $next } from "@jx3box/jx3box-common/js/https_v2";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";

const $oss = axios.create({
    baseURL: JX3BOX.__dataPath,
});

export function getSkills(params) {
    return $node().get("/skills", {
        params: params,
    });
}

export async function getTalents() {
    let res = await $oss.get("talent/talents.json");
    return res.data;
}

export function getTalentVersions() {
    return $oss.get("talent/index.json");
}

export async function getTalents2() {
    let res = await $oss.get("talent2/talent2.json");
    return res.data;
}

// 获取技能F
export function getSkill(xf, client = "std") {
    const url =
        client === "std"
            ? `${JX3BOX.__dataPath}bps/std/${xfmap[xf]["force"]}/skill.json`
            : `${JX3BOX.__dataPath}bps/origin/${xf}/skill.json`;
    return fetch(url).then((res) => res.json());
}

// 获取技能音频索引
export function getSkillAudios(school) {
    const url = `${JX3BOX.__dataPath}audio/index/${school}.json`;
    return fetch(url).then((res) => res.json());
}

// 获取指定技能百科
export function getWikiToSkill(params) {
    const { type, client, source_id } = params;
    return $cms()
        .get(`/api/cms/wiki/post/type/${type}/source/${source_id}`, {
            params: {
                client,
            },
        })
        .then((res) => {
            return res.data;
        });
}

// 获取所有日志数据
export function getSandboxLogs(params) {
    return $next()
        .get("/api/game/reporter/sandbox", {
            params: params,
        })
        .then((res) => {
            return res.data;
        });
}

// 获取所有特殊技能分组
export function getSpecialSkillGroup(params) {
    return $cms().get(`/api/cms/pvp/collection/group`, {
        params,
    });
}

// 获取特殊技能列表
export function getSpecialSkillList(params) {
    return $cms().get(`/api/cms/pvp/collection`, {
        params,
    });
}

// 获取历史版本
export function getVersions({ type, id }, params) {
    return $cms().get(`/api/cms/wiki/post/type/${type}/source/${id}/versions`, {
        params: {
            client: params.client,
        },
    });
}

export function getWikiById(post_id) {
    return $cms().get(`/api/cms/wiki/post/id/${post_id}`);
}

export function getBread(params) {
    return $cms().get(`/api/cms/breadcrumb`, {
        params,
    });
}

export function getBreadcrumb(key) {
    return $cms().get(`/api/cms/breadcrumb/${key}`);
}

// 菜单
export function getMenu(key) {
    return $cms()
        .get(`/api/cms/menu-group/${key}`)
        .then((res) => {
            return res.data?.data?.menus || [];
        });
}

export function getConfigBanner(params) {
    return $cms().get(`api/cms/config/banner`, {
        params,
    });
}

// 管理菜单
export function updateMenu(key, data) {
    return $cms().put(`/api/cms/manage/menu-group/${key}`, data);
}
