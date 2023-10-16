export const legends = [
    {
        label: "路线建议",
        value: "path",
        src: require("@/assets/img/desert/path.svg"),
    },
    {
        label: "大量物资",
        value: "goods",
        src: require("@/assets/img/desert/goods.svg"),
    },
    {
        label: "少量物资",
        value: "small_goods",
        src: require("@/assets/img/desert/small_goods.svg"),
    },
    {
        label: "马匪刷新",
        value: "monster",
        src: require("@/assets/img/desert/monster.svg"),
    },
    {
        label: "洞穴入口",
        value: "cave",
        src: require("@/assets/img/desert/cave.svg"),
    },
];
// point status map
export const statusMap = {
    0: "待审核",
    1: "已通过",
    2: "已拒绝",
};
/**
 *
 * @param {*} legend
 * @param {*} type src value label
 * @returns info
 */
export function getPointInfo(legend, type = "src") {
    const info = legend ? legends.find((item) => item.value === legend)?.[type] : "";
    let defaultInfo = require("@/assets/img/desert/path.svg");
    if (type === "value") {
        defaultInfo = "path";
    }
    if (type === "label") {
        defaultInfo = "路线建议";
    }
    return info || defaultInfo;
}
