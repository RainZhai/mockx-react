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
import {common,
    musicKindList,
    languageKindList
} from '../../utils/config'

require('es6-promise').polyfill();

const confirm = Modal.confirm

export default class Api extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tData: [],
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
                    if (searchFields && searchFields.language && searchFields.language.toString() !== '0') { // 搜索
                        // eslint-disable-next-line
                        songList = songList.filter(ele => ele.language === languageKindList.find(t => t.value === parseInt(searchFields.language), 10).mean)
                    }
                    if (searchFields && searchFields.start) { // 发行时间段收索
                        songList = songList.filter(ele => moment(ele.publishtime) >= moment(searchFields.start) && moment(ele.publishtime) <= moment(searchFields.end))
                    }

                    for (let i = 0; i < songList.length; i++) {
                        songArray.push({name: songList[i].name, 
                            category: songList[i].category.name,
                            url: common.domain+'/'+songList[i].category.name+'/'+songList[i].name, 
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

    componentDidMount() {
        this.fetchTableData('2') // 默认是热歌版
    }

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
            items: () => musicKindList.map(ele => ({
                value: ele.value,
                mean: ele.mean
            })),
        }, {
            title: '类型',
            key: 'language',
            type: 'select',
            defaultValue: '全部',
            items: () => languageKindList.map(ele => ({
                value: ele.value,
                mean: ele.mean
            })),
        }, {
            title: '发行时间段',
            key: ['start', 'end'],
            type: 'rangePicker',
        }]
    }

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

    add() {
        this.setState({
            modalShow: true
        })
    }

    onOk(param) {
        message.success('添加成功')
        this.onCancel()
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
                    message: '歌曲名必输!',
                }]
            }
        }, {
            label: '类别',
            type: 'select',
            name: 'language',
            items: () => languageKindList.map(ele => ({
                key: ele.value,
                value: ele.mean
            })),
            options: {
                rules: [{
                    required: true,
                    message: '语种必输!',
                }]
            }
        }, {
            label: '发行时间',
            type: 'datetime',
            name: 'publishTime',
            options: {
                rules: [{
                    required: true,
                    message: '发行时间必输!',
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