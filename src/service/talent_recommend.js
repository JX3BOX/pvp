import { $cms } from "@jx3box/jx3box-common/js/https_v2.js";

/**
 * 新增奇穴推荐
 * @param {*} data
 * @returns
 */
function addTalentRecommend(data) {
    return $cms().post("/api/cms/bps/talent-recommend", data);
}

/**
 * 修改奇穴推荐
 * @param {*} id
 * @param {*} data
 * @returns
 */
function putTalentRecommend(id, data) {
    return $cms().put(`/api/cms/bps/talent-recommend/${id}`, data);
}

/**
 * 删除奇穴推荐
 * @param {*} id
 * @returns
 */
function delTalentRecommend(id) {
    return $cms().delete(`/api/cms/bps/talent-recommend/${id}`);
}

/**
 * 获取奇穴推荐列表
 * @param {*} params
 * @returns
 */
function getTalentRecommendList(params) {
    return $cms().get("/api/cms/bps/talent-recommend", { params });
}

export { addTalentRecommend, putTalentRecommend, delTalentRecommend, getTalentRecommendList };
