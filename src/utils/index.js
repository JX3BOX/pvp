import dayjs from "dayjs";
/**
 * format time
 * @params time
 * @return time String
 */
const formatTime = function (time) {
    return dayjs(time).format("YYYY-MM-DD hh:mm:ss");
};

export { formatTime };
