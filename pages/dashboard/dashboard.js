import dms from '../../styles/dashboard.module.scss';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Link from "next/link";
import { FaBoxes, FaGem, FaArrowCircleLeft, FaArrowCircleRight, FaCopyright } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import User from '../user/user';
import EditUser from '../user/editUser';
import React from 'react';
import ReactDOM from 'react-dom';
import { useRef, useState, useEffect } from 'react';
import UserService from '../../services/userService';
function Dashboard() {

    const [user, renderUser] = useState(false);
    const [editUser, renderEditUser] = useState(false);
    const [dashboard, renderDashboard] = useState(false);
    const [collapseSideBar, setCollapseSideBar] = useState(false);
    const [userComponentData, setUserComponentData] = useState({});
   
    const toggleSidebar = (e) => {
        setCollapseSideBar(!collapseSideBar);
    }

    const handleRoute = (e, href) => {
        e.preventDefault();
        renderUser(false);
        renderEditUser(false);
        renderDashboard(false);
        if (href == "/user/user")
            renderUser(true);
        else if (href == "/user/editUser")
            renderEditUser(true);
    }

    useEffect(()=>{
        let u = new UserService();
        u.getUsers("https://dummyjson.com/users?limit=20")
            .then((resp) => {
                setUsers(resp.data.users);
            })
            .catch((err) => {
                console.log("MY ERROR::: ", err);
            });
        return () => console.log("Dashboard useEffect cleanup..");
    },[]);

    const onChildCallback = (data)=>{
        console.log("child data: ",data);
        setUserComponentData([...data]);
    }

    const hide = (el) => {
        if (!el) return;
        el.attributeStyleMap.set('display', 'none');
    };

    const show = (el) => {
        if (!el) return;
        if (el.attributeStyleMap.get('display')?.value === 'none')
            el.attributeStyleMap.delete('display');
    };

    return (<div className={`${dms.dashboardWrapper}`}>
        <Container className={dms.maxHeight}>
            <Row className={dms.maxHeight}>
                <Col sm={3} className={dms.leftContent}>

                    <ProSidebar collapsed={collapseSideBar} className={dms.maxHeight}>
                        <SidebarHeader>
                            <Menu iconShape="square">
                                { !collapseSideBar &&
                                <MenuItem icon={<FaArrowCircleLeft />} onClick={(e) => toggleSidebar(e)}>
                                    <a>Header</a>
                                </MenuItem>
                                }
                                 { collapseSideBar &&
                                <MenuItem icon={<FaArrowCircleRight />} onClick={(e) => toggleSidebar(e)}>
                                    <a>Header</a>
                                </MenuItem>
                                }
                            </Menu>
                        </SidebarHeader>
                        <SidebarContent>
                            <Menu iconShape="square">
                                <MenuItem icon={<FaGem />} >
                                    <Link href="/">
                                        <a onClick={(e) => handleRoute(e, "/")}>Dashboard</a>
                                    </Link>
                                </MenuItem>
                              
                                <SubMenu title="Components" icon={<FaBoxes />}>
                                    <MenuItem className='hoverable'>
                                        <Link href="/user/user">
                                            <a onClick={(e) => handleRoute(e, "/user/user")}>User</a>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem className='hoverable'>
                                        <Link href="/user/editUser">
                                            <a onClick={(e) => handleRoute(e, "/user/editUser")}>Edit User</a>
                                        </Link>
                                    </MenuItem>
                                </SubMenu>
                            </Menu>
                        </SidebarContent>
                    </ProSidebar>

                </Col>
                <Col className={`${dms.rightContent} rightContent`}>

                    <div className={`target ${dms.maxHeight}`}>
                        {user && <User inputData={userComponentData}/>}
                        {editUser && <EditUser parentData={onChildCallback} />}
                        {dashboard && <Dashboard />}
                    </div>
                </Col>
            </Row>
        </Container>
    </div >);
}

export default Dashboard;