import Client from './components/client/index.jsx'
import {Fragment, useState} from "react";
import {Button} from "antd";
import {generateUid, isNotEmpty} from "../../utils/common.js";
import {useDispatch, useSelector} from "react-redux";
import {addClient, removeClient} from "../../reducer/clientReducer.js";

export default function ClientList() {
    const defaultClient = {
        id: generateUid(),
        title: 'client',
        addr: '127.0.0.1:10250',
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
    const dispatch = useDispatch()
    if (!isNotEmpty(clients)) {
        dispatch(addClient(defaultClient))
    }

    function add() {
        dispatch(addClient(defaultClient))
    }

    const list = Object.keys(clients).map(id =>
        <div key={id}>
            <Client uuid={id}/>
        </div>)

    return (
        <Fragment>
            <Button type={"primary"} onClick={add} style={{height:'40px', width: '90%',margin:'20px 0px 10px 10px'}}>添加客户端</Button>
            {list}
        </Fragment>

    )

}
