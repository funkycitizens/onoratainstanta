function instanta_charts(indici) {

var charts = d3.select('#charts')
perfChart(charts.append('div'), indici)

}

function perfChart(perf, indici) {

var percentage = indici[2014].performanta
var performance = +percentage.match(/[\d\.]+/) / 100
var data = [{performance: performance}]

perf.append('p')
    .text('Performanță ' + Math.round(performance * 100) + '%')

var radius = 60

var π = Math.PI
var arc = d3.arc()
    .startAngle(-π/2)
    .endAngle(function(d) { return -π/2 + π * d.performance })
    .innerRadius(radius * .6)
    .outerRadius(radius)

var svg = perf.append('svg')
    .attr('width', radius * 2).attr('height', radius)
  .append('g')
    .attr('transform', 'translate('+radius+','+radius+')')

svg.append('g').selectAll('path')
    .data(data).enter()
  .append('path')
    .attr('d', arc)
    .attr('fill', '#edac56')

}
