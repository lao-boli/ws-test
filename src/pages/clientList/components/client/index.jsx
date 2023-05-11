import {useState} from 'react';
import {Button, Input, Popconfirm, Space, Tooltip} from 'antd';
import {CloseCircleOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {title as titleStyle, titleActive, mainActive, main, btns} from './client.module.css'
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeClient, setLastClient, updateTitle} from "../../../../reducer/clientReducer.js";

export default function Client({uuid}) {
    const {pathname} = useLocation()
    const curPath = pathname.substring(pathname.lastIndexOf('/') + 1)
    const dispatch = useDispatch()
    const {title} = useSelector(state => state.clientReducer.clients[uuid]) || {}
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(title);
    const nav = useNavigate()

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setValue(title);
    };

    const handleSave = () => {
        setEditing(false);
        dispatch(updateTitle({id: uuid, title: value}))
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleDelete = (e) => {
        dispatch(removeClient({id: uuid}))
        // 删除的是当前激活的client，重定向到"/"
        if (uuid === curPath){
            nav('/')
        }
        e.stopPropagation()
    };
    const handleDeleteClick = e => {
        e.stopPropagation();
    };

    const toChat = () => {
        dispatch(setLastClient(uuid))
        nav('/chat/' + uuid)
    };

    return (
        <div onClick={toChat} className={uuid === curPath ? `${main} ${mainActive}` : main}>
            <Space className={uuid === curPath ? `${titleStyle} ${titleActive}` : titleStyle}>
                {editing ? (
                    <Input
                        size={'small'}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleSave}
                        onPressEnter={handleSave}
                        autoFocus
                    />
                ) : (
                    <div>
                        <Tooltip title={value}>
                            {value || 'client'}
                        </Tooltip>
                    </div>
                )}

            </Space>
            <Space className={btns}>
                {editing ? (
                    <Button onClick={handleCancel} size="small">
                        <CloseCircleOutlined/>
                    </Button>
                ) : (
                    <Button onClick={handleEdit} size="small">
                        <EditOutlined/>
                    </Button>
                )}
                <Popconfirm
                    placement="topRight"
                    title={'是否确认删除？'}
                    onConfirm={handleDelete}
                    okText="是"
                    cancelText="否"
                >
                    <Button onClick={handleDeleteClick} size="small">
                        <DeleteOutlined/>
                    </Button>
                </Popconfirm>
            </Space>
        </div>
    );
}
