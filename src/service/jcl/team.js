import { $team } from "@jx3box/jx3box-common/js/https_v2";

export const getNewToken = () => $team().get("/api/team/new-token");

export const getBattle = (id) => $team().get(`/api/team/battle/${id}`);

export const getJclBattle = (params) => $team().get("/api/team/battle/jcl", { params });

export const getUploadToken = (filetype, gzip = true) =>
    $team().get(`/api/team/battle/upload/${filetype}/sts-token`, { params: { gzip: gzip ? 1 : 0 } });

export const addBattle = (data) => $team().post(`/api/team/battle`, data);

export const updateBattle = (id, data) => $team().put(`/api/team/battle/${id}`, data);

export const deleteBattle = (id) => $team().delete(`/api/team/battle/${id}`);

export const getMyList = (params) => $team().get(`/api/team/battle/my-list`, { params });

export const getPublicList = ({ page = 1, pageSize, type, subject, title, battle_id }) =>
    $team().get(`/api/team/battle/public-list`, {
        params: { pageIndex: page, pageSize, type, subject, title, battle_id },
    });

// 获取rank
export const getRank = (params) => $team().get("/api/team/rank/events", { params });

// rank 绑定 battle
export const bindBattle = (battle_id, data) => $team().put(`/api/team/battle/${battle_id}/rank-info`, data);
