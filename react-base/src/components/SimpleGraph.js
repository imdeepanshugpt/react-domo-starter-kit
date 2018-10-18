// @flow
import React, { Component } from 'react';
import Chart from 'chart.js';
import styles from './SimpleGraph.css';

export default class SimpleGraph extends Component{

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const ctx = document.getElementById(`chart-${this.props.id}`).getContext('2d');
    Chart.defaults.global.defaultFontColor = "rgb(250,250,250)";
    Chart.defaults.global.defaultFontFamily = '"Lato", sans-serif';

    new Chart(ctx, {
      type: this.props.type,
      data: this.props.data,
      options: this.props.options,
    });
  }

  render() {
    return (
      <div className={styles.simpleGraph} data-tid="simpleGraph">
        <div className={`${styles.chart} ${this.props.color}-back`} data-tid="chart">
          <canvas id={`chart-${this.props.id}`}/>
        </div>
        <div className={styles.info} data-tid="info">
          <div className={styles.copy} data-tid="copy">
            {this.props.name}
          </div>
        </div>
      </div>
    );
  }
}
