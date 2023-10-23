import { $cms } from "@jx3box/jx3box-common/js/https_v2.js";

// 获取奇穴推荐
function getTalentRecommendList(params) {
    return $cms().get("/api/cms/bps/talent", {
        params: params,
    });
}

export { getTalentRecommendList };
