export function formatTime(date) {
  let year = date.getFullYear(); // 年份
  let month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份（注意加 1）
  let day = ('0' + date.getDate()).slice(-2); // 日
  let hour = ('0' + (date.getHours())).slice(-2); // 小时
  let minute = ('0' + date.getMinutes()).slice(-2); // 分钟
  let second = ('0' + date.getSeconds()).slice(-2); // 秒

// 拼接日期时间字符串
  let datetimeStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  return datetimeStr
}
export function curTime() {
  return formatTime(new Date())
}
