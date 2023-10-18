import dayjs from "dayjs";
/**
 * format time
 * @params time
 * @return time String
 */
const formatTime = function (time) {
    return dayjs(time).format("YYYY-MM-DD hh:mm:ss");
};
function removeEmpty(obj) {
    if (Object.prototype.toString.call(obj) === "[object Object]") {
        for (const key in obj) {
            if ([undefined, null, ""].includes(obj[key])) {
                delete obj[key];
            }
        }
        return obj;
    } else {
        return obj;
    }
}

export { formatTime, removeEmpty };
