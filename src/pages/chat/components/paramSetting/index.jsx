import {Button, Modal} from 'antd';
import {Fragment, useEffect, useState} from 'react';
import ParamItem from "../paramItem/index.jsx";

const ParamSetting = ({paramConfig, paramConfirm}) => {

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

            <Modal title="参数设置" cancelText={'取消'} okText={'确认'} open={isModalOpen} onOk={handleOk}
                   onCancel={handleCancel}>
                {items}
            </Modal>
        </>
    );
};

export default ParamSetting;
