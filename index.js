var fs = require('fs');
var _ = require('lodash');
var slugify = require('slugify')

var md = require( "markdown" ).markdown;
var raw = fs.readFileSync(__dirname + '/patterns.md', 'utf8');

function getData(str) {
  var questionsArray = str.split('------------\n');
  var headings = [];
  var heading = '';

  var originMdTree = md.parse(str);
  _.each(originMdTree, function(section) {
    if (section[0] && section[0] === 'header') {
      heading = section[2];
      fileName = slugify(heading).toLowerCase();
      headings.push({
        name: heading,
        fileName: fileName,
        path: 'patterns/' + fileName + '.md'
      })
    }
  });

  for(var index in questionsArray) {
    if (index === 0) {
      return;
    }

    var question = questionsArray[index];

    if(!!headings[index - 1]) {
      var fileName = headings[index - 1].fileName;

      if(headings[index]) {
        question = question.replace(headings[index - 1].name, '');
      }

      if (!!fileName) {
        fs.writeFileSync(__dirname + '/patterns/' + fileName + '.md', question);
      }
    }
  }

  fs.writeFileSync(__dirname + '/api.json', JSON.stringify(headings));
}

var result = getData(raw);

