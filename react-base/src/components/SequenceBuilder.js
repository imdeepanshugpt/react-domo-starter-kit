// @flow
import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './SequenceBuilder.css';
import DraggableOption from './DraggableOption';
import SequenceContainer from './SequenceContainer';

class SequenceBuilder extends Component {

  constructor() {
    super();
    this.state = {
      sequence: []
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(sequence) {
    this.setState({sequence});

    this.props.onChange(sequence);
  }

  render() {
    return (
      <div>
        <div className="seq-subheading">
          <h3 className="seq-sub">{this.props.title}</h3>
        </div>
        <div className="options-container" >
          {this.props.options.map((element) => (<DraggableOption key={element} value={element} />))}
        </div>
        <SequenceContainer sequence={this.state.sequence} onChange={this.onChange} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(SequenceBuilder);
