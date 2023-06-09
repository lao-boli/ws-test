import {Fragment, useState,} from "react";
import {generateUid, isWebSocketNotEmpty, safeEval, val2Str} from "../../utils/common.js";
import Message from "./components/message/index.jsx";
import {Button, Input, message, Popover, Tooltip} from "antd";
import TextArea from "antd/es/input/TextArea.js";
import {footer, header} from './chat.module.less'
import SendSetting from "./components/sendSetting/index.jsx";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    addScheduleTask,
    addWebsocket,
    cancelScheduleTask,
    removeWebsocket,
    updateSendingState,
} from "../../reducer/wsReducer.js";

import {addMsg, updateAddr, updateContent} from "../../reducer/clientReducer.js";
import {ClockCircleOutlined, DisconnectOutlined, LinkOutlined, SendOutlined, StopOutlined} from "@ant-design/icons";
import {createMsg} from "../../utils/param-util.js";
import ScrollList from "../../components/ScorllList.jsx";
import MoreOption from "./components/moreOption/index.jsx";
import {curTime} from "../../utils/time-util.js";

export default function Chat() {
    const dispatch = useDispatch()
    const {uuid} = useParams()
    const {
        messages: msgList = [],
        addr,
        displayMode,
        sendConfig,
        content
    } = useSelector(state => state.clientReducer.clients[uuid]) || {}
    const {socket, sending} = useSelector(state => state.connReducer.connections[uuid]) || {}

    const [moreOptOpen, setMoreOptOpen] = useState(false);
    const handleOpenChange = (newOpen) => {
        setMoreOptOpen(newOpen);
    };

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
    const sendMsg = (msg) => {
        socket.send(msg)
        addMine(msg)
    }
    const handleSendMsg = () => {
        if (isWebSocketNotEmpty(socket)) {
            if (sendConfig.sendMode === 1) {
                sendMsg(content)
            }
            if (sendConfig.sendMode === 2) {
                try {
                    const msg = createMsg(sendConfig.paramConfig);
                    sendMsg(msg)
                } catch (e) {
                    message.error(e.toString());
                }
            }
            if (sendConfig.sendMode === 3) {
                try {
                    const msg = safeEval(sendConfig.jsScript)();
                    sendMsg(msg)
                } catch (e) {
                    message.error(e.toString());
                }
            }
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

    const handleLink = () => {
        if (isOpened()) {
            closeSocket()
        } else {
            initWebsock()
        }

    }

    //region add message
    function add(host, content, isMine) {
        const msg = {
            host,
            uid: generateUid(),
            time:curTime(),
            content: val2Str(content),
            isMine: isMine
        }
        dispatch(addMsg({id: uuid, message: msg}))
    }

    function addMine(msg) {
        console.log(msg)
        add('我', msg, true)
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
                if (sendConfig.times > count) {
                    count++
                    handleSendMsg()
                } else {
                    cancelScheduleSend()
                }
            }, sendConfig.interval);
        }
        if (sendConfig.timesMode === 2) {
            interval = setInterval(() => {
                handleSendMsg()
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

    const list = msgList.map(val =>
        <Message
            displayMode={displayMode}
            key={val.uid}
            host={val.host}
            uid={val.uid}
            time={val.time}
            content={val.content}
            isMine={val.isMine}
        />
    );

    return (
        <Fragment>
            <div style={{height: '100%', display: "flex", flexDirection: "column"}}>
                <div className={header}>
                    <Input disabled={isOpened()} value={addr} onChange={addrChange} addonBefore="ws://"
                           defaultValue="127.0.0.1:10250"/>

                    <Tooltip title={isOpened() ? '断开' : '连接'}>
                        <Button onClick={handleLink}>
                            {isOpened() ? (<DisconnectOutlined/>) : (<LinkOutlined/>)}
                        </Button>
                    </Tooltip>

                    <Popover open={moreOptOpen}
                             onOpenChange={handleOpenChange}
                             trigger={'click'}
                             content={<MoreOption hideParent={() => setMoreOptOpen(false)} id={uuid}/>}>
                        <Button onClick={(e) => e.preventDefault()}>
                            ...
                        </Button>
                    </Popover>

                </div>
                <ScrollList items={list}/>
                <div className={footer}>
                    <SendSetting id={uuid}/>
                    <TextArea rows={1} value={content} disabled={!isOpened()} onChange={contentChange}/>
                    <Tooltip title={sending ? '停止发送' : '定时发送'}>
                        <Button disabled={!isOpened()}
                                onClick={handleScheduleSend}>
                            {sending ? (<StopOutlined/>) : (<ClockCircleOutlined/>)}
                        </Button>
                    </Tooltip>


                    <Tooltip title={'发送'}>
                        <Button disabled={!isOpened()} onClick={handleSendMsg}><SendOutlined/></Button>
                    </Tooltip>

                </div>
            </div>
        </Fragment>

    )
}
