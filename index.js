var through = require('through');
var riot = require('riot');
var _ = require('lodash');
var cheerio = require('cheerio');

module.exports = function (file, o) {

  var opts = o || {};
  var ext = opts.ext || 'tag.html';
  var content = '';

  return !file.match('\.' + ext + '$') ? through() : through(write, end);

  function write(chunk) {
    content += chunk.toString();
  }

  function end() {
    try {

      var $ = cheerio.load(content, {
        xmlMode: true
      });

      var importFiles = {};

      var codeBlockList = ['var riot = require("riot");'];

      $('link[rel=import]').each(function () {
        var $self = $(this);
        var src = $self.attr('href');
        if (!importFiles[src]) {
          codeBlockList.push('require("' + src + '");')
          importFiles[src] = true;
        }
        $self.remove()
      })

      var $script = '';

      $('script').each(function (idx) {

        var $self = $(this);

        if (idx === 0) {
          $script = $self;
        }

        var src = $self.attr('src');

        if (src) {
          if (!importFiles[src]) {
            var variableName = 'tagController' + idx;
            codeBlockList.unshift('var ' + variableName + ' = require("' + src + '");');
            $self.removeAttr('src')
            $script.append(variableName + '.call(this, opts);')
            importFiles[src] = true;
          }
        } else {
          $script.append($self.text())
        }

        if (idx !== 0) {
          $self.remove();
        }

      })

      codeBlockList.push('module.exports = ' + riot.compile($.html(), opts));

      this.queue(codeBlockList.join('\n'));
      this.emit('end');
    } catch (e) {
      this.emit('error', e);
    }
  }

};
