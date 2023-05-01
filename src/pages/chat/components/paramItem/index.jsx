import {Input} from 'antd';
import {useEffect, useState} from 'react';
import './paramSetting.css'

const ParamItem = ({uid, paramConfig, dataChange}) => {
    const [val, setVal] = useState('');
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(0);
    useEffect(() => {
        console.log(paramConfig)
        setVal(paramConfig.val)
        setLow(paramConfig.low)
        setHigh(paramConfig.high)
    },[paramConfig])

    const handleLowChange = (value) => {
        setLow(value);
        dataChange({ uid, val, low: value, high });
    };

    const handleHighChange = (value) => {
        setHigh(value);
        dataChange({ uid, val, low, high: value });
    };

    return (
        <>
            <div className={'row'}>
                <div style={{flexShrink: 0}}>
                    变动数值:{val}
                </div>
                <Input
                    type={'number'}
                    value={low}
                    onChange={(e) => handleLowChange(Number(e.target.value))}
                    addonBefore={'下界'}
                />
                <Input
                    type={'number'}
                    value={high}
                    onChange={(e) => handleHighChange(Number(e.target.value))}
                    addonBefore={'上界'}
                />
            </div>
        </>
    );
};
export default ParamItem;
