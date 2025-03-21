/*
 * @Author: X3ZvaWQ x3zvawq@gmail.com
 * @Date: 2023-03-22 09:38:41
 * @LastEditors: X3ZvaWQ x3zvawq@gmail.com
 * @LastEditTime: 2023-10-14 23:55:19
 * @FilePath: /jcl/src/utils/commonNoStore.js
 * @Description:
 */
import colors from "@jx3box/jx3box-data/data/xf/colors.json";
import xfId from "@jx3box/jx3box-data/data/xf/xfid.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { padStart, cloneDeep } from "lodash-es";
import { moment } from "@jx3box/jx3box-common/js/moment";
import duration from "dayjs/plugin/duration";
moment.extend(duration);

const resourceSearchCache = {};
export function getResource(_key, store) {
    const [type, key] = _key.split(":");
    const { resources } = store;
    let cacheKey = `${type}:${key}`;
    if (resourceSearchCache[cacheKey]) return resources[resourceSearchCache[cacheKey]];
    let resourceKey = `${type}:${key}`;
    let r = resources[resourceKey];
    // 直接找到了id和level都符合的记录就直接返回
    if (r) {
        resourceSearchCache[cacheKey] = resourceKey;
        return r;
    }
    // 如果没有找到尝试只匹配id一致的
    let id = key.split("_")[0];
    resourceKey = `${type}:${id}_`;
    resourceKey = Object.keys(resources).find((k) => k?.startsWith(resourceKey));
    r = resources[resourceKey] ?? {};
    if (r) {
        resourceSearchCache[cacheKey] = resourceKey;
        return r;
    }
}

export function getResourceIcon(key, store, { url = true } = {}) {
    const resource = getResource(key, store);
    if (!resource) return url ? iconLink(13) : 13;
    return url ? iconLink(resource.icon) : resource.icon;
}

export function getResourceName(key, store, { showID = false } = {}) {
    const id = key.split(":")[1];
    const resource = getResource(key, store);
    if (!resource) return "未知招式";
    let ret = resource.name || resource.remark;
    if (showID) ret += `#${id}`;
    return ret;
}

export function getEntityColor(entityID, store) {
    const defaultColor = "#ee6666";
    const { entities } = store;
    const entity = entities[entityID];
    if (!entity || !entity.mount) return defaultColor;
    let mountName = xfId[entity.mount];
    if (mountName === "周天功") return defaultColor;
    let color = colors.colors_by_mount_name[mountName];
    return color;
}

export function randomColor() {
    return "#" + padStart(((Math.random() * 0xffffff) << 0).toString(16), 6, "0");
}

export function* getRandomColor() {
    let colorLists = cloneDeep(Object.values(colors.colors_by_school_name));
    while (true) {
        if (colorLists.length) {
            yield colorLists.shift();
        } else {
            yield randomColor();
        }
    }
}

export function getEntity(id, store) {
    const { entities } = store;
    return entities[id] ?? {};
}

export function getEntityName(id, store, { showID = false, showOrder = false, showRegion = false } = {}) {
    const entity = getEntity(id, store);
    if (!entity || !entity.id) return "天外来客";
    if (!entity.name) return `#${entity.id}`;

    let result = entity.name;

    if (showID) result += `#${id}`;
    if (showOrder && entity.appearOrder) result += `@${entity.appearOrder}`;

    if (!showRegion) {
        const sp = result.split("·");
        result = sp[0];
    }

    return result;
}

export function displayPercent(value) {
    if (!value) return " - ";
    return value.toFixed(2) + "%";
}

export function displayDigits(value) {
    if (!value) return " - ";
    return value.toFixed(2);
}

export function displayBigNumber(value) {
    if (!value) return " - ";
    if (value > 1000000000000) return (value / 1000000000000).toFixed(2) + "万亿";
    if (value > 100000000) return (value / 100000000).toFixed(2) + "亿";
    if (value > 10000) return (value / 10000).toFixed(2) + "万";
    return value;
}

export function displayBigNumberAndUnit(value) {
    if (!value) {
        return {
            value: " - ",
            unit: "",
        };
    }
    if (value > 1000000000000)
        return {
            value: (value / 1000000000000).toFixed(2),
            unit: "万亿",
        };
    if (value > 100000000) {
        return {
            value: (value / 100000000).toFixed(2),
            unit: "亿",
        };
    }
    if (value > 10000) {
        return {
            value: (value / 10000).toFixed(2),
            unit: "万",
        };
    }
    return {
        value: value,
        unit: "",
    };
}

export function displayDuration(value) {
    if (isNaN(value)) return "--:--";
    return moment.duration(value, "seconds").format("mm:ss", { trim: false });
}

export function gaussianSmoothing(data, sigma) {
    const gaussianKernel = (x, sigma) => {
        return Math.exp(-0.5 * (x / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
    };

    const kernelRadius = Math.floor(3 * sigma);
    const kernelSize = 2 * kernelRadius + 1;
    const kernel = new Array(kernelSize).fill(0).map((_, i) => gaussianKernel(i - kernelRadius, sigma));
    const kernelSum = kernel.reduce((a, b) => a + b, 0);

    return data.map((_, i, arr) => {
        let weightedSum = 0;
        for (let j = -kernelRadius; j <= kernelRadius; j++) {
            const index = Math.min(Math.max(i + j, 0), arr.length - 1);
            weightedSum += arr[index] * kernel[j + kernelRadius];
        }
        return Math.round(weightedSum / kernelSum);
    });
}
