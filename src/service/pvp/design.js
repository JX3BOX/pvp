import { $cms } from "@jx3box/jx3box-common/js/https_v2";

export const getDesignLog = (params) => {
    return $cms().get(`/api/cms/design/task/log`, { params });
};

export const getBannerList = (params) => {
    return $cms().get(`/api/cms/news/v2`, { params });
};
