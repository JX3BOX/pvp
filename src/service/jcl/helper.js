import { $cms } from "@jx3box/jx3box-common/js/https_v2";

export const getBattleAc = () => {
    return $cms().get("/api/cms/breadcrumb/battle-ac-v3");
};

export const getJbaHelp = () => {
    return $cms().get("/api/cms/breadcrumb/battle-jba-v3");
};
