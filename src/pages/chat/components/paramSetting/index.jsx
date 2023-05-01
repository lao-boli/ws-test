import {Button, Modal} from 'antd';
import {Fragment, useEffect, useState} from 'react';
import './paramSetting.css'
import ParamItem from "../paramItem/index.jsx";

const formatSpecifier = /%(\\d+\\$)?([-#+ 0,(\\<]*)?(\\d+)?(\\.\\d+)?([tT])?([a-zA-Z%])/g;
const ParamSetting = ({id, paramConfig, paramConfirm}) => {

    const [paramBounds, setParamBounds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // const valArr = decode(paramConfig.pattern)
        setParamBounds(paramConfig.bounds)
    }, [paramConfig])

    const handleBoundChange = (bound) => {
        setParamBounds(prev => {
            const newBounds = [...prev];
            const index = newBounds.findIndex(item => item.uid === bound.uid);
            if (index > -1) {
                newBounds[index] = bound;
            } else {
                newBounds.push(bound);
            }
            return newBounds;
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const conf = {...paramConfig, bounds: paramBounds}
        paramConfirm(conf)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const items = paramBounds.map((value, index) =>
        <Fragment key={index}>
            <ParamItem
                uid={value.uid}
                paramConfig={value}
                dataChange={handleBoundChange}
            />
        </Fragment>)
    return (
        <>
            <Button type="primary" onClick={showModal}>
                参数设置
            </Button>
            {/*<Tooltip title={'发送设置'}>*/}
            {/*</Tooltip>*/}

            <Modal title="参数设置" cancelText={'取消'} okText={'确认'} open={isModalOpen} onOk={handleOk}
                   onCancel={handleCancel}>
                {items}
            </Modal>
        </>
    );
};

function decode(str) {
    let valArr = formatSpecifier[Symbol.match](str);
    const arr = valArr.map((value, index) => {
        return {uid:index,val:value,low:0,high:0}
    })
    console.log(valArr);
    return arr
}

export default ParamSetting;
