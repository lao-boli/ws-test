import React, { useState } from 'react';
import {Input, Button, Space, Card, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, CloseCircleOutlined} from '@ant-design/icons';
import './clentButton.css'

export default function ClientButton({ name, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

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

  return (
      <div className={'main'}>
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
              <Button onClick={onDelete} size="small">
                  <DeleteOutlined />
              </Button>
          </Space>


      </div>
  );
}
