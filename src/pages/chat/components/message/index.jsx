import {useState} from 'react';
import {chatBubble, mine, host as hostStyle, content as contentStyle, time as timeStyle,log} from './message.module.less'
import {curTime} from "../../../../utils/time-util.js";

const Message = ({displayMode='chat',uid, host = '127.0.0.1', content = '', isMine = true}) => {
    const [time] = useState(curTime());
    return (
        <div key={uid} style={{display: "flex"}}>
            <div style={{display: displayMode === 'log'?'': "none"}} className={log}>
                <span style={{color: 'black',fontWeight: "normal"}}>{time}</span>
                <span style={{color: 'black',fontWeight: "normal"}}>{isMine? '[SEND]':'[REC]'}</span>
                <span style={{color: isMine?'#1677ff':'#ffa940',fontWeight: "normal"}}>{host} : </span>
                <span>{content}</span>
            </div>
            <div style={{display: displayMode === 'chat'?'': "none"}} className={isMine ? `${mine} ${chatBubble}` : chatBubble}>
                <div className={hostStyle}>{host}</div>
                <div className={contentStyle}>{content}</div>
                <div className={timeStyle}>{time}</div>
            </div>
        </div>
    );
};
export default Message

