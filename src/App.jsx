import { Layout, theme } from 'antd';
import {useEffect,  useState} from 'react';
import './App.css';
import ClientList from "./pages/clientList/index.jsx";
import Chat from "./pages/chat/index.jsx";
import {useRoutes} from "react-router-dom";
import {useDispatch} from "react-redux";
import {load, save} from "./reducer/clientReducer.js";
const {  Sider, Content } = Layout;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(load())
        window.addEventListener('beforeunload',saveClients)
        return () => {
            window.removeEventListener('beforeunload',saveClients)
        }
    },[])
    const saveClients = () => {
        dispatch(save())
    }


    const routes = useRoutes([
        { path: "/chat/:uuid", element: <Chat/> },
    ]);

    return (
        <Layout>
            <Sider collapsedWidth={0}  collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <ClientList/>
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        maxHeight: document.documentElement.clientHeight - 50,
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
