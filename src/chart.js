import * as d3 from 'd3';
import {
  interpolateReds
} from 'd3-scale-chromatic';
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

    d3.json(datafile, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      for (var task of data) {
        task.finish_before = moment(task.finish_before);
        task.start_after = moment(task.start_after);
      }

      this.initializeChart(data);
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

        let date = status.values[dateIndex].key;
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

    this.data = this._rawData.filter(v => {
      return ((v.finish_before > startTime) && (v.start_after < endTime));
    });

    var store_names = new Set();
    var clients = new Set();
    var statusCount = new Map();

    for (var task of this.data) {
      store_names.add(task.store_name);
      clients.add(task.client);

      let count = 1;
      if (statusCount.has(task.status)) {
        count = statusCount.get(task.status) + 1;
      }

      task.statusCountId = count;
      statusCount.set(task.status, count);
    }

    this._nestedData = d3.nest()
      .key((d) => d.status)
      .key((d) => d.start_after.unix())
      .entries(this.data);

    // console.log(this._nestedData);
    // console.log(this._statusCount);
    // console.log(statusCount);
    // var statusCount = Object.assign({}, Object.from());

    this._statusCount = statusCount;
    this._statuses = Array.from(statusCount.keys());

    // TODO update filters model
    // this.filters.clients = clients;
  }

  initializeChart(data) {
    this._rawData = data;

    this.applyFilters();

    this.chart = d3.select(this.root)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'timeChart');

    this.update();
  }
}