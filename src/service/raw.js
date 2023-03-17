import { $node, axios } from "@jx3box/jx3box-common/js/https_v2";
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
    return axios.get(JX3BOX.__ossRoot + "data/qixue/index.json");
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

export { getSkills, getSkill, getTalents, getTalents2, getTalentVersions };
