import {Button, Input, Modal, Radio, Space, Tooltip} from 'antd';
import {useEffect, useState} from 'react';
import {SendOutlined, SettingOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {updateSendConfig} from "../../../../reducer/clientReducer.js";
const SendSetting = ({id}) => {
    let dispatch = useDispatch();
    const {sendConfig={}} = useSelector(state => state.clientReducer.clients[id]) || {}

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timesMode, setTimesMode] = useState(sendConfig.timesMode);
    const [times, setTimes] = useState(sendConfig.times);
    const [interval, setInterval] = useState(sendConfig.interval);
    useEffect(() => {
        setTimesMode(sendConfig.timesMode);
        setTimes(sendConfig.times);
        setInterval(sendConfig.interval);
    }, [sendConfig]);

    const handleTimesMode = (e) => {
        setTimesMode(e.target.value)
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const conf = {
            timesMode,
            times,
            interval
        }
        dispatch(updateSendConfig({id:id,sendConfig:conf}))
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>

            <Tooltip title={'发送设置'}>
                <Button type="primary" onClick={showModal}>
                    <SettingOutlined />
                </Button>
            </Tooltip>
            <Modal title="发送设置" cancelText={'取消'} okText={'确认'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Space>
                    <div>发送设定</div>
                    <Radio.Group onChange={handleTimesMode} value={timesMode}>
                        <Space direction="vertical">
                            <Radio value={1}>
                                <Space>
                                    持续发送：
                                    <Input value={times} onChange={e => setTimes(Number(e.target.value))} type={'number'} addonAfter={'次'} />
                                </Space>
                            </Radio>
                            <Radio value={2}>
                                手动停止
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Space>
                <Space style={{marginTop :10}}>
                    <div>发送间隔：</div>
                    <Input value={interval} onChange={e => setInterval(Number(e.target.value))} step={100} type={'number'} addonAfter={'ms'}/>
                </Space>
            </Modal>
        </>
    );
};
export default SendSetting;
