let socket = ''
let setIntervalWebsocketPush = null

export function initSocket(url) {
  createSocket(url)
}

export const createSocket = url => {
  socket && socket.close()
  if (!socket) {
    console.log('建立websocket连接')
    socket = new WebSocket(url)
    socket.onopen = onopen
    socket.onmessage = onmessage
    socket.onerror = onerror
    socket.onclose = onclose
  } else {
    console.log('websocket已连接')
  }
}

/** 打开WS之后发送心跳 */
const onopen = () => {
  sendPing()
}

/** 连接失败重连 */
const onerror = () => {
  socket.close()
  clearInterval(setIntervalWebsocketPush)
  console.log('连接失败重连中')
  if (socket.readyState !== 3) {
    socket = null
    createSocket()
  }
}

/** WS数据接收统一处理 */
const onmessage = e => {
  window.dispatchEvent(new CustomEvent('onmessage', {
    detail: {
      data: e.data
    }
  }))
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = message => {
  setTimeout(() => {
    if (socket.readyState === 0) {
      connecting(message)
    } else {
      socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = message => {
  if (socket !== null && socket.readyState === 3) {
    socket.close()
    createSocket()
  } else if (socket.readyState === 1) {
    socket.send(JSON.stringify(message))
  } else if (socket.readyState === 0) {
    connecting(message)
  }
}

/** 断开重连 */
const onclose = () => {
  clearInterval(setIntervalWebsocketPush)
  console.log('websocket已断开....正在尝试重连')
  if (socket.readyState !== 2) {
    socket = null
    createSocket()
  }
}
/** 发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing = (time = 5000, ping = 'ping') => {
  clearInterval(setIntervalWebsocketPush)
  socket.send(ping)
  setIntervalWebsocketPush = setInterval(() => {
    socket.send(ping)
  }, time)
}
