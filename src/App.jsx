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
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(load())
        window.addEventListener('beforeunload', saveClients)
        return () => {
            window.removeEventListener('beforeunload', saveClients)
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
            <Layout>
                <Content
                    style={{
                        margin: '0px 16px',
                        padding: 24,
                        maxHeight: document.documentElement.clientHeight,
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
