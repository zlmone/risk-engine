import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Form,
  Select,
  Button,
  Divider,
  Checkbox,
  Pagination,
  Empty
} from 'antd';
import { addListKey,deepCopy } from '@/utils/utils'
import { connect } from 'dva'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  {
    variableName:'年龄',
    variableType:'num',
    value:'年龄',
    variableCode:'age',
    length:1,
    order:1,
    varId:3,
    kind:'num'
  },
  {
    variableName:'注册时间',
    variableType:'time',
    value:'注册时间',
    variableCode:'sign',
    length:1,
    order:1,
    varId:2,
    kind:'str',
    isenum:0,
    option:[
      {
        id:1,
        name:'111'
      },
      {
        id:2,
        name:'222'
      },
      {
        id:3,
        name:'333'
      },
    ]
  },
  {
    name:'评分卡得分',
    type:'数字',
    value:'通过评分模型得出的得龄',
    code:'33',
    length:1,
    order:1,
    id:3,
    kind:'num'
  },
  {
    name:'拒绝原因编码',
    type:'字符',
    value:'拒绝原因编码合集',
    code:'44',
    length:1,
    order:1,
    id:4,
    kind:'str',
  },
  {
    name:'日期',
    type:'日期',
    value:'---',
    code:'55',
    length:1,
    order:1,
    id:5,
    kind:'date',
    isenum:0,
  },
  {
    name:'性别',
    type:'字符',
    value:'---',
    code:'66',
    length:1,
    order:1,
    id:5,
    kind:'str',
    isenum:0,
  },
  {
    name:'姓名',
    type:'数字',
    value:'---',
    code:'77',
    length:1,
    order:1,
    id:6,
    kind:'num'
  },
  {
    name:'高风险规则触发数',
    type:'数字',
    value:'---',
    code:'88',
    length:1,
    order:1,
    id:7,
    kind:'num',
    option:[
      {
        id:1,
        name:'111'
      },
      {
        id:2,
        name:'222'
      },
      {
        id:3,
        name:'333'
      },
    ]
  },
  {
    name:'银行卡认证',
    type:'数字',
    value:'---',
    kind:'num',
    code:'99',
    length:1,
    order:1,
    id:8,
    kind:'num'
  },
];
const defaultCheckedList = ['Apple', 'Orange'];
@connect(({varList})=>({
  varList,
}))

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:false,
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      singleChecked:false,
      radioValue:'',
      type:1,// 0:单选框  1：多选框
      pageSize:10,
      currPage:1,
      loading:false,
    }
  }
  //变量列表查询
  formSubmit=()=>{
    this.change(1)
  }
  change = async (page)=>{
    const {queryData} = this.props;
    const res = await  this.props.dispatch({
      type: 'varList/queryVarList',
      payload: {
        ...this.getFormValue(),
        ...queryData,
        currPage:page,
        pageSize:this.state.pageSize,
      }
    })
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //  分页器改变页数的时候执行的方法
  onPageChange = (current) => {
    this.setState({
      currPage:current
    },()=>{
      this.change(current)
    })
  }
  onChange = (checkedList) => {
    console.log('选中',checkedList)
    const {varList} = this.props.varList
    this.setState({
      checkedList:checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < varList.length),
      checkAll: checkedList.length === varList.length,
    });
  }

  onCheckAllChange = (e) => {
    const { varList } = this.props.varList
    const { pageList } = this.props
    let handleVarList = [ ...varList, ...pageList ]
    let allList = []
    this.duplicateRemoval(handleVarList).map(item => {
      if (!item.disabled) {
        allList.push(item)
      }
    })
    this.setState({
      checkedList: e.target.checked ? allList : [],
      indeterminate: false,
      checkAll: e.target.checked,
    })
  }
  //单选按钮onChange事件
  onRadioChange = (e)=>{
    console.log('radio checked', e.target.value);
    this.setState({
      radioValue:e.target.value
    })
  }
  //点击确定
  submitHandler=()=>{
      let records={};
      const {radioValue,checkedList}=this.state;
      const {type}=this.props;
      if(type){
        //多选
        checkedList.forEach((item,key)=>{
          item['variableId'] = item['id']
          item['createTime'] = item['updateTime']
        })
        return checkedList
      }else{
        //单选
        if(Object.keys(radioValue).length){
          records['varId']=radioValue['id'];
          records['variableId']=radioValue['id'];
          records['varCode']=radioValue['variableCode'];
          records['varName']=radioValue['variableName'];
          records['varType']=radioValue['variableType'];
          records['enumFlag']=radioValue['enumFlag'];
          records['enumList']=radioValue['variableEnumList'];
        }
        Object.assign(records,radioValue)
        console.log(records)
        return records
      }
  }
  deepCopy =(obj)=> {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是一个对象
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj;
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'addForm')
  }
  emptyCheck=()=>{
    this.setState({
      checkedList:[],
      checkAll:false,
      radioValue:''
    })
  }
  componentWillReceiveProps(newProps){
    this.setState({
      visible:newProps.showState
    })
  }
  //一级分类选择监听事件
  oneClassHandle=(value)=>{
    console.log(value)
    this.props.form.setFields({
      secondTypeId: {
        value:''
      },
    });
    //二级分类列表查询
    this.props.dispatch({
      type: 'varList/queryTwoClassList',
      payload: {
        firstTypeId:value,
      }
    })
  }
  //   将已经选择的变量禁止重新选择一遍
  duplicateRemoval(list = []) {
    let obj = {}
    list.forEach(item => {
      if( obj[item.id] ) {
        obj[item.id].disabled = true
      } else {
        obj[item.id] = item
        obj[item.id].disabled = false
      }
    })
    const result = Object.values(obj)
    return result
  }
  render() {
    const {visible,loading} = this.state;
    const { getFieldDecorator } = this.props.form
    const { varList,page,oneClassList,twoClassList } = this.props.varList
    const { pageList } = this.props
    let handleVarList = [ ...varList, ...pageList ]
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:16},
    }
    return (
        <Form
          className="ant-advanced-search-form"
        >
          <Row style={{marginBottom:'32px'}} gutter={0} type="flex" align="middle">
            <Col xxl={6} md={10}>
              <FormItem label="变量分类"  wrapperCol={{span:8}}>
                {getFieldDecorator('firstTypeId',{
                })(
                    <Select
                      allowClear={true}
                      onChange={this.oneClassHandle}
                      placeholder="一级分类"
                    >
                      {
                        oneClassList&&oneClassList.map((item,index)=>{
                          return (
                            <Option value={item.id} key={index}>{item.typeName}</Option>
                          )
                        })
                      }
                    </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={4} md={8}>
              <FormItem wrapperCol={{span:16}}>
                {getFieldDecorator('secondTypeId',{
                })(
                  <Select
                    allowClear={true}
                    placeholder="二级分类"
                  >
                    {
                      twoClassList&&twoClassList.map((item,index)=>{
                        return (
                          <Option value={item.id} key={index}>{item.typeName}</Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={6} md={10}>
              <FormItem label="变量名称" {...formItemConfig}>
                {getFieldDecorator('variableName',{
                  initialValue:''
                })(
                  <Input placeholder="请输入变量名称!"/>
                )}
              </FormItem>
            </Col>
            <Col offset={2}>
              <Button type="primary" onClick={this.formSubmit}>查询</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={this.reset}>清空查询</Button>
            </Col>
          </Row>
          <Divider />
          <div style={{marginBottom:'32px'}}>
            {
              this.props.type?
                <Checkbox.Group style={{ width: '100%' }} value={this.state.checkedList} onChange={this.onChange}>
                  {
                    this.duplicateRemoval(handleVarList).length > 0 ? this.duplicateRemoval(handleVarList).map((item, index) => {
                      return  <Row type="flex" align="middle" key={index}>
                        <Col span={8}>
                          <Checkbox disabled={item.disabled} value={item}>{item.variableName}</Checkbox>
                        </Col>
                        <Col span={8}>{item.variableTypeStr}</Col>
                        <Col span={8}>{item.variableName}</Col>
                      </Row>
                    }):<Empty />
                  }
                </Checkbox.Group>:
                <RadioGroup style={{ width: '100%' }} value={this.state.radioValue} onChange={this.onRadioChange}>
                  {
                    varList.length > 0 ? varList.map((item, index) => {
                      return  <Row type="flex" align="middle" key={index}>
                        <Col span={8}>
                          <Radio  value={item}>{item.variableName}</Radio >
                        </Col>
                        <Col span={8}>{item.variableTypeStr}</Col>
                        <Col span={8}>{item.remark}</Col>
                      </Row>
                    }):<Empty />
                  }
                </RadioGroup>
            }
          </div>
          <Divider />
          <Row style={{marginBottom:'32px'}} type="flex" align="middle" justify="space-between">
            <Col>
              {
                this.props.type?
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    全选
                  </Checkbox>:null
              }
            </Col>
            <Col>
              <Pagination
                style={{ marginBottom: "50px" }}
                showQuickJumper
                defaultCurrent={1}
                current={this.state.currPage}
                total={page.totalNum}
                onChange={this.onPageChange}
                showTotal={(total, range) => this.showTotal(total, range)}
              />
            </Col>
          </Row>
        </Form>
    )
  }
}
