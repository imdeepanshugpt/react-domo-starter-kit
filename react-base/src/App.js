import React, { Component } from 'react';
import './App.css';
import * as domo from 'ryuu.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{salesperson: "Loading..."}],
    }

    //this.getDomoData('Sales');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the React-Domo Starter</h1>
        </header>
        <p>Last sale made by: {this.state.data[0].salesperson}</p>
      </div>
    );
  }

  setDomoData = (data) => {
    this.setState({data});
  }

  getDomoData(alias, params = '') {
    let apiCall = '/data/v1/' + alias + '?' + params;

    domo.get(apiCall).then((data) => {this.setDomoData(data);});
  }
}

export default App;
