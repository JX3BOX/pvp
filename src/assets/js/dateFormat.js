import moment from "moment";
/**
 * 简单的日期格式化
 *
 * @param {*} dt Date实例
 * @param {object} opt polished:是否补齐两位,separator:连接分隔符
 */
function dateFormat(dt, separator = "-", polished = true) {
    // let year = dt.getFullYear()
    let month = dt.getMonth() + 1;
    let date = dt.getDate();
    let str = polished ? `${polish(month)}${separator}${polish(date)}` : `${month}${separator}${date}`;
    return str;
}

function polish(val) {
    return val < 10 ? "0" + val : val;
}

export const getRelativeTime = (val) => {
    return moment(val).startOf("day").fromNow();
};

export default dateFormat;
