const formatSpecifier = /%(\d+\$)?([-#+ 0,(<]*)?(\d+)?(\.\d+)?([tT])?([a-zA-Z%])/g;
export function decode(str) {
    let valArr = formatSpecifier[Symbol.match](str);
    const arr = valArr.map((value, index) => {
        return {uid:index,val:value,low:0,high:0}
    })
    return arr
}

export function createMsg({pattern,bounds}) {
    return
}

