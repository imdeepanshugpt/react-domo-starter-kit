// @flow
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import './DraggableOption.css';
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

class DraggableOption extends Component {

  static defaultProps = {
    canDelete: false
  }

  render() {
    let deleteButton = null;

    const { connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div className={isDragging ? "opt-dragging" : "opt-container"}>
        <div className="opt-text">{this.props.value}</div>
        {deleteButton}
      </div>
    );
  }
}

export default DragSource(ItemTypes.OPTION, optionSource, collect)(DraggableOption);
