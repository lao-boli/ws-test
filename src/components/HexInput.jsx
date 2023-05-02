import {Input} from 'antd';

function HexInput(props) {
    const handleInputChange = (e) => {
        const value = e.target.value;
        // 使用正则表达式匹配16进制数
        const reg = /^[0-9A-Fa-f]*$/g;
        if (reg.test(value)) {
            props.onChange(e);
        }
    };

    return (
        <Input {...props} onChange={handleInputChange} />
    );
}
export default HexInput
