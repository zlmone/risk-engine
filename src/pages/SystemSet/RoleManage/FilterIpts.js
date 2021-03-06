import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import { connect } from 'dva'
import styles from '../FilterIpts.less'
import permission from '@/utils/PermissionWrapper';

const Option = Select.Option;
const FormItem = Form.Item

@permission
@connect(({ role }) => ({
  role
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    const formData = this.getFormValue();
    const { dispatch } =  this.props;
    await dispatch({
      type: 'role/setQueryConfig',
      payload: {
        ...formData
      }
    })
    this.props.change(1,this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    return this.props.form.getFieldsValue()
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
      labelCol: { span:8 },
      wrapperCol: { span:16 },
    }
    const {permission} = this.props
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin} gutter={16}>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="角色名称" {...formItemConfig}>
              {getFieldDecorator('roleName')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="角色状态" {...formItemConfig}>
              {getFieldDecorator('status')(
                <Select allowClear={true}>
                  <Option value={0}>启用</Option>
                  <Option value={1}>禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem>
              {
                permission.includes('re:merchantRole:list') ? <Button type="primary" onClick={this.formSubmit}>查询</Button> : null
              }
              <Button type="primary" onClick={this.reset}>清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
