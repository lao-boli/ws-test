import {Fragment, useEffect, useRef, useState} from "react";
import {generateUid, isNotEmpty, isWebSocketNotEmpty} from "../../utils/common.js";
import Message from "./components/message/index.jsx";
import {Button, Dropdown, Input, Space} from "antd";
import TextArea from "antd/es/input/TextArea.js";
import './chat.less'
import SendSetting from "./components/sendSetting/index.jsx";

export default function Chat() {
    const [msgList, setMsgList] = useState([]);
    const [content, setContent] = useState('');
    const [addr, setAddr] = useState('127.0.0.1:10250');
    const [isOpen, setOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [sendConfig, setSendConfig] = useState({
        timesMode: 1,
        times:10,
        interval: 1000
    });
    // const [sendInterval, setSendInterval] = useState(null);
    let sendInterval = useRef(null);
    const [sending, setSending] = useState(false);
    let listRef = useRef(null)
    const msgListRef = useRef(msgList);
    const sendConfigRef = useRef(sendConfig);
    useEffect(() => {
        const scrollContainer = listRef.current;
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        msgListRef.current = msgList
    }, [msgList]);

    useEffect(() => {
        sendConfigRef.current = sendConfig
        console.log('config change',sendConfigRef.current)
    }, [sendConfig]);

    useEffect(() => {
        window.addEventListener('beforeunload',saveWsData)
        let localData = localStorage.getItem('wsData');
        if (localData){
            localData = JSON.parse(localData)
            setMsgList(localData.history)
            setSendConfig(localData.sendConfig)
        }
        return () => {
            window.removeEventListener('beforeunload',saveWsData)
        }
    },[]);
    const saveWsData = () => {
        const wsData = {
            history:msgListRef.current,
            sendConfig: sendConfigRef.current
        }
        localStorage.setItem('wsData', JSON.stringify(wsData));
    }


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
            setOpen(true)
        }
        socket.onclose = () => {
            addMine('websocket close!')
            setOpen(false)
        }
        socket.onerror = () => {
            addMine('websocket error!,可能是远端服务未开启')
            setOpen(false)
        }
        socket.onmessage = e => {
            addOther(e.data)
        }
        setSocket(socket)
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
        if (isWebSocketNotEmpty(socket)) {
            socket.close()
        }
    }

    // endregion

    //region input value change
    const handleChange = (event) => {
        setContent(event.target.value);
    }
    const addrChange = (event) => {
        setAddr(event.target.value);
    }
    //endregion

    //region add message
    function add(host, content, isMine) {
        setMsgList(prevList => {
            const msg = {
                host,
                uid: generateUid(),
                content: content,
                isMine: isMine
            }
            return [...prevList, msg]
        })
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
                if (sendConfig.times <= count) {
                    cancelScheduleSend()
                }
                count++
                sendMsg()
            }, sendConfig.interval);
        }
        if (sendConfig.timesMode === 2) {
            interval = setInterval(() => {
                sendMsg()
            }, sendConfig.interval);

        }
        sendInterval.current = interval
        setSending(true)
    }
    const cancelScheduleSend = () => {
        clearInterval(sendInterval.current)
        setSending(false)
    }
    const handleScheduleSend = () => {
        if (sending) {
            cancelScheduleSend()
        }
        if (!sending){
            scheduleSend()
        }
    }
    const menuClick = ({ key }) => {
        if (key === 'clear'){
            setMsgList([])
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
        />);

    return (
        <Fragment>
            <div style={{height: '100%', display: "flex", flexDirection: "column"}}>
                <div className="header">
                    <Input disabled={isOpen} onChange={addrChange} addonBefore="ws://" defaultValue="127.0.0.1:10250"/>
                    <Button disabled={isOpen} onClick={initWebsock}>连接</Button>
                    <Button disabled={!isOpen} onClick={closeSocket}>断开</Button>
                    <Dropdown placement="bottomLeft" menu={{ items,onClick:menuClick,}} trigger={['click']}>
                        <Button onClick={(e) => e.preventDefault()}>
                                ...
                        </Button>
                    </Dropdown>
                </div>
                <div ref={listRef} style={{overflow: "auto", height: '100%'}}>
                    {list}
                </div>
                <div className={'footer'}>
                    <SendSetting handleConfig={setSendConfig} sendConfig={sendConfig}/>
                    <TextArea rows={1} maxLength={6} disabled={!isOpen} onChange={handleChange}/>
                    <Button disabled={!isOpen} onClick={handleScheduleSend}>{sending ? '停止发送':'定时发送'}</Button>
                    <Button disabled={!isOpen} onClick={sendMsg}>发送</Button>
                </div>
            </div>
        </Fragment>

    )
}
