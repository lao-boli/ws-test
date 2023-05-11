import {Popover} from 'antd';
import {item, itemActive} from './moreOption.module.css'
import {useDispatch, useSelector} from "react-redux";
import {cleanMsg, updateDisplayMode} from "../../../../reducer/clientReducer.js";
import {DeleteOutlined, LeftOutlined} from "@ant-design/icons";

const MoreOption = ({id,hideParent}) => {
    const {displayMode} = useSelector(state => state.clientReducer.clients[id]) || {displayMode: 'chat'}

    const dispatch = useDispatch()


    const clearMsg = () => {
        dispatch(cleanMsg({id: id}))
        hideParent()
    }
    const chatMode = () => {
        dispatch(updateDisplayMode({id: id, displayMode: 'chat'}))
    }

    const logMode = () => {
        dispatch(updateDisplayMode({id: id, displayMode: 'log'}))
    }

    return (
        <>
            <div>
                <div onClick={clearMsg} className={item}>
                    <DeleteOutlined style={{alignSelf: "center", marginRight: '5px'}}></DeleteOutlined>
                    <div>
                        清&emsp;空
                    </div>
                </div>
                <Popover trigger={'click'} placement={'left'} content={
                    <div>
                        <div onClick={chatMode}
                             className={displayMode === 'chat' ? `${item} ${itemActive}` : item}>chat
                        </div>
                        <div onClick={logMode} className={displayMode === 'log' ? `${item} ${itemActive}` : item}>log
                        </div>
                    </div>
                }>
                    <div>
                        <div className={item}>
                            <LeftOutlined style={{alignSelf: "center", marginRight: '5px'}}></LeftOutlined>
                            <div>
                                显示设置
                            </div>
                        </div>
                    </div>
                </Popover>
            </div>
        </>
    );
};
export default MoreOption;
