// @flow
import React, { Component } from "react";
import "./CompareTouchPage.css";
import * as data from "../utils/data";
import * as util from "../utils/util";
import Header from "../components/Header";
// import Dropdown from '../components/Dropdown';
import SingleStat from "../components/SingleStat";
import Table from "../components/Table";
import SequenceBuilder from "../components/SequenceBuilder";
import SimpleGraph from "../components/SimpleGraph";

export default class CompareTouchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sequence: [],
      filters: {
        location: "ALL"
      }
    };

    this.onChange = this.onChange.bind(this);
  }

  calculateStats() {
    const stats = {
      totalDateDiff: 0,
      totalCount: 0,
      totalRevenue: 0,
      totalLifetimeRevenue: 0,
      totalLifetimeGiftCount: 0,
      dateDiffs: [],
      donorTypes: {
        "Multi-Year": 0,
        Lapsed: 0,
        Reactivated: 0,
        "First-Time": 0
      },
      predict: {
        actions: [],
        effect: []
      },
      bucketCounts: [],
      bucketSize: 500
    };

    // console.log(this.state.data.length);

    const found = [];

    //console.log(this.props.data);

    this.props.data.forEach(element => {
      // if (element.source.source === this.state.first) {
      //   stats.totalCount += 1;
      //   stats.totalRevenue += element.giftRevenue;
      //   if (element.followingTouches.length === 0) {
      //     stats.onlyTouch += 1;
      //   } else if (this.giftHasAllFollowingInSequence(element.followingTouches)) {
      //     stats.donorTypes[element.source.donorType] += 1;
      //     stats.hasFollowing += 1;
      //     stats.totalRevenueOnlyFollowing += element.giftRevenue;
      //     stats.totalDateDiff += element.dateDiff;
      //     found.push(element);
      //   } else {
      //     stats.selectedNotFollowing += 1;
      //   }
      // }

      if (element.length >= this.state.sequence.length) {
        var result = this.giftHasAllInSequence(element);
        if (result.hasSeq) {
          stats.totalCount += 1;
          stats.totalRevenue += parseInt(element[0].gift_revenue, 10);
          stats.dateDiffs.push(parseInt(element[0].date_diff, 10));
          stats.totalDateDiff += parseInt(element[0].date_diff, 10);

          stats.totalLifetimeGiftCount += element[0].num_of_gifts;
          stats.totalLifetimeRevenue += element[0].cumulative_giving;

          let rev = parseInt(element[0].gift_revenue, 10);
          let count = Math.floor(rev / stats.bucketSize);

          if (stats.bucketCounts[count] !== undefined) {
            stats.bucketCounts[count] += 1;
          } else {
            stats.bucketCounts[count] = 1;
          }

          stats.predict.actions.push(
            this.determineNextActionEffect(element, stats, result.indexOfLast)
          );
        }
      }
    });

    this.calculateEffect(stats);

    console.log(stats);

    return stats;
  }

  onFilterChange = () => {
    this.props.reload();
  };

  onChange(sequence) {
    // console.log(sequence);
    this.setState({ sequence });
  }

  giftHasAllInSequence(giftTouches) {
    let hasSeq = true;
    let alreadyComparedLast = false;
    let indexOfLast = -1;

    this.state.sequence.forEach(element => {
      for (let i = indexOfLast + 1; i < giftTouches.length; i += 1) {
        if (giftTouches[i].source === element) {
          indexOfLast = i;
          break;
        }
        indexOfLast = i;
      }

      if (indexOfLast === giftTouches.length - 1) {
        if (element !== giftTouches[indexOfLast].source && hasSeq) {
          hasSeq = false;
        } else if (
          element === giftTouches[indexOfLast].source &&
          !alreadyComparedLast
        ) {
          alreadyComparedLast = true;
        } else if (
          element === giftTouches[indexOfLast].source &&
          alreadyComparedLast
        ) {
          hasSeq = false;
        }
      }
    });

    return { hasSeq, indexOfLast };
  }

  determineNextActionEffect = (element, stats, last) => {
    if (last + 2 > element.length) {
      return;
    } else {
      last += 1;

      let localTouches = [];
      for (; last < element.length; last++) {
        localTouches.push(element[last]);
      }

      let touchCount = {};

      localTouches.forEach(elem => {
        if (touchCount[elem.source] !== undefined) {
          touchCount[elem.source] += 1;
        } else {
          touchCount[elem.source] = 1;
        }
      });

      for (let i = 0; i < util.possibleSources.length; i++) {
        if (touchCount[util.possibleSources[i]]) {
          touchCount[util.possibleSources[i]] *=
            util.weights[util.possibleSources[i]];
        }
      }

      return {
        gift_revenue: parseFloat(element[0].gift_revenue),
        lifetime_count: element[0].num_of_gifts,
        lifetime_value: element[0].cumulative_giving,
        sources: touchCount
      };
    }
  };

  calculateEffect = stats => {
    let actions = stats.predict.actions;

    let avgSingleRevenue = stats.totalRevenue / stats.totalCount;
    let singleCount = stats.totalCount;
    let avgLifetimeRevenue = stats.totalLifetimeRevenue / stats.totalCount;
    let avgLifetimeCount = stats.totalLifetimeGiftCount / stats.totalCount;

    let validActionCount = 0;
    let sourceWeightTotals = {};
    let sourceAppearances = {};
    let weightedGiftValues = {};
    let weightedLifetimeValues = {};
    let weightedLifetimeGiftCounts = {};

    actions.forEach((element, index) => {
      if (element !== undefined) {
        validActionCount += 1;

        util.possibleSources.forEach(elem => {
          if (element.sources[elem]) {
            if (sourceWeightTotals[elem]) {
              sourceWeightTotals[elem] += element.sources[elem];
            } else {
              sourceWeightTotals[elem] = element.sources[elem];
            }

            if (sourceAppearances[elem]) {
              sourceAppearances[elem] += 1;
            } else {
              sourceAppearances[elem] = 1;
            }

            if (weightedGiftValues[elem]) {
              weightedGiftValues[elem] += element.gift_revenue;
            } else {
              weightedGiftValues[elem] = element.gift_revenue;
            }

            if (weightedLifetimeValues[elem]) {
              weightedLifetimeValues[elem] += element.lifetime_value;
            } else {
              weightedLifetimeValues[elem] = element.lifetime_value;
            }

            if (weightedLifetimeGiftCounts[elem]) {
              weightedLifetimeGiftCounts[elem] += element.lifetime_count;
            } else {
              weightedLifetimeGiftCounts[elem] = element.lifetime_count;
            }
          }
        });
      }
    });

    let maxMinGiftValues = [Number.MIN_VALUE, Number.MAX_VALUE];
    let maxMinGiftCount = [Number.MIN_VALUE, Number.MAX_VALUE];
    let maxMinLifetimeCount = [Number.MIN_VALUE, Number.MAX_VALUE];
    let maxMinLifetimeValues = [Number.MIN_VALUE, Number.MAX_VALUE];

    util.possibleSources.forEach(sourceName => {
      if (sourceWeightTotals[sourceName]) {
        weightedGiftValues[sourceName] *=
          sourceWeightTotals[sourceName] / sourceAppearances[sourceName];
        maxMinGiftValues[0] =
          maxMinGiftValues[0] < weightedGiftValues[sourceName]
            ? weightedGiftValues[sourceName]
            : maxMinGiftValues[0];
        maxMinGiftValues[1] =
          maxMinGiftValues[1] > weightedGiftValues[sourceName]
            ? weightedGiftValues[sourceName]
            : maxMinGiftValues[1];
        weightedLifetimeGiftCounts[sourceName] *=
          sourceWeightTotals[sourceName] / sourceAppearances[sourceName];
        maxMinLifetimeCount[0] =
          maxMinLifetimeCount[0] < weightedLifetimeGiftCounts[sourceName]
            ? weightedLifetimeGiftCounts[sourceName]
            : maxMinLifetimeCount[0];
        maxMinLifetimeCount[1] =
          maxMinLifetimeCount[1] > weightedLifetimeGiftCounts[sourceName]
            ? weightedLifetimeGiftCounts[sourceName]
            : maxMinLifetimeCount[1];
        weightedLifetimeValues[sourceName] *=
          sourceWeightTotals[sourceName] / sourceAppearances[sourceName];
        maxMinLifetimeValues[0] =
          maxMinLifetimeValues[0] < weightedLifetimeValues[sourceName]
            ? weightedLifetimeValues[sourceName]
            : maxMinLifetimeValues[0];
        maxMinLifetimeValues[1] =
          maxMinLifetimeValues[1] > weightedLifetimeValues[sourceName]
            ? weightedLifetimeValues[sourceName]
            : maxMinLifetimeValues[1];
        maxMinGiftCount[0] =
          maxMinGiftCount[0] < sourceAppearances[sourceName]
            ? sourceAppearances[sourceName]
            : maxMinGiftCount[0];
        maxMinGiftCount[1] =
          maxMinGiftCount[1] > sourceAppearances[sourceName]
            ? sourceAppearances[sourceName]
            : maxMinGiftCount[1];
      }
    });

    util.possibleSources.forEach(sourceName => {
      if (sourceWeightTotals[sourceName]) {
        stats.predict.effect.push([
          sourceName,
          util
            .normalizeValue(
              weightedGiftValues[sourceName],
              maxMinGiftValues[0],
              maxMinGiftValues[1]
            )
            .toFixed(3),
          util
            .normalizeValue(
              sourceAppearances[sourceName],
              maxMinGiftCount[0],
              maxMinGiftCount[1]
            )
            .toFixed(3),
          util
            .normalizeValue(
              weightedLifetimeValues[sourceName],
              maxMinLifetimeValues[0],
              maxMinLifetimeValues[1]
            )
            .toFixed(3),
          util
            .normalizeValue(
              weightedLifetimeGiftCounts[sourceName],
              maxMinLifetimeCount[0],
              maxMinLifetimeCount[1]
            )
            .toFixed(3)
        ]);
      }
    });
    console.log(sourceAppearances);
    console.log(weightedGiftValues);
    console.log(weightedLifetimeGiftCounts);
    console.log(weightedLifetimeValues);
    console.log(validActionCount);
  };

  generateTableData = (stats) => {
    let data = {};
    let labels = [];
    let dataset = {};
    let options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    };

    let length = stats.bucketCounts.length;
    let datapoints = new Array(length).fill(0);

    stats.bucketCounts.forEach((element, index) => {
      datapoints[index] = element;
    });

    for (let i = 0; i < length; i++) {
      labels[i] = `$${i * stats.bucketSize} - $${((i + 1) * stats.bucketSize - 1)}`;
    }


    dataset.data = datapoints;
    dataset.label = "Gift Count";

    data.data = {};
    data.data.datasets = [dataset];
    data.data.labels = labels;
    data.options = options;
    data.type = 'bar';

    return data;
  }

  render() {
    let statContainer = "";

    // console.log(this.state);

    if (this.state.sequence.length > 0) {
      const stats = this.calculateStats();

      const graphData = this.generateTableData(stats);

      console.log(graphData);

      const donorTypeData = [
        ["First-Time", stats.donorTypes["First-Time"]],
        ["Multi-Year", stats.donorTypes["Multi-Year"]],
        ["Reactivated", stats.donorTypes["Reactivated"]],
        ["Lapsed", stats.donorTypes["Lapsed"]]
      ];
      // console.log(stats);
      statContainer = (
        <div className="stats">
          <Header subhead text="Insights" />
          <SingleStat
            icon="fa-gift"
            stat={stats.totalCount.toLocaleString()}
            name="Gifts with this sequence"
            color="blue"
          />
          <SingleStat
            icon="fa-dollar-sign"
            stat={util.statPrint(
              stats.totalRevenue / stats.totalCount,
              "dollar"
            )}
            name="Average Revenue from this sequence"
            color="green"
          />
          <SingleStat
            icon="fa-calendar"
            stat={(stats.totalDateDiff / stats.totalCount).toFixed(0)}
            name="Average days to convert of gifts containing this sequence"
            color="orange"
          />
          {/* <Table
            title="Donor Split"
            description="See how the gift count is split among the status of givers at the end of 2018"
            headers={["Donor type", "Gifts with sequence count"]}
            data={donorTypeData}
            color="purple"
          /> */}
          <br />
          <SimpleGraph 
            type={graphData.type}
            data={graphData.data}
            options={graphData.options}
            color="green"
            id="2"
          />
          <Table
            title="Next Action Effect"
            description="See how your next action could affect constituent giving"
            headers={[
              "Action",
              "Net Single Gift Revenue",
              "Net Gift Count",
              "Net Lifetime Giving",
              "Net Lifetime Count"
            ]}
            data={stats.predict.effect}
            color="red"
          />
        </div>
      );
    }

    return (
      <div className="container">
        <Header
          text="Marketing Mix Analysis"
          onFilterChange={this.onFilterChange}
          setDateRange={this.props.setDateRange}
        />
        <SequenceBuilder
          title="Make Mix to Analyze"
          options={data.possibleTouches}
          onChange={this.onChange}
        />
        {statContainer}
      </div>
    );
  }
}
