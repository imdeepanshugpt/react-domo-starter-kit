import React, { Component } from 'react';
import './SingleStat.css';


export default class SingleStat extends Component {

  render() {
    return (
      <div className="stat-card">
        <div className={`stat-icon ${this.props.color}-back`}>
          <i className={`fa ${this.props.icon} fa-2x`} />
        </div>
        <div className="stat-info">
          <div className="stat">
            {this.props.stat}
          </div>
          <div className="stat-copy">
            {this.props.name}
          </div>
        </div>
      </div>
    );
  }
}
