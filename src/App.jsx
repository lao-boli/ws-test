import {Button, Layout, theme} from 'antd';
import {useEffect, useRef, useState} from 'react';
import './App.css';
import ClientList from "./pages/clientList/index.jsx";
import Chat from "./pages/chat/index.jsx";
import {useRoutes} from "react-router-dom";
import {useDispatch} from "react-redux";
import {load, save} from "./reducer/clientReducer.js";
import {LeftOutlined} from "@ant-design/icons";

const {Sider, Content} = Layout;

const App = () => {
    const collapseIcon = useRef()
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(document.documentElement.clientWidth < 600);
    const [clientHeight, setClientHeight] = useState(document.documentElement.clientHeight);
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const dispatch = useDispatch()

    function resetIsMobile() {
        return setIsMobile(document.documentElement.clientWidth < 600);
    }
    function resetClientHeight() {
        return setClientHeight(document.documentElement.clientHeight);
    }

    useEffect(() => {
        dispatch(load())
        window.addEventListener('beforeunload', saveClients)
        window.addEventListener('resize', resetIsMobile)
        window.addEventListener('resize', resetClientHeight)
        return () => {
            window.removeEventListener('beforeunload', saveClients)
            window.removeEventListener('resize', resetIsMobile)
            window.removeEventListener('resize', resetClientHeight)
        }
    }, [])
    const saveClients = () => {
        dispatch(save())
    }
    const handleCollapse = () => {
        let icon = collapseIcon.current;
        if (collapsed) {
            icon.classList.remove('rotate')
        } else {
            icon.classList.add('rotate')
        }
        setCollapsed(!collapsed)
    }


    const routes = useRoutes([
        {path: "/chat/:uuid", element: <Chat/>},
    ]);

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsedWidth={0}
                width={'240px'}
                collapsible
                style={{
                    position:isMobile ? "fixed":"",
                    height:isMobile ? '100%':'',
                    zIndex:'50',
                    willChange: 'width',
                    background: "white",
                    maxHeight: document.documentElement.clientHeight,
                    transition: 'all .2s,background 0s',
                }}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className={collapsed ? 'collapsed' : ''}
            >

                <div style={{
                    maxHeight: document.documentElement.clientHeight,
                    width: '240px',
                    overflow: "hidden",
                    overflowY: "auto"
                }}>
                    <ClientList/>
                </div>
                <div ref={collapseIcon} onClick={handleCollapse} className={'collapsed-icon'}>
                    <LeftOutlined/>
                </div>
            </Sider>
            <div className={'mask'}
                 style={{
                     display: isMobile ? (collapsed ? 'none' : 'block') : 'none',
                     position:"fixed",
                     backgroundColor:'black',
                     zIndex:'10',
                     width:'100%',
                     height: '100%',
                     opacity: '0.5',
                 }}
            >
            </div>

            <Layout>
                <Content
                    style={{
                        margin: '0px 16px',
                        padding: 24,
                        maxHeight: clientHeight,
                        background: colorBgContainer,
                    }}
                >
                    {routes}
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;
