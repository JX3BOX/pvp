import { $cms, $node } from "@jx3box/jx3box-common/js/https_v2";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
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
    return $cms().get("/api/cms/pvp/desert/point/my", {
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
};
