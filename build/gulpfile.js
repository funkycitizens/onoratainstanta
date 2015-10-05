var fs = require('fs')
var gulp = require('gulp')
var d3 = require('d3')
var Handlebars = require('handlebars')

function template(name) {
  return Handlebars.compile(fs.readFileSync(name, {encoding: 'utf-8'}))
}

function instanta(row, folder) {
  var m = row.cod.match(/^(Judecatoria|Tribunalul|CurteaDeApel)(.*)$/)
  var filename = '../_instante/' + folder + '/' + m[2].toLowerCase() + '.html'
  var html = template('instanta.html')({
    meta: row,
    indici_2013: row,
  })
  fs.writeFileSync(filename, html)
}

function table(name) {
  var data = fs.readFileSync('tables/' + name + '.tsv', 'utf-8')
  return d3.tsv.parse(data).slice(1)
}

gulp.task('instante', function() {
  table('judecatorii-2013').forEach(function(row) {
    instanta(row, 'judecatorii')
  })
})
