import {useState} from 'react';
import {chatBubble, mine, host as hostStyle, content as contentStyle, time as timeStyle,log} from './message.module.less'
import {curTime} from "../../../../utils/time-util.js";

const Message = ({uid, host = '127.0.0.1', content = '', isMine = true}) => {
    const [time] = useState(curTime());
    return (
        <div key={uid} style={{display: "flex"}}>
            <div className={log}>
                <span style={{color: '#001d66',fontWeight: "bold"}}>{time}</span>
                <span style={{color: '#001d66',fontWeight: "bold"}}>{isMine? '-->':'<--'}</span>
                <span style={{color: isMine?'#1890ff':'#0958d9',fontWeight: "bold"}}>{host}</span>
                <span>{content}</span>
            </div>
            <div style={{display: "none"}} className={isMine ? `${mine} ${chatBubble}` : chatBubble}>
                <div className={hostStyle}>{host}</div>
                <div className={contentStyle}>{content}</div>
                <div className={timeStyle}>{time}</div>
            </div>
        </div>
    );
};
export default Message

