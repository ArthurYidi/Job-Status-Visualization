import Chart from './chart.js';

import * as fields from './fields.js';
import dashboard from './templates/dashboard.ejs';
import moment from 'moment/moment.js';

// MODEL
class Filters {
  constructor() {
    this.now = moment('2016-11-01T14:30:00');
    this.nowDayStart = moment(this.now).startOf('day');

    this._maxTime = moment('2016-12-30T07:00:00.000Z');
    this._minTime = moment('2016-06-01T07:30:00.000Z');
    this._startTime = moment(this.nowDayStart).subtract(1, 'days');
    this._endTime = moment(this.nowDayStart).add(6, 'days');
    this._clients = ['All Clients'];
    this._client = 0;
    this._store = 0;
    this._stores = ['All Stores'];
    this._summary = {};

    this._events = {
      'update:time': [],
      'update:client': [],
      'update:store': [],
      'update:clientList': [],
      'update:storeList': [],
      'update:summary': []
    };
  }

  register(callback, ...events) {
    for (var event of events) {
      this._events[event].push(callback);
    }
  }

  sendUpdate(event) {
    let callbacks = this._events[event];
    for (var callback of callbacks) {
      callback();
    }
  }

  set startTime(time) {
    this._startTime = time;
    this.sendUpdate('update:time');
  }

  get startTime() {
    return this._startTime;
  }

  set endTime(time) {
    this._endTime = time;
    this.sendUpdate('update:time');
  }

  get endTime() {
    return this._endTime;
  }

  set clientList(clients) {
    const previousValue = this._clients[this._client];

    this._clients = clients.slice(0);
    this._clients.unshift('All Clients');

    this._client = Math.max(0, this._clients.indexOf(previousValue));
    this.sendUpdate('update:clientList');
  }

  get clientList() {
    return this._clients;
  }

  set storeList(stores) {
    const previousValue = this._stores[this._store];

    this._stores = stores.slice(0);
    this._stores.unshift('All Stores');

    this._store = Math.max(0, this._stores.indexOf(previousValue));
    this.sendUpdate('update:storeList');
  }

  get storeList() {
    return this._stores;
  }

  set client(c) {
    this._client = c;
    this.sendUpdate('update:client');
  }

  get client() {
    return this._client;
  }

  set store(s) {
    this._store = s;
    this.sendUpdate('update:store');
  }

  get store() {
    return this._store;
  }

  set summary(s) {
    this._summary = s;
    this.sendUpdate('update:summary');
  }

  get summary() {
    return this._summary;
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
    this.filters = new Filters();

    this.filterFields = [
      new fields.TimeField(this, {
        name: 'Start Time',
        id: 'filter-start-time',
        value: () => this.filters.startTime,
        model: (t) => this.filters.startTime = t,
        icon: 'access_time'
      }),
      new fields.TimeField(this, {
        name: 'End Time',
        id: 'filter-end-time',
        value: () => this.filters.endTime,
        model: (t) => this.filters.endTime = t,
        icon: 'access_time'
      }),
      new fields.SelectField(this, {
        name: 'Client',
        id: 'filter-client',
        value: () => this.filters.client,
        model: (c) => this.filters.client = c,
        selectList: () => this.filters.clientList,
        updateOn: ['update:clientList'],
        icon: 'business',
      }),
      new fields.SelectField(this, {
        name: 'Store',
        id: 'filter-store',
        value: () => this.filters.store,
        model: (s) => this.filters.store = s,
        selectList: () => this.filters.storeList,
        updateOn: ['update:storeList'],
        icon: 'store'
      })
    ];

    this.summaryFields = [
      new fields.SummaryField(this, {
        name: 'Unclaimed Tasks',
        id: 'summary-tasksUnclaimed',
        value: () => this.filters.summary.unclaimed,
        updateOn: ['update:summary']
      }),
      new fields.SummaryField(this, {
        name: 'In Progress Tasks',
        id: 'summary-tasksInProgress',
        value: () => this.filters.summary.in_progress,
        updateOn: ['update:summary']
      }),
      new fields.SummaryField(this, {
        name: 'Claimed Tasks',
        id: 'summary-tasksClaimed',
        value: () => this.filters.summary.claimed,
        updateOn: ['update:summary']
      }),
      new fields.SummaryField(this, {
        name: 'Completed Tasks',
        id: 'summary-tasksCompleted',
        value: () => this.filters.summary.completed,
        updateOn: ['update:summary']
      }),
      new fields.SummaryField(this, {
        name: 'Expired Tasks',
        id: 'summary-tasksExpired',
        value: () => this.filters.summary.expired,
        updateOn: ['update:summary']
      }),
      new fields.SummaryField(this, {
        name: 'Total Number of Tasks',
        id: 'summary-tasks',
        value: () => this.filters.summary.tasks,
        updateOn: ['update:summary']
      })
    ];

    this.allFields = this.filterFields.concat(this.summaryFields);
  }

  initialize() {
    for (let field of this.allFields) {
      field.initialize();
    }

    for (let field of this.allFields) {
      this.filters.register(
        () => field.update(),
        ...field.updateOn
      );
    }

    this.chart = new Chart(this.filters);

    this.filters.register(
      () => this.chart.update(),
      'update:time',
      'update:client',
      'update:store'
    );
  }

  html() {
    return dashboard({
      filterFields: this.filterFields,
      summaryFields: this.summaryFields
    });
  }
}