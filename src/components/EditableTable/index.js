import React, { PureComponent, Fragment } from 'react';
import EditableCell from './EditableCell'
import { 
  Button,
  Form,
  Popconfirm,
  Table,
  Input
} from 'antd';
import { connect } from 'dva'

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@Form.create()

export default class EditableTable extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { dataSource } = this.props.list;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.props.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          isRequired: col.nonRequired,
          pattern:col.pattern,
          max:col.max,
          dataSource:dataSource,
          only:col.only,
          emDelFlag:this.props.emDelFlag,
          message:col.message,
          enumListSave:(list)=>this.props.enumListSave(list),
          handleModify:(form) => this.props.handleModify(form)
        })
      };
    });
    return (
      <div>
        <Button onClick={this.props.handleAdd} type="primary" style={{ marginBottom: 16, float: "right", zIndex: '1',marginRight: '20px' }}>
          添加
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}


