import {
    chatBubble,
    content as contentStyle,
    host as hostStyle,
    log,
    mine,
    time as timeStyle
} from './message.module.less'
import {curTime} from "../../../../utils/time-util.js";

const Message = ({displayMode = 'chat', uid, time = curTime(), host = '127.0.0.1', content = '', isMine = true}) => {
    return (
        <div key={uid} style={{display: "flex"}}>
            <div style={{display: displayMode === 'log' ? '' : "none"}} className={log}>
                <span style={{color: 'black', fontWeight: "normal"}}>{time}</span>
                <span style={{color: 'black', fontWeight: "normal"}}>{isMine ? '[SEND]' : '[REC]'}</span>
                <span style={{color: isMine ? '#1677ff' : '#ffa940', fontWeight: "normal"}}>{host} : </span>
                <span>{content}</span>
            </div>
            <div style={{display: displayMode === 'chat' ? '' : "none"}}
                 className={isMine ? `${mine} ${chatBubble}` : chatBubble}>
                <div className={hostStyle}>{host}</div>
                <div className={contentStyle}>{content}</div>
                <div className={timeStyle}>{time}</div>
            </div>
        </div>
    );
};
export default Message

