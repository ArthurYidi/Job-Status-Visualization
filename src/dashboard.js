import Chart from './chart.js';

import dashboard from './templates/dashboard.ejs';
import selectField from './templates/selectField.ejs';
import selectTime from './templates/selectTime.ejs';

// missing mdl components
import 'mdl-select-component/src/selectfield/selectfield.js';
import moment from 'moment/moment.js';
import mdDateTimePicker from 'md-date-time-picker/dist/js/mdDateTimePicker.js';

const now = moment('2016-11-01T14:30:00');
const nowDayStart = moment(now).startOf('day');

// simple model that's in charge of updating components.
const filters = {
  now: now,
  _maxTime: moment('2016-12-30T07:00:00.000Z'),
  _minTime: moment('2016-06-01T07:30:00.000Z'),
  _startTime: moment(nowDayStart).subtract(1, 'days'),
  _endTime: moment(nowDayStart).add(6, 'days'),

  set startTime(time) {
    // setting the startTime should update components
  },
  get startTime() {
    return this._startTime;
  },

  set endTime(time) {

  },
  get endTime() {
    return this._endTime;
  },

  set client(c) {

  },

  set store(s) {

  },
  set maxTime(time) {}, // TODO
  get maxTime() {
    return this._maxTime;
  },
  set minTime(time) {}, // TODO
  get minTime() {
    return this._minTime;
  }
};


// include initialize and update
const filterFields = [{
  props: {
    name: 'Start Time',
    id: 'filter-start-time',
    value: filters.startTime.format('LL'),
  },
  field: selectTime,
  icon: 'access_time'
}, {
  props: {
    name: 'End Time',
    id: 'filter-end-time',
    value: filters.endTime.format('LL'),
  },
  field: selectTime,
  icon: 'access_time'
}, {
  props: {
    name: 'Client',
    id: 'filter-client',
    value: 0,
    values: ['All Clients'],
  },
  field: selectField,
  icon: 'business'
}, {
  props: {
    name: 'Store',
    id: 'filter-store',
    value: 0,
    values: ['All Stores'],
  },
  field: selectField,
  icon: 'store'
}];

const summaryFields = [{}];

export default class Dashboard {
  constructor() {
    const el = document.querySelector('#filter-start-time');

    el.addEventListener('onOk', (e) => {
      e.target.value = this.timePicker.time.format('LL');
    });

    el.onfocus = (e) => {
      this.timePicker = new mdDateTimePicker({
        type: 'date',
        init: filters.startTime,
        past: filters.minTime,
        future: filters.maxTime
      });
      this.timePicker.trigger = e.target;
      this.timePicker.toggle();
    };

    this.chart = new Chart(filters);
  }

  static html() {
    return dashboard({
      filterFields: filterFields,
      summaryFields: summaryFields
    });
  }
}