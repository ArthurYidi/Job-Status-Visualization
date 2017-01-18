import Chart from './chart.js';

import dashboard from './templates/dashboard.ejs';
import selectField from './templates/selectField.ejs';
import selectTime from './templates/selectTime.ejs';

// missing mdl components
import 'mdl-select-component/src/selectfield/selectfield.js';
import moment from 'moment/moment.js';
import mdDateTimePicker from 'md-date-time-picker/dist/js/mdDateTimePicker.js';

class Field {
  constructor(dashboard, props) {
    this.dashboard = dashboard;

    this.name = props.name;
    this.id = props.id;
    this.value = props.value;
    this.template = props.template;
    this.icon = props.icon;
    this.model = props.model;

    this.dom = null;
  }
  initialize() {}
  update() {}
}

class SelectField extends Field {
  constructor(dashboard, props) {
    super(dashboard, props);
    this.template = selectField;
    this.selectList = props.selectList;
  }
}

class TimeField extends Field {
  constructor(dashboard, props) {
    super(dashboard, props);
    this.template = selectTime;
  }

  initialize() {
    this.dom = document.getElementById(this.id);

    this.dom.addEventListener('onOk', (e) => {
      let time = e.target.timePicker.time;
      e.target.value = time.format('LL');
      this.model(time);
    });

    this.dom.onfocus = (e) => {
      e.target.timePicker = new mdDateTimePicker({
        type: 'date',
        init: this.value(),
        past: this.dashboard.filters.minTime,
        future: this.dashboard.filters.maxTime
      });
      e.target.timePicker.trigger = e.target;
      e.target.timePicker.toggle();
    };
  }
}

class Filters {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.now = moment('2016-11-01T14:30:00');
    this.nowDayStart = moment(this.now).startOf('day');
    this._maxTime = moment('2016-12-30T07:00:00.000Z');
    this._minTime = moment('2016-06-01T07:30:00.000Z');
    this._startTime = moment(this.nowDayStart).subtract(1, 'days');
    this._endTime = moment(this.nowDayStart).add(6, 'days');
  }

  set startTime(time) {
    this._startTime = time;
    this.onUpdate();
  }

  get startTime() {
    return this._startTime;
  }

  set endTime(time) {
    this._endTime = time;
    this.onUpdate();
  }

  get endTime() {
    return this._endTime;
  }

  // TODO
  set client(c) {
    this.onUpdate();
  }
  
  // TODO
  set store(s) {
    this.onUpdate();
  }

  set maxTime(time) {} // TODO

  get maxTime() {
    return this._maxTime;
  }

  set minTime(time) {} // TODO

  get minTime() {
    return this._minTime;
  }

}

export default class Dashboard {
  constructor() {
    this.filters = new Filters(() => this.onUpdate());

    this.filterFields = [
      new TimeField(this, {
        name: 'Start Time',
        id: 'filter-start-time',
        value: (t) => this.filters.startTime,
        icon: 'access_time',
        model: (t) => this.filters.startTime = t
      }),
      new TimeField(this, {
        name: 'End Time',
        id: 'filter-end-time',
        value: (t) => this.filters.endTime,
        icon: 'access_time',
        model: (t) => this.filters.endTime = t
      }),
      new SelectField(this, {
        name: 'Client',
        id: 'filter-client',
        value: 0,
        icon: 'business',
        selectList: ['All Clients'],
      }),
      new SelectField(this, {
        name: 'Store',
        id: 'filter-store',
        value: 0,
        icon: 'business',
        selectList: ['All Stores'],
      })
    ];
  }

  onUpdate() {
    this.chart.update();
  }

  initialize() {
    for (var field of this.filterFields) {
      field.initialize();
    }

    this.chart = new Chart(this.filters);
  }

  html() {
    return dashboard({
      filterFields: this.filterFields,
      summaryFields: this.summaryFields
    });
  }
}