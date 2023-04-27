export function generateUid(){
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(10);
    });
    return uuid;
}

/**
 * 判断一个对象不为null且不是空对象,不能用来判断websocket对象
 * @param obj
 * @returns {Boolean} 为空返回false，不为空返回true
 */
export function isNotEmpty(obj) {
    return typeof obj !== 'undefined' && obj !== null && Object.keys(obj).length !== 0;
}

/**
 * 判断一个websocket对象是否为空
 * @param ws
 * @returns {boolean}
 */
export function isWebSocketNotEmpty(ws) {
    if (isWebSocket(ws)){
        return ws && (ws.readyState === 1 || ws.readyState === 2);
    }else {
        return false
    }
}

/**
 * 判断一个对象是否是websocket对象
 * @param obj
 * @returns {boolean}
 */
function isWebSocket(obj) {
    return typeof obj === 'object' && obj !== null && 'readyState' in obj && typeof obj.send === 'function';
}
