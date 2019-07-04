import React from 'react';
import { Flow,withPropsAPI } from 'gg-editor';
import { message,} from 'antd';
import styles from './index.less';

class FlowWrapper extends React.Component{
  constructor (props) {
    super(props)
    this.state={
      currentId:''
    }
  }
  apiAction = (command)=>{
    const {propsApI} = this.props;
    console.log(this.props)
    setTimeout(()=>{
      this.props.propsAPI.executeCommand(command)
    },0)
  }
  handleAddItem = (e)=>{
    this.apiAction('undo')
  }
  onChange=(e)=>{
    const graph = e.item.graph;
    const group = e.item.group;
    const type = e.item.type;
    console.log(e,'e');
    console.log(graph.getEdges());
    console.log(graph.getNodes());
    //const edges = e.item.getOutEdges();
    console.log(e.item,'edges')
    const node = type === 'edge'?e.item.getSource():''
    const outEdges = node?node.getOutEdges():''
    console.log(node,'node')
    console.log(outEdges,'outEdges')
    if(outEdges.length>2){
      message.error('每个节点最多只能输出两条线!')
      this.handleAddItem()
    }
  }
  render(){
    return(
        <Flow ref={node =>(this.myRef = node)} className={styles.flow}  onAfterChange={(e)=>this.onChange(e)}/>
    )
  }
}

export default withPropsAPI(FlowWrapper)