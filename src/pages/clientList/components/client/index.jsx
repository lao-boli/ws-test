import React, { useState } from 'react';
import {Input, Button, Space, Card, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, CloseCircleOutlined} from '@ant-design/icons';
import './clent.css'
import {Navigate, useNavigate} from "react-router-dom";

export default function Client({ uuid, name, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const nav = useNavigate()

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setValue(name);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

    const handleDelete= () => {
        onDelete(uuid)
    };

    const toChat = () => {
        nav('/chat/'+ uuid)
    };

  return (
      <div onClick={toChat} className={'main'}>
          <Space className={'title'}>
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
                  <div >
                      <Tooltip title={value}>
                          {value || 'client'}
                      </Tooltip>
                  </div>
              )}

          </Space>
          <Space className={'btns'}>
              {editing ? (
                  <Button onClick={handleCancel} size="small">
                      <CloseCircleOutlined />
                  </Button>
              ) : (
                  <Button onClick={handleEdit} size="small">
                      <EditOutlined />
                  </Button>
              )}
              <Button onClick={handleDelete} size="small">
                  <DeleteOutlined />
              </Button>
          </Space>
      </div>
  );
}
