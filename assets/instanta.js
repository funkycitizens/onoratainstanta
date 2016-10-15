function instanta_charts(indici) {

var charts = d3.selectAll('.chart')
    .each(function() {
      var year = this.dataset.year
      perfChart(d3.select(this), year, indici[year])
    })
}

function perfChart(container, year, yearData) {

var percentage = yearData.performanta
var performance = +percentage.match(/[\d\.]+/) / 100
var data = [{performance: performance}]

//container.append('p')
//    .text('Performanță ' + Math.round(performance * 100) + '%')

var radius = 60

var π = Math.PI
var arc = d3.arc()
    .startAngle(-π/2)
    .endAngle(function(d) { return -π/2 + π * d.performance })
    .innerRadius(radius * .6)
    .outerRadius(radius)

var svg = container.append('svg')
    .attr('width', radius * 2).attr('height', radius)
  .append('g')
    .attr('transform', 'translate('+radius+','+radius+')')

svg.append('g').selectAll('path')
    .data(data).enter()
  .append('path')
    .attr('d', arc)
    .attr('fill', '#edac56')

}
