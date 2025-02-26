/**
 * @param {*} date 具体日期变量
 * @param {string} dateType 需要返回类型
 * @return {string} dateText 返回为指定格式的日期字符串
 */
export const getFormatDate = (date, dateType = "yyyy-mm-dd MM:mm:ss") => {
    // if(!isNaN(date))return getTime(Number)
    let dateObj = new Date(!isNaN(date) ? Number(date) : date);
    let month = dateObj.getMonth() + 1;
    let strDate = dateObj.getDate();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }

    let dateText = dateObj.getFullYear() + "年" + (dateObj.getMonth() + 1) + "月" + dateObj.getDate() + "日";
    if (dateType == "yyyy-mm-dd") {
        dateText = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
    }
    if (dateType == "yyyy.mm.dd") {
        dateText = dateObj.getFullYear() + "." + (dateObj.getMonth() + 1) + "." + dateObj.getDate();
    }
    if (dateType == "yyyy-mm-dd MM:mm:ss") {
        dateText = dateObj.getFullYear() + "-" + month + "-" + strDate + " " + hours + ":" + minutes + ":" + seconds;
    }
    if (dateType == "yyyy-mm-dd MM:mm") {
        dateText = dateObj.getFullYear() + "-" + month + "-" + strDate + " " + hours + ":" + minutes;
    }
    if (dateType == "mm-dd MM:mm:ss") {
        dateText = month + "-" + strDate + " " + hours + ":" + minutes + ":" + seconds;
    }
    if (dateType == "yyyy年mm月dd日 MM:mm:ss") {
        dateText =
            dateObj.getFullYear() + "年" + month + "月" + strDate + "日" + " " + hours + ":" + minutes + ":" + seconds;
    }
    return dateText;
};
