import { $cms } from "@jx3box/jx3box-common/js/https_v2";

// 创建热门门派排行榜
function createRankItem(data) {
    return $cms()
        .post(`/api/cms/pvp/ladder`, data)
        .then((res) => {
            return res.data;
        });
}

// 获取热门门派排行榜
async function getRankList(params) {
    return $cms()
        .get(`/api/cms/pvp/ladder`, {
            params: params,
        })
        .then((res) => {
            return res.data;
        });
}
// 更新排行榜
async function putRankList(id, data) {
    return $cms()
        .put(`/api/cms/pvp/ladder/${id}`, data)
        .then((res) => {
            return res.data;
        });
}
// 删除排行榜
async function delRankList(id) {
    return $cms()
        .delete(`/api/cms/pvp/ladder/${id}`)
        .then((res) => {
            return res.data;
        });
}

// 获取热门门派排行榜
async function getRankItem(id) {
    return $cms()
        .get(`/api/cms/pvp/ladder/${id}`)
        .then((res) => {
            return res.data;
        });
}

export { createRankItem, getRankList, putRankList, delRankList, getRankItem };
