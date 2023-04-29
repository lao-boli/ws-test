import Client from './components/client/index.jsx'
import {Fragment, useState} from "react";
import {Button} from "antd";
import {generateUid, isNotEmpty} from "../../utils/common.js";
import {useDispatch, useSelector} from "react-redux";
import {addClient, removeClient} from "../../reducer/clientReducer.js";
export default function ClientList(){
    const defaultClient = {
        id: generateUid(),
        title: 'client',
        addr: '127.0.0.1:10250',
        sendConfig: {
            timesMode: 1,
            times:10,
            interval: 1000
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
    function remove(id) {
        dispatch(removeClient({ id:id }))
    }

    const list = Object.keys(clients).map(id => <div key={id} style={{marginBottom: "10px"}}><Client onDelete={remove} uuid={id}/></div>)

    return (
        <Fragment>
            <Button onClick={add} style={{width: '90%',marginTop: 20,marginBottom: "10px"}}>添加客户端</Button>
            {list}
        </Fragment>

    )

}
