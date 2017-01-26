import * as d3 from 'd3';
import { interpolateReds } from 'd3-scale-chromatic';
import datafile from './data.json';
import moment from 'moment/moment.js';

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  width = 1200 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

export default class Chart {
  constructor(filters) {
    this.filters = filters;
    this.root = document.getElementById('chart');

    this.chart = d3.select(this.root)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'timeChart');

    d3.json(datafile, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      for (var task of data) {
        task.finish_before = moment(task.finish_before);
        task.start_after = moment(task.start_after);
      }

      this._rawData = data;
      this.update();
    });
  }

  // this definitely not how you should update a chart
  update() {
    this.applyFilters();

    let chart = this.chart;

    this.chart.selectAll('*').remove();

    var xScale = d3.scaleTime()
      .domain([this.filters.startTime, this.filters.endTime])
      .range([0, width]);

    var yScale = d3.scaleBand()
      .domain(this._statuses)
      .range([0, height])
      .paddingInner(0.2)
      .paddingOuter(0.05);

    var main = chart.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'main');

    // status dividers
    main.append('g')
      .selectAll('.laneLines')
      .data(this._statuses)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => {
        return yScale(d);
      })
      .attr('width', width)
      .attr('height', (d) => {
        return yScale.bandwidth();
      })
      .attr('class', 'laneLine');

    var ticks = xScale.ticks();
    ticks.shift();
    ticks.pop();
    main.append('g')
      .selectAll('.grid')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'grid')
      .attr('y1', (d) => {
        return 0;
      })
      .attr('y2', (d) => {
        return height;
      })
      .attr('x1', (d) => {
        return xScale(d);
      })
      .attr('x2', (d) => {
        return xScale(d);
      });

    main.append('g')
      .selectAll('.now')
      .data([this.filters.now])
      .enter()
      .append('line')
      .attr('class', 'nowLine')
      .attr('y1', (d) => {
        return 0;
      })
      .attr('y2', (d) => {
        return height;
      })
      .attr('x1', (d) => {
        return xScale(d);
      })
      .attr('x2', (d) => {
        return xScale(d);
      });

    main.append('g')
      .selectAll('.now')
      .data([this.filters.now])
      .enter()
      .append('text')
      .text('Today')
      .attr('x', (d) => xScale(d))
      .attr('y', -10)
      .attr('dy', '-1.0ex')
      .attr('text-anchor', 'middle')
      .attr('class', 'numberTasks');

    var maxNumGroups = d3.max(this._nestedData, (d) => {
      return d3.max(d.values, (d) => {
        return d.values.length;
      });
    });

    var lineHeightScale = d3.scaleLinear()
      .domain([1, maxNumGroups])
      .range([2, 20]);

    var opacityScale = d3.scaleLinear()
      .domain([1, maxNumGroups])
      .range([0.3, 0.8]);

    for (var status of this._nestedData) {
      var numGroups = status.values.length;

      for (var dateIndex in status.values) {

        let tasks = status.values[dateIndex].values;
        let numTasks = tasks.length;
        let paddingTop = 13;
        main.append('g')
          .selectAll('.tasks')
          .data(tasks)
          .enter()
          .append('rect')
          .attr('id', (d) => {
            return 'task-' + d.status + '-' + d.statusCountId;
          })
          .attr('class', (d) => {
            return 'task-rect';
          })
          .attr('x', (d) => {
            return xScale(d.start_after);
          })
          .attr('y', (d, i) => {
            let y = yScale(d.status);

            // pre-generate scales
            var statusScale = d3.scaleLinear()
              .domain([0, numGroups])
              .range([y + paddingTop, y + yScale.bandwidth()]);
            return statusScale(dateIndex) + (lineHeightScale(numTasks) / 2);
          })
          .attr('width', (d) => {
            let start = xScale(d.start_after);
            let end = xScale(d.finish_before);
            return end - start;
          })
          .attr('height', (d) => {
            return lineHeightScale(numTasks);

          }).attr('fill', (d) => {
            return interpolateReds(opacityScale(numTasks));
          });

        main.append('g')
          .selectAll('.tasks-end')
          .data(tasks)
          .enter()
          .append('rect')
          .attr('class', (d) => {
            return 'task-rect-end';
          })
          .attr('x', (d) => {
            return xScale(d.finish_before);
          })
          .attr('y', (d, i) => {
            let y = yScale(d.status);

            // pre-generate scales
            var statusScale = d3.scaleLinear()
              .domain([0, numGroups])
              .range([y + paddingTop, y + yScale.bandwidth()]);
            return statusScale(dateIndex) + (lineHeightScale(numTasks) / 2) - 5; //- lineHeightScale(numTasks);
          })
          .attr('width', (d) => {
            // let start = xScale(d.start_after);
            // let end = xScale(d.finish_before);
            return 1;
          })
          .attr('height', (d) => {
            return 5;

          })
          .attr('fill', (d) => {
            return 'black';
            // return interpolateReds(opacityScale(numTasks));
          });

        main.append('g')
          .selectAll('.numberTasks')
          .data([tasks[0]])
          .enter()
          .append('text')
          .text(function(d) {
            return numTasks;
          })
          .attr('x', (d) => {
            return Math.max(0, xScale(d.start_after));
          })
          .attr('y', (d) => {
            let y = yScale(d.status);

            // pre-generate scales
            var statusScale = d3.scaleLinear()
              .domain([0, numGroups])
              .range([y + paddingTop, y + yScale.bandwidth()]);
            return statusScale(dateIndex) + (lineHeightScale(numTasks) / 2);
          })
          .attr('dy', '-.5ex')
          .attr('text-anchor', 'bottom')
          .attr('class', 'numberTasks');

      }
    }

    var displayLabel = {
      'completed': 'Completed',
      'unclaimed': 'Unclaimed',
      'claimed': 'Claimed',
      'in_progress': 'In Progress',
      'expired': 'Expired',
      'urgent': 'urgent'
    };

    main.append('g')
      .selectAll('.statusLabels')
      .data(this._statuses)
      .enter()
      .append('text')
      .text(function(d) {
        return displayLabel[d];
      })
      .attr('x', 0)
      .attr('y', function(d, i) {
        return yScale(d) - 10;
      })
      .attr('dy', '.5ex')
      .attr('text-anchor', 'right')
      .attr('class', 'laneText');

    // Add the x Axis
    main.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale));
  }

  applyFilters() {
    const startTime = this.filters.startTime;
    const endTime = this.filters.endTime;

    if ((this._startTime !== startTime) || (this._endTime !== endTime)) {
      this._startTime = startTime;
      this._endTime = endTime;

      this._dataTimeFiltered = this._rawData.filter(v => {
        return ((v.finish_before > startTime) && (v.start_after < endTime));
      });

      this._nestedDataClient = d3.nest()
        .key((d) => d.client)
        .key((d) => d.store_name)
        .rollup((d) => d.length)
        .map(this._dataTimeFiltered);

      this.filters.clientList = this._nestedDataClient.keys();
      let stores = [];
      this._nestedDataClient.each((d) => stores = stores.concat(d.keys()));
      this._allStores = d3.set(stores).values();
    }

    const client = this.filters.clientList[this.filters.client];

    if (this.filters.client == 0) {
      this.filters.storeList = this._allStores;
    } else {
      this.filters.storeList = this._nestedDataClient.get(client).keys();
    }

    const store = this.filters.storeList[this.filters.store];

    this.data = this._dataTimeFiltered.filter((v) => {
      const isClient = (this.filters.client === 0) ? true : (v.client === client);
      const isStore = (this.filters.store === 0) ? true : (v.store_name === store);
      return isClient && isStore;
    });

    // group by date and status

    this._nestedData = d3.nest()
      .key((d) => d.status)
      .key((d) => d.start_after.unix())
      .entries(this.data);

    this._statuses = this._nestedData.map((v) => v.key);

    // summary

    let statusLengths = this._nestedData.map((v) => {
      let item = {};
      item['status'] = v.key;
      item['length'] = d3.sum(v.values, (d) => d.values.length);
      return item;
    });

    let summary = d3.nest()
      .key((d) => d.status)
      .rollup((d) => d[0].length)
      .object(statusLengths);

    summary['tasks'] = d3.sum(Object.values(summary));
    this.filters.summary = summary;
  }
}