import React from 'react';
import {Form, Input, Button, notification, Icon} from 'antd';
import fetchJsonp from 'fetch-jsonp';
import createHistory from 'history/createHashHistory';
import {common} from '../../utils/config'

import './index.less'

const FormItem = Form.Item;
const history = createHistory();

class LoginPage extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        let username = this
            .props
            .form
            .getFieldsValue()
            .username;
        let password = this
            .props
            .form
            .getFieldsValue()
            .password;

        fetchJsonp(common.domain + `/user/signin?user%5Bname%5D=${username}&user%5Bpassword%5D=${password}`, {
            method: 'GET'
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                localStorage.setItem('username',username);
                // 表单的路由处理
                history.push('/index');
            } else {
                this.openNotificationWithIcon('info','用户名或密码错误');
            }
        }).catch((e) => {
            console.log(e.message);
            this.openNotificationWithIcon('info','出错啦');
        });
    }

    // 返回一个弹框对象，提示用户名和密码
    openNotificationWithIcon = (type,msg) => {
        return notification[type]({message: '提示', description: msg, duration: 6, icon: <Icon type="smile-circle" style={{
            color: '#108ee9'
        }}/>})
    }
    componentDidMount() {
        this.openNotificationWithIcon('info',"请进行登录");
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div className="loginpagewrap">
                <div className="box">
                    <p>Welcome to the mockx</p>
                    <div className="loginWrap">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入用户名'
                                        }
                                    ]
                                })(<Input placeholder="Username"/>)}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入密码'
                                        }
                                    ]
                                })(<Input type="password" placeholder="Password"/>)}
                            </FormItem>
                            <Button type="primary" htmlType="submit" className="loginBtn">Login</Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

let Login = Form.create()(LoginPage);
export default Login;