import React, { useState } from 'react';
import './index.css'
import {curTime} from "../../../../utils/time-util.js";
const Message = ({uid,host = '127.0.0.1',content = 'content',isMine = true}) => {
    const [time] = useState(curTime());
    return (
        <div key={uid} style={{display: "flex"}}>
            <div className={isMine ? 'chat-bubble mine' : 'chat-bubble'}>
                <div className="host">{host}</div>
                <div className="content">{content}</div>
                <div className="time">{time}</div>
            </div>
        </div>
    );
};
export default Message

