// missing mdl components
import 'mdl-select-component/src/selectfield/selectfield.js';
import mdDateTimePicker from 'md-date-time-picker/dist/js/mdDateTimePicker.js';

import selectField from './templates/selectField.ejs';
import selectTime from './templates/selectTime.ejs';
import summaryField from './templates/summaryField.ejs';

class Field {
  constructor(dashboard, props) {
    this.dashboard = dashboard;

    this.name = props.name;
    this.id = props.id;
    this.value = props.value;
    this.template = props.template;
    this.icon = props.icon;
    this.model = props.model;
    this.updateOn = props.updateOn || [];

    this.dom = null;
  }
  initialize() {}
  update() {}
}

export class SummaryField extends Field {
  constructor(dashboard, props) {
    super(dashboard, props);
    this.template = summaryField;
  }

  initialize() {
    this.dom = document.getElementById(this.id);
  }

  update() {
    let value = this.value();
    this.dom.textContent = Number.isInteger(value) ? value.toString() : '0';
  }
}

export class SelectField extends Field {
  constructor(dashboard, props) {
    super(dashboard, props);
    this.template = selectField;
    this.selectList = props.selectList;
  }

  initialize() {
    this.dom = document.getElementById(this.id);
    
    this.dom.onchange = () => {
      this.model(parseInt(this.dom.value));
    };
  }

  update() {
    this.dom.innerHTML = ''; 
    this.selectList().forEach((text, i) => {
      var option = document.createElement('option');
      option.text = text;
      option.value = i;
      this.dom.add(option);
    });

    this.dom.value = this.value();

    // Temporary hack for mdl selectfields (blur doesn't work)
    let mdlfield = document.getElementsByClassName('mdl-selectfield');
    for (let field of mdlfield) {
      field.classList.remove('is-focused');
    } 
  }
}

export class TimeField extends Field {
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