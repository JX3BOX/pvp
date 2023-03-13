import { $node, axios } from "@jx3box/jx3box-common/js/https_v2";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const $oss = axios.create({
    baseURL: JX3BOX.__ossRoot,
});

function getSkills(params) {
    return $node().get("/skills", {
        params: params,
    });
}

function getSkill(id) {
    return $node().get(`/skill/id/${id}`);
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

export { getSkills, getSkill, getTalents, getTalents2, getTalentVersions };
