import {Fragment, useEffect, useRef,} from "react";
import {generateUid, isWebSocketNotEmpty} from "../../utils/common.js";
import Message from "./components/message/index.jsx";
import {Button, Dropdown, Input, List} from "antd";
import TextArea from "antd/es/input/TextArea.js";
import './chat.less'
import SendSetting from "./components/sendSetting/index.jsx";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    addScheduleTask,
    addWebsocket, cancelScheduleTask,
    removeWebsocket, updateSendingState,
} from "../../reducer/wsReducer.js";

import {cleanMsg, addMsg, updateAddr, updateContent} from "../../reducer/clientReducer.js";

export default function Chat() {
    const dispatch = useDispatch()
    const {uuid} = useParams()
    const {messages: msgList = [], addr, sendConfig,content} = useSelector(state => state.clientReducer.clients[uuid]) || {}
    const {socket, sending} = useSelector(state => state.connReducer.connections[uuid]) || {}

    let listRef = useRef(null)
    useEffect(() => {
        const scrollContainer = listRef.current;
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }, [msgList]);

    // region websocket
    const initWebsock = () => {
        let socket = {}
        try {
            socket = new WebSocket("ws://" + addr)
            addMine('websocket连接中...')
        } catch (e) {
            addMine(e.toString())
        }
        socket.onopen = (e) => {
            console.log(e)
            addMine('websocket open!')
        }
        socket.onclose = () => {
            addMine('websocket close!')
            cancelScheduleSend()
            dispatch(removeWebsocket({socket, id: uuid}))
        }
        socket.onerror = () => {
            addMine('websocket 错误!,可能是远端服务未开启')
        }
        socket.onmessage = e => {
            addOther(e.data)
        }
        dispatch(addWebsocket({socket, id: uuid}))
        // setSocket(socket)
    };
    const sendMsg = () => {
        if (isWebSocketNotEmpty(socket)) {
            socket.send(content)
            addMine(content)
        } else {
            addMine('websocket未连接')
        }
    }
    const closeSocket = () => {
        console.log(socket)
        if (isWebSocketNotEmpty(socket)) {
            socket.close()
        }
    }

    // endregion

    //region input value change
    const contentChange = (event) => {
        dispatch(updateContent({id: uuid, content: event.target.value}))
    }
    const addrChange = (event) => {
        dispatch(updateAddr({id: uuid, addr: event.target.value}))
    }

    //endregion
    function isOpened() {
        return socket && socket.readyState === WebSocket.OPEN
    }

    //region add message
    function add(host, content, isMine) {
        const msg = {
            host,
            uid: generateUid(),
            content: content,
            isMine: isMine
        }
        dispatch(addMsg({id: uuid, message: msg}))
    }

    function addMine(msg) {
        if (typeof msg === 'string') {
            add('我', msg, true)
        } else {
            add('我', content, true)
        }
    }

    function addOther(content) {
        add(addr, content, false)
    }

    //endregion

    const scheduleSend = () => {
        let count = 0
        let interval = null
        if (sendConfig.timesMode === 1) {
            interval = setInterval(() => {
                if (sendConfig.times >= count) {
                    count++
                    sendMsg()
                } else {
                    cancelScheduleSend()
                }
            }, sendConfig.interval);
        }
        if (sendConfig.timesMode === 2) {
            interval = setInterval(() => {
                sendMsg()
            }, sendConfig.interval);

        }
        dispatch(addScheduleTask({id: uuid, scheduleTask: interval}))
        dispatch(updateSendingState({id: uuid, sending: true}))
    }
    const cancelScheduleSend = () => {
        dispatch(cancelScheduleTask({id: uuid, sending: false}))
    }
    const handleScheduleSend = () => {
        if (sending) {
            cancelScheduleSend()
        }
        if (!sending) {
            scheduleSend()
        }
    }

    const menuClick = ({key}) => {
        if (key === 'clear') {
            dispatch(cleanMsg({id: uuid}))
        }
    };
    const items = [
        {
            label: '清空',
            key: 'clear',
        },
    ];
    const list = msgList.map(val =>
            <Message
                key={val.uid}
                host={val.host}
                uid={val.uid}
                content={val.content}
                isMine={val.isMine}
            />
        );

    return (
        <Fragment>
            <div style={{height: '100%', display: "flex", flexDirection: "column"}}>
                <div className="header">
                    <Input disabled={isOpened()} value={addr} onChange={addrChange} addonBefore="ws://"
                           defaultValue="127.0.0.1:10250"/>
                    <Button disabled={isOpened()} onClick={initWebsock}>连接</Button>
                    <Button disabled={!isOpened()} onClick={closeSocket}>断开</Button>
                    <Dropdown placement="bottomLeft" menu={{items, onClick: menuClick,}} trigger={['click']}>
                        <Button onClick={(e) => e.preventDefault()}>
                            ...
                        </Button>
                    </Dropdown>
                </div>
                <div ref={listRef} style={{scrollBehavior: "smooth",overflow: "auto", height: '100%'}}>
                    <List >
                        {list}
                    </List>
                </div>
                <div className={'footer'}>
                    <SendSetting id={uuid}/>
                    <TextArea rows={1} maxLength={6} value={content} disabled={!isOpened()} onChange={contentChange}/>
                    <Button disabled={!isOpened()}
                            onClick={handleScheduleSend}>{sending ? '停止发送' : '定时发送'}</Button>
                    <Button disabled={!isOpened()} onClick={sendMsg}>发送</Button>
                </div>
            </div>
        </Fragment>

    )
}
