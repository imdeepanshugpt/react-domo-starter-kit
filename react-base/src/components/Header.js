import React, { Component } from 'react';
import * as data from '../utils/data';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './Header.css';
import 'react-datepicker/dist/react-datepicker.css';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayFilter: false,
      startDate: moment().subtract(1, "months"),
      endDate: moment(),
      filters: {
        location: "ALL"
      }
    }
  }

  static defaultProps = {
    subhead: false,
  }

  toggleFilter = event => {
    this.setState({displayFilter: !this.state.displayFilter})
  }

  setLocationFilter = value => {
    this.setState({filters: { location: value }});
    data.setDonorFilters({onlyArea: value});  
    this.props.onFilterChange({ location: value });
  }

  changeStartDate = date => {
    this.setState({startDate: date});
  }

  changeEndDate = date => {
    this.setState({endDate: date});
  }

  confirmDate = event => {
    event.stopPropagation();
    this.props.setDateRange(`gift_date >= ${this.state.startDate.get('year')}-${this.state.startDate.get('month') + 1}-${this.state.startDate.get('date')}, gift_date %3C= ${this.state.endDate.get('year')}-${this.state.endDate.get('month') + 1}-${this.state.endDate.get('date')}`);
  }

  render() {
    let filter = null;
    if (this.state.displayFilter) {
      filter = (
        <div className="filter-container">
          <p className="filter-heading">Location</p>
          <ul className="filter-group">
            <li onClick={(event) => { event.stopPropagation(); this.setLocationFilter("VA");}} className={`radio-selection ${this.state.filters.location === "VA" ? 'selected' : null}`}>Virginia</li>
            <li onClick={(event) => { event.stopPropagation(); this.setLocationFilter("MD");}} className={`radio-selection ${this.state.filters.location === "MD" ? 'selected' : null}`}>Maryland</li>
            <li onClick={(event) => { event.stopPropagation(); this.setLocationFilter("DC");}} className={`radio-selection ${this.state.filters.location === "DC" ? 'selected' : null}`}>Washington, D.C.</li>
            <li onClick={(event) => { event.stopPropagation(); this.setLocationFilter("OTHER");}} className={`radio-selection ${this.state.filters.location === "OTHER" ? 'selected' : null}`}>Other Areas</li>
            <li onClick={(event) => { event.stopPropagation(); this.setLocationFilter("ALL");}} className={`radio-selection ${this.state.filters.location === "ALL" ? 'selected' : null}`}>All Areas</li>
          </ul>
          <p className="filter-heading">Date Range</p>
          <div className="filter-group" onClick={event => { event.stopPropagation(); }}>
            from
            <DatePicker withPortal selected={this.state.startDate} onChange={this.changeStartDate}/>
            to
            <DatePicker withPortal selected={this.state.endDate} onChange={this.changeEndDate}/>
            <button onClick={this.confirmDate}>Select Date Range</button>
          </div>
        </div>
      );
    }
    if (this.props.subhead) {
      return (
        <div className="subheading">
          <h3 className="sub">{this.props.text}</h3>
        </div>
      );
    }
    return (
      <div className="heading">
        <h1 className="heading-text">{this.props.text}</h1>
        <div className="heading-filter" onClick={event => {this.toggleFilter(event);}}>
          <i className="fas fa-filter" />
          {filter}
        </div>
      </div>
    );
  }
}
