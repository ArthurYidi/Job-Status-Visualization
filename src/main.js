// material design lite
// export required since library doesn't support es6 modules
import 'material-design-icons/iconfont/material-icons.css';
import './styles/main.scss';
import mdl from 'exports?componentHandler!material-design-lite/material.js';

import * as d3 from 'd3';

import datafile from './data.json';
import main from './templates/main.ejs';

var mainHTML = main({
  navigation: [
    {
      title: 'Jyve Dashboard',
      icon: 'home'
    },
    {
      title: 'Messages',
      icon: 'inbox'
    },
    {
      title: 'Updates',
      icon: 'flag'
    }
  ]
});

document.body.innerHTML = mainHTML;

d3.json(datafile, (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
});