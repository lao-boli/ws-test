import {Button, Input, message, Modal, Popover, Radio, Space, Tabs, Tooltip} from 'antd';
import {useEffect, useState} from 'react';
import {QuestionCircleOutlined, SettingOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {updateSendConfig} from "../../../../reducer/clientReducer.js";
import {row} from './sendSetting.module.css'
import TextArea from "antd/es/input/TextArea.js";
import ParamSetting from "../paramSetting/index.jsx";
import {decode} from "../../../../utils/param-util.js";
import {BidirectionalMap} from '../../../../utils/BidirectionalMap.js';
import JsEditor from "../../../../components/JsEditor.jsx";
import {safeEval} from "../../../../utils/common.js";

const OperationsSlot = {
    left: <span style={{marginRight:10}}>发送模式:</span>
};

const sendModeMap = new BidirectionalMap({
    'plain':1,
    'param':2,
    'js':3,
})
const tip = (
    <div>
        <p>遵循sprintf规范,格式字符串中的占位符用%标记，<br/>后面跟着一个或多个以下元素:</p>
        <p>% — 转义字符&apos;%&apos;</p>
        <p>d — 10进制整数</p>
        <p>f — 浮点型数字,&apos;.nf&apos;表示为该浮点数保留n位小数</p>
        <p>o — 8进制整数</p>
        <p>x — 小写的16进制整数</p>
        <p>X — 大写的16进制整数</p>
    </div>
)

const jsTip = (
    <div>
        <p>保证所写的内容为如下形式,否则不会被正确解析</p>
        <p>
            function() {'{'}<br/>
            &emsp;{'// your code'}<br/>
            &emsp;{'return result'}<br/>
            {'}'}
        </p>
    </div>
)
// s/\(.*\)/<p>\1<\/p>/g
const SendSetting = ({id}) => {
    let dispatch = useDispatch();
    const {sendConfig = {}} = useSelector(state => state.clientReducer.clients[id]) || {}

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timesMode, setTimesMode] = useState(sendConfig.timesMode);
    const [times, setTimes] = useState(sendConfig.times);
    const [interval, setInterval] = useState(sendConfig.interval);
    const [sendMode, setSendMode] = useState(sendConfig.sendMode);
    const [paramConfig, setParamConfig] = useState(sendConfig.paramConfig || {
        pattern: '',
        bounds: []
    });
    const [jsScript, setJsScript] = useState(sendConfig.jsScript || 'function() {\n}');

    useEffect(() => {
        setTimesMode(sendConfig.timesMode);
        setSendMode(sendConfig.sendMode);
        setTimes(sendConfig.times);
        setInterval(sendConfig.interval);
        setJsScript(sendConfig.jsScript);

        if (sendConfig.paramConfig) {
            setParamConfig(sendConfig.paramConfig)
        }
    }, [sendConfig]);

    const handleTimesMode = (e) => {
        setTimesMode(e.target.value)
    };

    const handleSendMode = (key) => {
        setSendMode(sendModeMap.getValue(key))
    };

    const handlePatternChange = (e) => {
        let pattern = e.target.value;
        const bounds = decode(pattern)
        const conf = {
            pattern,
            bounds
        }
        setParamConfig(conf)
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
            jsScript,
            paramConfig
        }
        dispatch(updateSendConfig({id: id, sendConfig: conf}))
        setIsModalOpen(false);
    };
    const paramConfirm = (conf) => {
        setParamConfig(conf)
    }
    const handleJsEditorBlur= (code) => {
        setJsScript(code)
        let f = safeEval(code)
        if (!f()){
            message.error('js 表达式的返回值为undefined或null')
        }
    };
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
                <div>
                    <Tabs onChange={handleSendMode}
                          tabBarExtraContent={OperationsSlot}
                          activeKey={sendModeMap.getKey(sendMode)}
                    >
                        <Tabs.TabPane key={'plain'} tab={'普通文本'}>
                            <div>
                                请直接在输入框中输入数据
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane key={'param'} tab={'自定义格式'}>
                            <div className={row}>
                                <TextArea rows={3} value={paramConfig.pattern}
                                          onChange={handlePatternChange}
                                          placeHolder={'%d %.2f %x %X %o'}
                                />
                                <div>
                                    <Popover content={tip} title="格式参考" trigger="click">
                                        <QuestionCircleOutlined/>
                                    </Popover>
                                    <ParamSetting paramConfig={paramConfig} paramConfirm={paramConfirm}/>
                                </div>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane key={'js'} tab={'使用js生成'}>
                            <div style={{display: "flex" ,justifyContent: "end"}}>
                                <div style={{width:'100%',marginRight:'5px',border:'solid 1px #91caff'}}>
                                    <JsEditor jsScript={jsScript} onBlur={handleJsEditorBlur}/>
                                </div>
                                <Popover content={jsTip} title="格式参考" trigger="click">
                                    <QuestionCircleOutlined/>
                                </Popover>
                            </div>
                            <div className={row}>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </div>

            </Modal>
        </>
    );
};
export default SendSetting;
