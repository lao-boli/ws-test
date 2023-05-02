import {vsprintf} from 'sprintf-js'

// const formatSpecifier = /%(\d+\$)?([-#+ 0,(<]*)?(\d+)?(\.\d+)?([tT])?([a-zA-Z%])/g;
const formatSpecifier = /%(\d+\$)?([-#+ 0,(<]*)?(\d+)?(\.\d+)?([tT])?([bcdeufgostTvxXj])/g;

/**
 * 解码字符串数据并返回paramConfig数组
 * @example
 * decode("%d %.2f %x %X %o")
 * return:
 * {
 *     "pattern": "%d %.2f %x %X %o",
 *     "bounds": [
 *         { "uid": 0, "val": "%d", "low": 0, "high": 0 },
 *         { "uid": 1, "val": "%.2f", "low": 0, "high": 0 },
 *         { "uid": 2, "val": "%x", "low": "0", "high": "0" },
 *         { "uid": 3, "val": "%X", "low": "0", "high": "0" },
 *         { "uid": 4, "val": "%o", "low": 0, "high": 0 }
 *     ]
 * }
 * @param str
 * @returns {{val: *, uid: *, high: number, low: number}[]|*[]}
 */
export function decode(str) {
    if (!formatSpecifier.test(str)) {
        return []
    }
    let valArr = formatSpecifier[Symbol.match](str);
    const arr = valArr.map((value, index) => {
        return {uid: index, val: value, low: 0, high: 0}
    })
    return arr
}

/**
 * 根据pattern返回随机消息
 * @param paramConfig
 * @returns {any}
 */
export function createMsg(paramConfig) {
    const {pattern, bounds} = paramConfig

    const vars = bounds.map(bound => {
        const {val, low, high} = bound
        if (val.endsWith('f')) {
            return randomDouble(low, high)
        }
        if (val.endsWith('d')) {
            return randomInt(low, high)
        }
        if (val.endsWith('x') || val.endsWith('X')) {
            return randomInt(low, high, 16)
        }
        if (val.endsWith('o')) {
            return randomInt(low, high, 8)
        }
        throw new Error(`非法参数: ${val}`);
    })
    const msg = vsprintf(pattern, vars)
    return msg
}

function randomInt(low, high, radix = 10) {
    let lowDeci = Number.parseInt(low, radix)
    let highDeci = Number.parseInt(high, radix)
    let res = Math.floor(Math.random() * (highDeci - lowDeci + 1)) + lowDeci;
    return res;
}


function randomDouble(low, high) {
    const range = high - low;
    const rand = Math.random();
    return low + range * rand;
}
