import * as d3 from 'd3';
import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import _ from 'lodash';

const Chart = () => {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 800 - (margin.left + margin.right);
  const height = 400 - (margin.top + margin.bottom);
  const data = [
    {
    "date": "20140101",
    "count": 18
    },
    {
    "date": "20140116",
    "count": 26
    },
    {
    "date": "20140201",
    "count": 27
    },
    {
    "date": "20140216",
    "count": 14
    },
    {
    "date": "20140301",
    "count": 23
    },
    {
    "date": "20140316",
    "count": 14
    },
    {
    "date": "20140401",
    "count": 26
    },
    {
    "date": "20140416",
    "count": 34
    },
    {
    "date": "20140501",
    "count": 27
    },
    {
    "date": "20140516",
    "count": 23
    },
    {
    "date": "20140601",
    "count": 14
    },
    {
    "date": "20140616",
    "count": 28
    },
    {
    "date": "20140701",
    "count": 33
    },
    {
    "date": "20140716",
    "count": 33
    },
    {
    "date": "20140801",
    "count": 17
    },
    {
    "date": "20140816",
    "count": 14
    },
    {
    "date": "20140901",
    "count": 29
    },
    {
    "date": "20140916",
    "count": 28
    }
  ];

  // TODO - chart subscription
  // this.lsClient.subscribe(
  //   ['CHART:FM.D.GBPJPY24.GBPJPY24.IP:TICK'],
  //   ['BID', 'UTM'],
  //   'DISTINCT',
  //   (itemUpdate) => {
  //     const [,epic] = itemUpdate.getItemName().split(':');
  //     let updates = {};
  //
  //     itemUpdate.forEachChangedField((fid, pos, value) => {
  //       updates[fid] = value;
  //     });
  //
  //     console.log(updates);
  //   }
  // );

  data.forEach(function (d) {
    d.date = d3.timeParse("%Y%m%d")(d.date);
  });

  const dates = _.map(data, 'date');
  const counts = _.map(data, 'count');

const node = ReactFauxDOM.createElement('svg');
  const el = d3.select(node)
  //  .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('data', data)
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .attr('data', null);

  const xScale = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(dates))

  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(counts));

  const yAxis = d3.axisRight()
    .scale(yScale)
    .tickSize(-width, 0, 0);

  const xAxis = d3.axisBottom()
    .scale(xScale)

  el.append('g')
    .attr('className', 'sparkline')
  	.attr('transform', 'translate(' + width + ', 0)')
  	.call(yAxis)


  el.append('g')
    .attr('className', 'sparkline')
    .attr('transform', 'translate(0, '+ (height) + ')')
    .call(xAxis);

  const line = d3.line()
    .x(function (d) {
      return xScale(d.date);
    })
    .y(function (d) {
      return yScale(d.count);
    });

  el.append('g')
    .append('path')
    .datum(data)
    .attr('className', 'sparkline')
    .attr('d', line);

  return node.toReact()
}

export default Chart;
