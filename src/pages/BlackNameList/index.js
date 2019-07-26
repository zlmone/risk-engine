import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import DropdownDetail from '@/components/DropdownDetail/DropdownDetail'
import Swal from 'sweetalert2'
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Icon
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ assetDeploy, loading }) => ({
  assetDeploy,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class VarList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
      {
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '身份证号',
        dataIndex: 'idCard',
        key:'idCard'
      },
      {
        title: '灰名单来源',
        key:'source',
        dataIndex:'source'
      },
      {
        title: '性别',
        key:'sex',
        dataIndex:'sex'
      },
      {
        title: '手机号',
        key:'phone',
        dataIndex:'phone'
      },
      {
        title: '状态',
        key:'status',
        dataIndex:'status',
        render:(record)=>record==1?'启用':'禁用'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const linkArr = [
            {
              label: record.status===1?'禁用':'启用',
              show: true,
              clickHandler: async() => {
                const confirm = await Swal({
                  text: '确定要执行本次操作吗',
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                if (confirm.value) {
                  // 请求开启/停用方法

                }
              }
            },
            {
              label: '拉黑',
              show: true,
              clickHandler: async() => {
                const confirm = await Swal({
                  text: '确定要执行本次操作吗',
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                if (confirm.value) {
                  // 请求开启/停用方法

                }
              }
            },
            {
              label: '删除',
              show: true,
              clickHandler: async() => {
                const confirm = await Swal({
                  text: '确定要执行本次操作吗',
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                if (confirm.value) {
                  // 请求开启/停用方法

                }
              }
            },

          ];
          return <DropdownDetail linkArr={linkArr}></DropdownDetail>
        }
      }],
      data:[
        {
          key:1,
          name:'张三',
          idCard:'160145236545632654569',
          source:'壹钱包逾期',
          sex:'男',
          phone:13333333333,
          status:0,
        },
        {
          key:2,
          name:'张三',
          idCard:'160145236545632654569',
          source:'壹钱包逾期',
          sex:'男',
          phone:13333333333,
          status:1,
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1:添加 2：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1
    };
  }
  componentDidMount() {
    this.change()
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    let formData ;
    if(this.child){
      formData = this.child.getFormValue()
    }else{
      formData = {}
    }
    this.props.dispatch({
      type: 'assetDeploy/riskSubmit',
      data: {
        ...formData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  confirm=(e)=>{
    console.log(e);
    message.success('Click on Yes');
  }

  cancel=(e) =>{
    console.log(e);
    message.error('Click on No');
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //监听子组件数据变化
  handleChildChange = (newState)=>{
    this.setState({
      modalStatus:newState
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //查询时改变默认页数
  changeDefault=(value)=>{
    this.setState({
      current:value
    })
  }
  //右上角渲染
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={()=>this.goAddPage({type:1})}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = (obj={})=>{
    //this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
    router.push({
      pathname:'/varManage/varlist/editPage',
      state:obj
    })
  }
  //去风控策略列表
  goPolicyList = ()=>{
    router.push({
      pathname:'/varManage/riskpolicylist/list',
    })
  }
  render() {
    return (
     <PageTableTitle title={'本地黑名单库'} renderBtn={this.renderTitleBtn}>
        <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
        <Table
          bordered
          pagination={false}
          columns={this.state.columns}
          dataSource={this.state.data}
          loading={this.props.loading}
        />
        <Pagination
          style={{ marginBottom: "50px" }}
          showQuickJumper
          defaultCurrent={1}
          current={this.state.current}
          total={100}
          onChange={this.onChange}
          showTotal={(total, range) => this.showTotal(total, range)}
        />
      </PageTableTitle>
    )
  }
}