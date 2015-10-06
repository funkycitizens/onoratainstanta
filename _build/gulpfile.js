var fs = require('fs')
var gulp = require('gulp')
var d3 = require('d3')
var Handlebars = require('handlebars')

function template(name) {
  return Handlebars.compile(fs.readFileSync(name, {encoding: 'utf-8'}))
}

function instanta(row_2013, row_2014, type, contact, people) {
  var m = row_2013.cod.match(/^(Judecatoria|Tribunalul|CurteadeApel)(.*)$/)
  var filename = '../_instante/' + type + '/' + m[2].toLowerCase() + '.html'
  var html = template('instanta.html')({
    type: type,
    meta: row_2013,
    indici: {
      2013: row_2013,
      2014: row_2014,
    },
    people_json: JSON.stringify(people.map(function(p) {
      return p.Prenume + ' ' + p.Nume
    })),
    contact: contact,
  })
  fs.writeFileSync(filename, html)
}

function parchet(row, type) {
  var code = row.name.replace(/[ -]/g, '').toLowerCase()
  var filename = '../_parchete/' + type + '/' + code + '.html'
  var html = template('parchet.html')({
    type: type,
    meta: {nume: row.name.trim()},
    indici_2014: row,
  })
  fs.writeFileSync(filename, html)
}

function table(name, skip1) {
  var data = fs.readFileSync('tables/' + name + '.tsv', 'utf-8')
  return d3.tsv.parse(data)
}

function by_code(rows) {
  var rv = {}
  rows.forEach(function(row) {
    rv[row.cod] = row
  })
  return rv
}

gulp.task('data', function() {
  var people = {}
  table('oameni').forEach(function(row) {
    var code = row.Instanta
    ;(people[code] = people[code] || []).push(row)
  })
  var contact = {
    judecatorii: by_code(table('judecatorii-instante-contact')),
    tribunale: by_code(table('tribunale-instante-contact')),
    curtideapel: by_code(table('curtideapel-instante-contact')),
  }
  var data_2014 = {
    judecatorii: by_code(table('judecatorii-instante-2014').slice(1)),
    tribunale: by_code(table('tribunale-instante-2014').slice(1)),
    curtideapel: by_code(table('curtideapel-instante-2014').slice(1)),
  }
  table('judecatorii-instante-2013').slice(1).forEach(function(row) {
    var row_2014 = data_2014.judecatorii[row.cod]
    var row_contact = contact.judecatorii[row.cod]
    var people_list = people[row.cod] || []
    instanta(row, row_2014, 'judecatorii', row_contact, people_list)
  })
  table('tribunale-instante-2013').slice(1).forEach(function(row) {
    var row_2014 = data_2014.tribunale[row.cod]
    var row_contact = contact.tribunale[row.cod]
    var people_list = people[row.cod] || []
    instanta(row, row_2014, 'tribunale', row_contact, people_list)
  })
  table('curtideapel-instante-2013').slice(1).forEach(function(row) {
    var row_2014 = data_2014.curtideapel[row.cod]
    var row_contact = contact.curtideapel[row.cod]
    var people_list = people[row.cod] || []
    instanta(row, row_2014, 'curtideapel', row_contact, people_list)
  })
  table('judecatorii-parchete-2014').slice(1).forEach(function(row) {
    parchet(row, 'judecatorii')
  })
  table('tribunale-parchete-2014').slice(1).forEach(function(row) {
    parchet(row, 'tribunale')
  })
  table('curtideapel-parchete-2014').slice(1).forEach(function(row) {
    parchet(row, 'curtideapel')
  })
  table('speciale-parchete-2014').slice(1).forEach(function(row) {
    parchet(row, 'speciale')
  })
})
