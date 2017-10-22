import React from 'react'
import { Menu, Icon, Layout } from 'antd'
import { Link } from 'react-router-dom'
// import * as screenfull from 'screenfull'
import {util} from '../utils/util'
import './header.less'

const SubMenu = Menu.SubMenu
const { Header } = Layout

export default class Top extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: ''
        }
    }

    componentDidMount() {
        this.getUser()
    }

    getUser = () => {
        this.setState({
            username: localStorage.getItem('username')
        })
    }

    clear = (item) => {
        if (item.key === 'logOut') {
            util.setCookie('loginstate','0',0);
            localStorage.setItem('username','');
            this.props.clear()
        }
    }

    // screenFull = () => {
    //     if (screenfull.enabled) {
    //         screenfull.request();
    //     }
    // }
    render() {
        return (
            <Header style={{ background: '#fff'}}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />
                <Menu mode="horizontal" className="logOut" onClick={this.clear}>
                    <SubMenu title={<span><Icon type="user" />{ this.state.username }</span>} >
                        <Menu.Item key="logOut"><Link to="/login" >退出</Link></Menu.Item>
                    </SubMenu>
                </Menu>
                {/* <Icon
                    className="screenFull"
                    type="arrows-alt"
                    onClick={this.screenFull}
                /> */}
            </Header>
        );
    }
}