import { $helper, $cms } from "@jx3box/jx3box-common/js/https_v2";

function getCampServers() {
    return $helper()
        .get("/api/sandmaps")
        .then((res) => {
            return res.data;
        });
}

function getCamplist(params) {
    return $helper()
        .get("/api/sandmap", { params })
        .then((res) => {
            return res.data;
        });
}
function getCampDetail(params) {
    return $helper()
        .get("/api/sandmap/detail", { params })
        .then((res) => {
            return res.data.data;
        });
}

function getCampLog(sandmap_id = 1, castle_id = 1) {
    return $helper()
        .get(`/api/sandmap/${sandmap_id}/castle/${castle_id}/logs`)
        .then((res) => {
            return res.data;
        });
}

function getHandbookLogs(per = 10, page = 1, type = "bps", order = "update", client = "std", topic = "小攻防") {
    return $cms()
        .get(`/api/cms/posts?type=${type}&per=${per}&page=${page}&order=${order}&client=${client}&topic=${topic}`)
        .then((res) => {
            return res.data.data.list;
        });
}

export { getCamplist, getCampServers, getCampLog, getCampDetail, getHandbookLogs };
