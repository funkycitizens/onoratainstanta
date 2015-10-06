var fs = require('fs')
var gulp = require('gulp')
var d3 = require('d3')
var Handlebars = require('handlebars')

function template(name) {
  return Handlebars.compile(fs.readFileSync(name, {encoding: 'utf-8'}))
}

function instanta(row, type, contact) {
  var m = row.cod.match(/^(Judecatoria|Tribunalul|CurteadeApel)(.*)$/)
  var filename = '../_instante/' + type + '/' + m[2].toLowerCase() + '.html'
  var html = template('instanta.html')({
    type: type,
    meta: row,
    indici_2013: row,
    contact: contact,
  })
  fs.writeFileSync(filename, html)
}

function table(name, skip1) {
  var data = fs.readFileSync('tables/' + name + '.tsv', 'utf-8')
  return d3.tsv.parse(data)
}

function contacts(name) {
  var rv = {}
  table(name + '-instante-contact').forEach(function(row) {
    rv[row.cod] = row
  })
  return rv
}

gulp.task('instante', function() {
  var contact = {
    judecatorii: contacts('judecatorii'),
    tribunale: contacts('tribunale'),
    curtideapel: contacts('curtideapel'),
  }
  table('judecatorii-instante-2013').slice(1).forEach(function(row) {
    instanta(row, 'judecatorii', contact.judecatorii[row.cod])
  })
  table('tribunale-instante-2013').slice(1).forEach(function(row) {
    instanta(row, 'tribunale', contact.tribunale[row.cod])
  })
  table('curtideapel-instante-2013').slice(1).forEach(function(row) {
    instanta(row, 'curtideapel', contact.curtideapel[row.cod])
  })
})
