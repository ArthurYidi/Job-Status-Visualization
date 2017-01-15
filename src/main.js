import './sass/main.scss';
import datafile from './data.json';
import * as d3 from 'd3';

d3.json(datafile, (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  
  console.log(data);
});