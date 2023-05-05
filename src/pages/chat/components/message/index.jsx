import {useState} from 'react';
import {chatBubble, mine, host as hostStyle, content as contentStyle, time as timeStyle} from './message.module.css'
import {curTime} from "../../../../utils/time-util.js";

const Message = ({uid, host = '127.0.0.1', content = '', isMine = true}) => {
    const [time] = useState(curTime());
    return (
        <div key={uid} style={{display: "flex"}}>
            <div className={isMine ? `${mine} ${chatBubble}` : chatBubble}>
                <div className={hostStyle}>{host}</div>
                <div className={contentStyle}>{content}</div>
                <div className={timeStyle}>{time}</div>
            </div>
        </div>
    );
};
export default Message

