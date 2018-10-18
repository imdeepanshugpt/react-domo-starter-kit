// @flow
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import './SequenceItem.css';
import ItemTypes from '../utils/constants';

const optionSource = {
  beginDrag(props) {
    return { option: props.value };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class SequenceItem extends Component {
  render() {

    const { connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div className={isDragging ? "item-dragging" : "item-container"}>
        <div className="item-text">{this.props.value}</div>
        <div className="item-button" onClick={()=>{this.props.onDelete()}}><i className="far fa-trash-alt" /></div>
      </div>
    );
  }
}

export default DragSource(ItemTypes.LIST_ITEM, optionSource, collect)(SequenceItem);
