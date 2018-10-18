// @flow
import React, { Component } from 'react';
import Chart from 'chart.js';
import Header from './Header';
import styles from './FullGraph.css';

export default class FullGraph extends Component {

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const ctx = document.getElementById(`chart`).getContext('2d');
    Chart.defaults.global.defaultFontFamily = '"Lato", sans-serif';
    Chart.defaults.global.defaultFontColor = "#2e2e2e";

    new Chart(ctx, {
      type: this.props.type,
      data: this.props.data,
      options: this.props.options,
    });
  }

  render() {
    return (
      <div className={styles.graph} data-tid="graph">
        <div className={`${styles.info} ${styles.color}-back`} data-tid="info">
          <Header text={this.props.name} />
          <p className={styles.description} data-tid="description">{this.props.description}</p>
        </div>
        <div className={`${styles.chart}`} data-tid="chart">
          <canvas id='chart' />
        </div>
      </div>
    );
  }
}
