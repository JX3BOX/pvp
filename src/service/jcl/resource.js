// 因为在webworker里面发请求不能使用document
// 而node.js引用了common库，里面的$node引用了element-ui的message组件
// 所以会导致document is not defined
// 所以这里直接用axios搓一个$node，api访问的方法。

import axios from "axios";
import jx3box from "@jx3box/jx3box-common/data/jx3box.json";
const { __node } = jx3box;
// const $ = axios.create({
//     baseURL: "http://localhost:7002",
// });

const $ = axios.create({
    baseURL: __node,
});

// 获取任意资源
export function getResource({ client = "std", type, ids, fields } = {}) {
    return $.post(`/resource/${client}/${type}`, {
        ids,
        fields,
    });
}

export function getEnchantByItemID({ client = "std", id } = {}) {
    return $.get(`/enchant/by-item`, {
        params: {
            id,
            client,
        },
    });
}
