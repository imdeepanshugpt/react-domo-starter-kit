import React, { Component } from 'react';
import './App.css';
import * as domo from 'ryuu.js';
import CompareTouchPage from './containers/CompareTouchPage';
import { firstLoad, getComparisonsData } from './utils/data';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      formattedData: [],
    }

    this.getDomoData('Touchpoints', 'filter=gift_date last 3 months');
  }

  render() {
    return (
      <div className="App">
        <CompareTouchPage 
          data={this.state.formattedData} 
          reload={this.reloadData} 
          setDateRange={this.setDateRange} 
        />
      </div>
    );
  }

  setDomoData = (data) => {
    console.log("Data fetched...");
    firstLoad(data);
    this.setState({data, formattedData: getComparisonsData()});
  }

  reloadData = () => {
    this.setState({formattedData: getComparisonsData()});
  }

  setDateRange = (filterRange) => {
    this.getDomoData('Touchpoints', `filter=${filterRange}`)
  }

  getDomoData(alias, params = '') {
    let apiCall = '/data/v1/' + alias + '?' + params;

    domo.get(apiCall).then((data) => {this.setDomoData(data);});
  }
}

export default App;
