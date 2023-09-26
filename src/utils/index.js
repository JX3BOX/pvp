import moment from "moment";
/**
 * format time
 * @params time
 * @return time String
 */
const formatTime = function (time) {
    return moment(time).format("YYYY-MM-DD hh:mm:ss");
};

export { formatTime };
