import * as d3 from 'd3';
import datafile from './data.json';
import moment from 'moment/moment.js';

export default class Chart {
  constructor(filters) {
    this.filters = filters;

    var store_names = new Set();
    var clients = new Set();
    var status = new Set();

    this.filters.startTime = moment();

    d3.json(datafile, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      for (var task of data) {
        store_names.add(task.store_name);
        clients.add(task.client);
        status.add(task.status);
      }

      const startTime = filters.startTime;
      const endTime = filters.endTime;

      var filter = data.filter(v => {
        let maxTime = moment(v.finish_before);
        let minTime = moment(v.start_after);
        if ((maxTime > startTime) && (maxTime < endTime))
          return true;
        else if ((minTime > startTime) && (minTime < endTime))
          return true;
      });

      // console.log(data);
      console.log(filter);

      console.log(store_names);
      console.log(clients);
      console.log(status);
    });
  }
}