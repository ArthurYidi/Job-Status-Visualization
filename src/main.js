import 'material-design-icons/iconfont/material-icons.css'
import './sass/main.scss';
import 'material-design-lite/material.js';

import * as d3 from 'd3';

import datafile from './data.json';

d3.json(datafile, (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  
  console.log(data);
});