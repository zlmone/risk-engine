import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import styles from '../FilterIpts.less'
import { connect } from 'dva'
import permission from '@/utils/PermissionWrapper';
const Option = Select.Option;
const FormItem = Form.Item

@permission
@connect()

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    // this.props.changeDefault(1)
    const formData = this.getFormValue()
    await this.props.dispatch({
      type: 'template/setQueryData',
      payload: formData
    })
    this.props.change(1)
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
      labelCol:{
        xs: { span: 3 },
        sm: { span: 7 }
      },
      wrapperCol:{
        xs: { span: 21 },
        sm: { span: 17 }
      },
    }
    const { permission } =  this.props;
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin} gutter={16}>
          <Col 
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="报告名称" {...formItemConfig}>
              {getFieldDecorator('name')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col 
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="负责人" {...formItemConfig}>
              {getFieldDecorator('adminName')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col 
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem>
              {
                permission.includes('re:reportTemplate:list') ?
                  <Button type="primary" onClick={this.formSubmit}>查询</Button>:null
              }
              <Button type="primary" onClick={this.reset}>清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
