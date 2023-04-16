import { $cms, $pay } from "@jx3box/jx3box-common/js/https_v2";

export function getPosts(params) {
    return $cms().get("/api/cms/posts", { params });
}

export function getPost(id) {
    return $cms().get(`/api/cms/post/${id}`);
}

// 获取打赏配置
export function getPostBoxcoinConfig(postType) {
    return $pay().get(`/api/inspire/article/${postType}/boxcoin/limit`);
}

// 获取盒币状态
export function getBoxcoinStatus() {
    return $cms().get(`/api/cms/config`, {
        params: {
            key: "boxcoin",
        },
    });
}
