import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import './SequenceContainer.css';
import ItemTypes from '../utils/constants';
import SequenceItem from './SequenceItem';

const containerTarget = {
  drop(props, monitor, component) {
    const arr = component.state.sequence;
    arr.push(monitor.getItem().option);
    component.setState({sequence: arr});

    props.onChange(arr);

    return {didDrop: true};
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class SequenceContainer extends Component {

  constructor() {
    super();
    this.state = {
      sequence: []
    }

    this.onDelete = this.onDelete.bind(this);
  }

  // componentWillReceiveProps(props) {
  //   console.log("shouldComponentUpdate");
  //   if (props.sequence.length > 0) {
  //     this.setState({});
  //   }
  // }

  onDelete(index) {
    const arr = this.state.sequence;
    arr.splice(index, 1);
    this.setState({sequence: arr});
    this.props.onChange(arr);
  }

  render() {
    const { connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div className="seq-container" >
        {this.state.sequence.length > 0 ? this.state.sequence.map((element, index) => (
          <SequenceItem key={index} value={element} onDelete={() => {this.onDelete(index)}} />
        )) : "Drag a channel here to begin analysis."}
        {isOver && (<div className="overlay">Release to add to sequence...</div>)}
      </div>
    );
  }
}

export default DropTarget(ItemTypes.OPTION, containerTarget, collect)(SequenceContainer);
