// material design lite
import 'material-design-icons/iconfont/material-icons.css';
import 'md-date-time-picker/dist/css/mdDateTimePicker.min.css';
import 'mdl-select-component/mdl-selectfield.min.css';
import './styles/main.scss';
// export required since library doesn't support es6 modules
import mdl from 'exports?componentHandler!material-design-lite/material.js';

import Dashboard from './dashboard.js';
import main from './templates/main.ejs';

var dashboard;

function init() {
  const navigation = [{
    title: 'Jyve Dashboard',
    icon: 'home'
  }, {
    title: 'Messages',
    icon: 'inbox'
  }, {
    title: 'Updates',
    icon: 'flag'
  }];
  
  dashboard = new Dashboard();
  // render html
  document.body.innerHTML = main({
    navigation: navigation,
    dashboard: dashboard.html()
  });

  dashboard.initialize();
}

init();