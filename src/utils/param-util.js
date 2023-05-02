import {vsprintf} from 'sprintf-js'

const formatSpecifier = /%(\d+\$)?([-#+ 0,(<]*)?(\d+)?(\.\d+)?([tT])?([a-zA-Z%])/g;

export function decode(str) {
    let valArr = formatSpecifier[Symbol.match](str);
    const arr = valArr.map((value, index) => {
        return {uid: index, val: value, low: 0, high: 0}
    })
    return arr
}

export function createMsg(paramConfig) {
    const {pattern, bounds} = paramConfig
    console.log(paramConfig)
    const vars = bounds.map(bound => {
        if (bound.val.endsWith('f')) {
            return randomDouble(bound.low, bound.high)
        }
        if (bound.val.endsWith('d')) {
            return randomInt(bound.low, bound.high)
        }
        throw new Error(`非法参数: ${bound.val}`);
    })
    const msg = vsprintf(pattern, vars)
    return msg
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function randomDouble(low, high) {
    const range = high - low;
    const rand = Math.random();
    return low + range * rand; // 扩大到指定范围内
}
