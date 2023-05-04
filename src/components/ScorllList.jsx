import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

const displayMap = {
    true:'block',
    false:'none'
}
function ScrollList({items}) {
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [showNewMsg, setShowNewMsg] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        const container = listRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (shouldScrollToBottom) {
            scrollToBottom()
        }else {
            setShowNewMsg(true)
        }
    }, [items.length]);

    const scrollToBottom = () => {
        const container = listRef.current;
        container.scrollTop = container.scrollHeight;
        setShowNewMsg(false)
    };

    const handleScroll = () => {
        const container = listRef.current;
        const {scrollTop, scrollHeight, clientHeight} = container;
        // 消除浮点数带来的误差
        const isScrolledToBottom = (scrollHeight - scrollTop) - clientHeight <= 1;
        if (isScrolledToBottom) {
            setShouldScrollToBottom(true);
            setShowNewMsg(false)
        } else {
            setShouldScrollToBottom(false);
        }
    };

    return (
        <div style={{position: "relative",height: '100%',overflow:"auto"}}>
            <div ref={listRef} style={{scrollBehavior: "smooth", overflow: "auto", height: '100%'}}>
                {items}
            </div>
            <div
                style={{
                    display:displayMap[showNewMsg],
                    position: "absolute",
                    zIndex: 10,
                    bottom:'1%',
                    right:'5%',
                }}
                onClick={scrollToBottom}
            >
                <div
                    style={{
                        cursor: "pointer",
                        padding:'5px',
                        backgroundColor: "white",
                        borderRadius: '5px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',

                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                        color:'#1677ff',
                    }}
                >
                    ↓ 新消息
                </div>
            </div>
        </div>
    );
}

ScrollList.propTypes = {
    items: PropTypes.array.isRequired,
};

export default ScrollList;
