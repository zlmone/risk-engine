import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import styles from '../../FilterIpts.less'
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({risklabel})=>({
  risklabel
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    this.props.changeDefault(1)
    const formData = this.getFormValue()
    await this.props.dispatch({
      type: 'risklabel/saveQueryData',
      payload: {
        ...formData
      }
    })
    this.props.change(1, this.props.pageSize)
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
    this.props.getSubKey(this,'child')
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin}  gutter={24}>
          <Col
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="标签名称" {...formItemConfig}>
              {getFieldDecorator('labelName',{
                initialValue:'',
                rules:[
                  {max:20,message:'最多输入20位!'}
                ]
              })(
                <Input maxLength={21}/>
              )}
            </FormItem>
          </Col>
          <Col
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem {...formItemConfig}>
              <Button type="primary" onClick={this.formSubmit}>查询</Button>
              <Button type="primary" onClick={this.reset}>清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
