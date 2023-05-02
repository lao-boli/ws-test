import {Button, Input, Modal, Radio, Space, Tooltip} from 'antd';
import {useEffect, useState} from 'react';
import {SettingOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {updateSendConfig} from "../../../../reducer/clientReducer.js";
import './sendSetting.css'
import TextArea from "antd/es/input/TextArea.js";
import ParamSetting from "../paramSetting/index.jsx";
import {decode} from "../../../../utils/param-util.js";

const SendSetting = ({id}) => {
    let dispatch = useDispatch();
    const {sendConfig = {}} = useSelector(state => state.clientReducer.clients[id]) || {}

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timesMode, setTimesMode] = useState(sendConfig.timesMode);
    const [times, setTimes] = useState(sendConfig.times);
    const [interval, setInterval] = useState(sendConfig.interval);
    const [sendMode, setSendMode] = useState(sendConfig.sendMode);
    const [paramConfig, setParamConfig] = useState(sendConfig.paramConfig || {
        pattern: 'test%d%a',
        bounds: []
    });

    useEffect(() => {
        setTimesMode(sendConfig.timesMode);
        setSendMode(sendConfig.sendMode);
        setTimes(sendConfig.times);
        setInterval(sendConfig.interval);

        if (sendConfig.paramConfig) {
            setParamConfig(sendConfig.paramConfig)
        }
    }, [sendConfig]);

    const handleTimesMode = (e) => {
        setTimesMode(e.target.value)
    };

    const handleSendMode = (e) => {
        setSendMode(e.target.value)
    };

    const handlePatternChange = (e) => {
        let pattern = e.target.value;
        const bounds = decode(pattern)
        const conf = {
            pattern,
            bounds
        }
        setParamConfig(conf)
        console.log('conf', conf)
        console.log(paramConfig)
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const conf = {
            timesMode,
            sendMode,
            times,
            interval,
            paramConfig
        }
        dispatch(updateSendConfig({id: id, sendConfig: conf}))
        setIsModalOpen(false);
    };
    const paramConfirm = (conf) => {
        console.log(conf)
        setParamConfig(conf)

    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Tooltip title={'发送设置'}>
                <Button type="primary" onClick={showModal}>
                    <SettingOutlined/>
                </Button>
            </Tooltip>

            <Modal title="发送设置" cancelText={'取消'} okText={'确认'} open={isModalOpen} onOk={handleOk}
                   onCancel={handleCancel}>
                <Space>
                    <div>发送设定</div>
                    <Radio.Group onChange={handleTimesMode} value={timesMode}>
                        <Space direction="vertical">
                            <Radio value={1}>
                                <Space>
                                    持续发送：
                                    <Input value={times} onChange={e => setTimes(Number(e.target.value))}
                                           type={'number'} addonAfter={'次'}/>
                                </Space>
                            </Radio>
                            <Radio value={2}>
                                手动停止
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Space>
                <Space style={{marginTop: 10}}>
                    <div>发送间隔：</div>
                    <Input value={interval} onChange={e => setInterval(Number(e.target.value))} step={100}
                           type={'number'} addonAfter={'ms'}/>
                </Space>
                <Space style={{marginTop: 10}}>
                    <div>发送模式</div>
                    <Radio.Group onChange={handleSendMode} value={sendMode}>
                        <Space>
                            <Radio value={1}>
                                普通文本
                            </Radio>
                            <Radio value={2}>
                                自定义参数
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Space>
                <div className={'row'}>
                    <TextArea rows={3} value={paramConfig.pattern} onChange={handlePatternChange}/>
                    <ParamSetting paramConfig={paramConfig} paramConfirm={paramConfirm}/>
                </div>
            </Modal>
        </>
    );
};
export default SendSetting;
