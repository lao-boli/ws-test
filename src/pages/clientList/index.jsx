import Client from './components/client/index.jsx'
import {Fragment, useState} from "react";
import {Button} from "antd";
import {generateUid} from "../../utils/common.js";
export default function ClientList(){
    const [data, setData] = useState([generateUid()]);
    function add() {
        setData([...data,generateUid()])
    }
    function remove(id) {
        setData(data.filter((uuid) => uuid !== id));
    }


    const list = data.map((val ) => <div key={val} style={{marginBottom: "10px"}}><Client onDelete={remove} uuid={val}/></div>);
    return (
        <Fragment>
            <Button onClick={add} style={{width: '90%',marginTop: 20,marginBottom: "10px"}}>添加客户端</Button>
            {list}
        </Fragment>

    )

}
