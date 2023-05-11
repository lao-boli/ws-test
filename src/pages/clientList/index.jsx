import Client from './components/client/index.jsx'
import {Fragment, useEffect} from "react";
import {Button} from "antd";
import {generateUid, isNotEmpty} from "../../utils/common.js";
import {useDispatch, useSelector} from "react-redux";
import {addClient} from "../../reducer/clientReducer.js";
import {useNavigate} from "react-router-dom";

export default function ClientList() {
    const defaultClient = {
        id: generateUid(),
        title: 'client',
        addr: '127.0.0.1:10250',
        displayMode:'chat',
        sendConfig: {
            timesMode: 1,
            sendMode: 1,
            times: 10,
            interval: 1000,
            jsScript: 'function() {\n}',
            paramConfig: {
                pattern: '',
                bounds: []
            }
        },
    }
    let clients = useSelector(state => state.clientReducer.clients)
    const nav = useNavigate()
    const dispatch = useDispatch()
    // 初始挂载，没有客户端自动添加一个
    useEffect(() => {
        if (!isNotEmpty(clients)) {
            dispatch(addClient(defaultClient))
        }
    },[])
    // 若只有一个客户端，跳转到该客户端
    useEffect(() => {
        let ids = Object.keys(clients);
        if (ids.length === 1) {
            nav('/chat/' + ids[0])
        }
    },[clients])

    function add() {
        dispatch(addClient(defaultClient))
    }

    const list = Object.keys(clients).map(id =>
        <div key={id}>
            <Client uuid={id}/>
        </div>)

    return (
        <Fragment>
            <Button type={"primary"} onClick={add}
                    style={{height: '40px', width: '90%', margin: '20px 0px 10px 10px'}}>添加客户端</Button>
            {list}
        </Fragment>

    )

}
