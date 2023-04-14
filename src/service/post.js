import { $cms } from "@jx3box/jx3box-common/js/https_v2";

export function getPosts(params) {
    return $cms().get("/api/cms/posts", { params });
}

export function getPost(id) {
    return $cms().get(`/api/cms/post/${id}`);
}
