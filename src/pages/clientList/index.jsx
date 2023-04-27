import ClientButton from '../../components/clientButton'
import {Fragment, useState} from "react";
import {Button} from "antd";
import {generateUid} from "../../utils/common.js";
export default function ClientList(){
    const [data, setData] = useState([generateUid()]);
    const list = data.map((val, i) => <div key={i} style={{marginBottom: "10px"}}><ClientButton/></div>);
    function add() {
        setData([generateUid(),...data])
    }

    return (
        <Fragment>
            <Button onClick={add} style={{width: '90%',marginTop: 20,marginBottom: "10px"}}>添加客户端</Button>
            {list}
        </Fragment>

    )

}
