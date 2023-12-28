import { $cms, $node } from "@jx3box/jx3box-common/js/https_v2";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __imgPath } = JX3BOX;
import axios from "axios";
// 地图列表
function getMapList() {
    return axios.get(__imgPath + "map/data/map_index.json");
}
// 吃鸡攻略
function getPosts(params) {
    let query = {
        type: "bps",
        tag: "PVP",
        topic: "吃鸡",
    };
    if (params) {
        query = Object.assign(query, params);
    }
    return $cms().get("/api/cms/posts", {
        params: query,
    });
}
// buff
function getBuff(id, level, client) {
    const params = {
        strict: false,
        page: 1,
        per: 10,
        client,
        level,
    };
    return $node().get(`/buff/id/${id}`, {
        params,
    });
}
// 获取物品
function getItem(item_id, client) {
    if (!item_id) return;
    let options = {
        url: `/item_merged/id/${item_id}`,
        params: {
            client,
        },
    };
    return $node({ mute: true })(options);
}
// 正则匹配物品列表
function getItemsByReg(regexp) {
    return $node().get(`/item/search`, {
        params: {
            regexp,
        },
    });
}

// 批量获取物品
function getItems(ids, client) {
    const per = ids.length || 15;
    const params = {
        client,
        per,
    };
    const idString = ids.join(",");
    if (!idString) return;
    return $node().get(`/item_merged/id/${idString}`, {
        params,
    });
}

// 吃鸡技能枚举类型
function getDesertTypes(params) {
    return $node().get("/desert/enums", {
        params,
    });
}
// 吃鸡技能列表
function getDeserts(params) {
    return $node().get("/desert/list", {
        params,
    });
}

// 吃鸡点位curd
function getPoints(params) {
    return $cms().get("/api/cms/pvp/desert/point", {
        params,
    });
}
function getMyPoints(params) {
    return $cms().get("/api/cms/pvp/desert/point/mine", {
        params,
    });
}
/**
 *
 * @param {*} params
 * @returns the points to be reviewed
 */
function getUnAuditedPoints(params) {
    return $cms().get("/api/cms/pvp/desert/point/unaudited", {
        params,
    });
}
function addPoint(data) {
    return $cms().post("/api/cms/pvp/desert/point", data);
}
function delPoint(id) {
    return $cms().delete(`/api/cms/pvp/desert/point/${id}`);
}
function updatePoint(data, id) {
    return $cms().put(`/api/cms/pvp/desert/point/${id}`, data);
}
function reviewPoint(id, status = 1) {
    return $cms().put(`/api/cms/pvp/desert/point/${id}/admin`, { status });
}

export {
    getMapList,
    getPosts,
    getDesertTypes,
    getDeserts,
    getPoints,
    addPoint,
    delPoint,
    updatePoint,
    getMyPoints,
    reviewPoint,
    getUnAuditedPoints,
    getBuff,
    getItem,
    getItems,
    getItemsByReg,
};
