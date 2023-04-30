import React, {useState} from 'react';
import {Input, Button, Space, Card, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, CloseCircleOutlined} from '@ant-design/icons';
import './client.css'
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeClient, updateTitle} from "../../../../reducer/clientReducer.js";

export default function Client({uuid}) {
    const {pathname} = useLocation()
    const curPath = pathname.substring(pathname.lastIndexOf('/')+1)
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
        dispatch(updateTitle({id:uuid,title:value}))
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleDelete = () => {
        dispatch(removeClient({ id:uuid }))
    };

    const toChat = () => {
        nav('/chat/' + uuid)
    };

    return (
        <div onClick={toChat} className={uuid === curPath ? 'main main-active':'main'}>
            <Space className={uuid === curPath ? 'title title-active':'title'}>
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
            <Space className={'btns'}>
                {editing ? (
                    <Button onClick={handleCancel} size="small">
                        <CloseCircleOutlined/>
                    </Button>
                ) : (
                    <Button onClick={handleEdit} size="small">
                        <EditOutlined/>
                    </Button>
                )}
                <Button onClick={handleDelete} size="small">
                    <DeleteOutlined/>
                </Button>
            </Space>
        </div>
    );
}
