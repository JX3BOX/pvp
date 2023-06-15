import { $helper, $cms, $next } from "@jx3box/jx3box-common/js/https_v2";

function getCampServers() {
    return $helper()
        .get("/api/sandmaps")
        .then((res) => {
            return res.data;
        });
}

function getCamplist(params) {
    return $next()
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

// 获取沙盘右侧文章列表
function getHandbookLogs(params) {
    return $cms()
        .get(`/api/cms/posts`, { params })
        .then((res) => {
            return res.data.data.list;
        });
}

export { getCamplist, getCampServers, getCampLog, getCampDetail, getHandbookLogs };
