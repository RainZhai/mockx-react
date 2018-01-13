import React from 'react'
import {
    Button,
    message,
    Modal
} from 'antd'
import SearchBar from 'components/searchbar'
import Table from 'components/table'
import {
    FormModal
} from 'components/modalForm'
import 'whatwg-fetch'
import fetchJsonp from 'fetch-jsonp'
import './index.less'
import moment from 'moment'
import {common} from '../../utils/config'

require('es6-promise').polyfill();

const confirm = Modal.confirm

export default class Api extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tData: [],
            catetories: [],
            item: {},
            loading: true,
            modalShow: false,
            modalShowEdit: false,
        }
        this.add = this.add.bind(this)
        this.onOk = this.onOk.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onOkEdit = this.onOkEdit.bind(this)
        this.onCancelEdit = this.onCancelEdit.bind(this)
    }

    // 获取表格数据
    fetchTableData = (typeId, searchFields) => {
        let state = this.state;
        fetchJsonp(common.domain+`/admin/mock/list?type=${typeId}&size=100&offset=0`, {
                method: 'GET'
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                const songArray = []
                if (data.success) {
                    let songList = data.data.mocks
                    // 分类搜索
                    if (searchFields && searchFields.category && searchFields.category.toString() !== '') {
                        // eslint-disable-next-line
                        let cate = state.catetories.find(t => t._id === searchFields.category).name;
                        songList = songList.filter(ele => ele.category.name === cate);
                    }
                    //发行时间段搜索
                    if (searchFields && searchFields.start) { 
                        songList = songList.filter(ele => moment(ele.meta.createAt) >= moment(searchFields.start) && moment(ele.meta.createAt) <= moment(searchFields.end))
                    }

                    for (let i = 0; i < songList.length; i++) {
                        songArray.push({name: songList[i].name, 
                            category: songList[i].category.name,
                            url: common.domain+'/mock/'+songList[i].category.name+'/'+songList[i].name, 
                            json: songList[i].json, 
                            publishtime: songList[i].meta.createAt})
                    }
                    this.setState({tData: songArray, loading: false});
                }
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    // 获取分类数据
    fetchCatesData = () => {
        fetchJsonp(common.domain+`/admin/category/list`, {
                method: 'GET'
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    this.setState({catetories: data.data.catetories});
                }
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    componentDidMount() {
        //调用mock分类接口获取分类列表
        this.fetchCatesData()
        //调用mock列表接口获取列表数据
        this.fetchTableData('2')
    }
    componentWillUnmount(){ 
        //重写组件的setState方法，直接返回空
        this.setState = (state,callback)=>{
          return;
        };  
    }
    //搜索方法
    onSearch = (searchFields) => {
        const typeId = searchFields.type ? searchFields.type : 2
        this.fetchTableData(typeId, searchFields)
    }

    searchFields = () => {
        return [{
            title: '类型(单独搜索)',
            key: 'type',
            type: 'select',
            defaultValue: '全部',
            onChange: (value) => this.fetchTableData(value),
            items: () => this.state.catetories.map(ele => ({
                value: ele._id,
                mean: ele.name
            })),
        }, {
            title: '类型',
            key: 'category',
            type: 'select',
            defaultValue: '全部',
            items: () => this.state.catetories.map(ele => ({
                value: ele._id,
                mean: ele.name
            })),
        }, {
            title: '发行时间段',
            key: ['start', 'end'],
            type: 'rangePicker',
        }]
    }
    //列表头
    tableHeader = () => {
        return [{
            dataIndex: 'name',
            title: '名称',
            width: 200,
            // render: (text, record) => {
            // }
        },{
            dataIndex: 'url',
            title: '接口地址',
            width: 200,
        },{
            dataIndex: 'category',
            title: '类别',
            width: 200,
        }, {
            dataIndex: 'json',
            title: 'json内容',
            width: 200,
        }, {
            dataIndex: 'publishtime',
            title: '发行时间',
            width: 200,
        }, ]
    }
    //点击添加打开弹框
    add() {
        this.setState({
            modalShow: true
        })
    }
    //添加数据保存
    onOk(param) {
        //+JSON.stringify({mock:param})
        fetchJsonp(common.domain+`/admin/mock?mock%5Bname%5D=${param.name}&mock%5Bjson%5D=${param.json}&mock%5Bcategory%5D=${param.category}`, {
            method: 'GET',
            //body: JSON.stringify({mock:param})
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.success) {
                message.success('添加成功')
                this.onCancel()
            }else{
                message.error('出错了')
            }
        })
        .catch((e) => {
            console.log(e.message);
            message.error('出错了')
        });
    }

    onCancel() {
        this.setState({
            modalShow: false
        })
    }

    onOkEdit(param) {
        this.setState({
            modalShowEdit: false
        })
        message.success('编辑成功')
    }

    onCancelEdit() {
        this.setState({
            modalShowEdit: false
        })
    }

    tableAction = (actionKey, item) => {
        if (actionKey === 'edit') {
            this.setState({
                item: item,
                modalShowEdit: true
            })
        } else if (actionKey === 'delete') {
            confirm({
                title: '提示',
                content: '确定删除吗',
                onOk: () => {
                    message.success('删除成功')
                },
                onCancel() {}
            })
        }
    }

    fields = () => {
        return [{
            label: '名称',
            type: 'input',
            name: 'name',
            options: {
                rules: [{
                    required: true,
                    message: '名称必填!',
                }]
            }
        }, {
            label: '类别',
            type: 'select',
            name: 'category',
            items: () => this.state.catetories.map(ele => ({
                key: ele._id,
                value: ele._id,
                mean: ele.name
            })),
            options: {
                rules: [{
                    required: true,
                    message: '类别必填!',
                }]
            }
        }, {
            label: 'json内容',
            type: 'textarea',
            name: 'json',
            options: {
                rules: [{
                    required: true,
                    message: 'json必填!',
                }]
            }
        }, {
            label: '发布时间',
            type: 'datetime',
            name: 'publishTime',
            options: {
                rules: [{
                    required: true,
                    message: '发布时间必填!',
                }]
            }
        }]
    }

    fieldsEdit = () => {
        const item = this.state.item
        return [{
            label: '名',
            type: 'input',
            name: 'name',
            items: item.name,
            options: {
                initialValue: item.name,
                rules: [{
                    required: true,
                    message: '名必填!',
                }]
            }
        }, {
            label: 'json',
            type: 'input',
            name: 'json',
            options: {
                initialValue: item.json,
                rules: [{
                    required: true,
                    message: 'json必输!',
                }]
            }
        },{
            label: '发布时间',
            type: 'datetime',
            name: 'publishTime',
            options: {
                initialValue: moment(item.publishtime),
                rules: [{
                    required: true,
                    message: '发布时间必填!',
                }]
            }
        }]
    }

    render() {
        return (
            <div id="wrap">
                <SearchBar
                    onSubmit={this.onSearch}
                    fields={this.searchFields()}
                />
                <div className="tableBox">
                    <Button onClick={this.add} className="addButton">添加</Button>
                    <div style={{ paddingTop: 43 }}>
                        <Table
                            onCtrlClick={ this.tableAction }
                            pagination={ true }
                            pageSize={10}
                            header={ this.tableHeader() }
                            data={ this.state.tData }
                            loading={ this.state.loading }
                            action={row => [{
                                key: 'edit',
                                name: '修改',
                                color: 'blue',
                                icon: 'edit',
                            }, {
                                key: 'delete',
                                name: '删除',
                                color: 'red',
                                icon: 'delete'
                            }]}
                            scroll={{y: 385 }}
                        />
                    </div>
                </div>
                <FormModal
                    modalKey="add"
                    visible={this.state.modalShow}
                    title="添加"
                    fields={this.fields()}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    okText="保存"
                />
                <FormModal
                    modalKey="Edit"
                    visible={this.state.modalShowEdit}
                    title="修改"
                    fields={this.fieldsEdit()}
                    onOk={this.onOkEdit}
                    onCancel={this.onCancelEdit}
                    okText="保存"
                />
            </div>
        )
    }
}