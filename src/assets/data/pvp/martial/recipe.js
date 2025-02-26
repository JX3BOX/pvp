// TODO: 对秘籍进行分组

/**
 * 类型区分
 */
export const groupByType = (data) => {
    const obj = {};
    data.forEach((item) => {
        if (item.Desc.includes("调息")) {
            obj["调息时间"] = obj["调息时间"] || [];
            obj["调息时间"].push(item);
        }
        if (item.ScriptFile) {
            obj["招式效果"] = obj["招式效果"] || [];
            obj["招式效果"].push(item);
        }
    });
};
