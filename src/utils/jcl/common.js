/*
 * @Author: X3ZvaWQ x3zvawq@gmail.com
 * @Date: 2023-03-22 08:47:25
 * @LastEditors: X3ZvaWQ x3zvawq@gmail.com
 * @LastEditTime: 2023-03-22 15:32:20
 * @FilePath: /jcl/src/utils/common.js
 * @Description:
 */

import { showMountIcon, iconLink } from "@jx3box/jx3box-common/js/utils";
import { useStore } from "@/pages/jcl/store";
import {
    getResource as _getResource,
    getResourceIcon as _getResourceIcon,
    getResourceName as _getResourceName,
    getEntityColor as _getEntityColor,
    getEntity as _getEntity,
    getEntityName as _getEntityName,
} from "./commonNoStore";

const store = useStore();

export function getResource(_key) {
    return _getResource(_key, store.result);
}

export function getResourceIcon(key, { url = true } = {}) {
    return _getResourceIcon(key, store.result, { url });
}

export function getResourceName(key, { showID = false } = {}) {
    return _getResourceName(key, store.result, { showID });
}

export function getMountIcon(id) {
    const { entities } = store.result;
    const entity = entities[id];
    if (!entity) return iconLink(0);
    const mount = entity.mount;
    if (mount) return showMountIcon(mount);
    return require("@/assets/img/jcl/pve/target_57.png");
}

export function getEntityColor(entityID) {
    return _getEntityColor(entityID, store.result);
}

export function getEntity(id) {
    return _getEntity(id, store.result);
}

export function getEntityName(id, { showID = false, showOrder = false, showRegion = false } = {}) {
    return _getEntityName(id, store.result, { showID, showOrder, showRegion });
}
