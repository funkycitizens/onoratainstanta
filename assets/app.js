const col = {
  name: 'Denumirea instantei in clar (cu diactritice)',
  code: 'Codul informatic al instantei (din portal)',
  population: 'Populația',
  judges: 'Numar de judecatori',
  //x: 'Stoc (total volum de activitate al instantei)',
  //x: 'Dosare solutionate',
  //x: 'Operativitate (procent solutionate din stoc)',
  //x: 'Incarcatura pe schema',
  //x: 'Incarcatura pe judecator',
  //x: 'Indice de atacabilitate (procent atacate din solutionate)',
  //x: 'Indice de casare/desfiintare',
  //x: 'Indicator de "siguranta" (100%-Desfiintare*Atacare)',
  //x: 'Durata in zile',
  //x: 'Performanta pentru gogoasa',
  //x: 'Operativitatea relativa',
  //x: 'Incarcatura relativa',
  //x: 'Siguranta relativa',
}

const judeteUrl = 'https://dl.dropboxusercontent.com/u/103063/static/MapData/judete.topojson'
const width = 960
const height = 400
const fixchar = {'ş': 'ș', 'ţ': 'ț', '-': ' '}

function norm(txt) {
  return txt.toLowerCase().replace(/./g, (ch) => fixchar[ch] || ch)
}

var projection = d3.geo.mercator()
var path = d3.geo.path()
    .projection(projection)

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')

d3.csv('data/instante-2013.csv', (data) => {
  let label = {}
  for(let row of data) {
    let name = row[col.name]
    let m = name.match(/^Tribunalul (.*)$/)
    if(m) {
      label[norm(m[1])] = row[col.population]
    }
  }

  d3.csv('map/judete.csv', (data) => {
    let nameMap = {}
    for(let row of data) {
      nameMap[row.SIRUTA] = row.NAME_UTF8
    }

    d3.json('map/judete.topojson', (error, res) => {
      let layer = topojson.feature(res, res.objects.judete)
      let [[bx0, by0], [bx1, by1]] = d3.geo.bounds(layer)
      projection.center([(bx1+bx0)/2, (by1+by0)/2 - .8])

      let [px0, py0] = projection.invert([0, height])
      let [px1, py1] = projection.invert([width, 0])
      let s = d3.min([(px1-px0)/(bx1-bx0), (py1-py0)/(by1-by0)])
      projection.scale(s * projection.scale())

      svg.selectAll('.county')
          .data(layer.features)
        .enter().append('path')
          .attr('class', 'county')
          .attr('d', path)
        .append('title')
          .text((d) => nameMap[d.properties.id])

      function mid(feature) {
        return projection(d3.geo.centroid(feature.geometry))
      }

      svg.selectAll('.county-label')
          .data(layer.features)
        .enter().append('text')
          .attr('class', 'county-label')
          .attr('x', (d) => mid(d)[0])
          .attr('y', (d) => mid(d)[1] + 5)
          .text((d) => label[norm(nameMap[d.properties.id])])
    })
  })
})
