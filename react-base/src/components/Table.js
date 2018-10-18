import React, { Component } from 'react';
import './Table.css';

export default class Table extends Component {

  render() {
    return (
      <div className="table-container">
        <div className={`table-heading ${this.props.color}-back`} >
          <div className="table-title">{this.props.title}</div>
          <div className="table-description">{this.props.description}</div>
        </div>
        <div className="table-data">
          <table className="table">
            <tbody>
              <tr className="table-header">
                {this.props.headers.map((element) => (<th>{element}</th>))}
              </tr>
              {this.props.data.map((element, index) => (<tr className={`row ${index % 2 === 0 ? "light" : "dark"}-row`} >{element.map((elem) => (<td>{elem}</td>))}</tr>))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
