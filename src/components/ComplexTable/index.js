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

export default class RuleTable extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { dataSource,loading} = this.props;
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
          noRequired: col.noRequired,
          pattern:col.pattern,
          max:col.max,
          isFocus:col.isFocus,
          type:col.type,
          value:col.value?col.value:null,
          valueOth:col.valueOth?col.valueOth:null,
          cols:col.cols?col.cols:null,
          only:col.only,
          dataSource:dataSource,
          handleModify:(form) => this.props.handleModify(form),
          selectVar:()=>this.props.selectVar(0,record,col.mold)
        })
      };
    });
    return (
      <div>
        <Button onClick={this.props.handleAdd} type="primary" style={{ marginBottom: 16, float: "right", zIndex: '1',marginRight: '20px' }}>
          选择变量
        </Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            loading={loading}
          />
      </div>
    );
  }
}


