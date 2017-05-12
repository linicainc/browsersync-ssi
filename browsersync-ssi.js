module.exports = function browserSyncSSI(opt) {

  'use strict';

  var ssi = require('ssi');
  var path = require('path');
  var fs = require('fs');
  var url = require('url');

  var opt = opt || {};
  var ext = opt.ext || '.shtml';
  var baseDir = opt.baseDir || __dirname;
  var matcher = opt.matcher || '/**/*' + ext;
  var loosenedSpace = opt.loosenedSpace;
  var bsURL;

  var parser = new ssi(baseDir, baseDir, matcher, loosenedSpace);

  return function(req, res, next) {

    var pathname = url.parse(req.originalUrl || req.url).pathname;
    var filename = path.join(baseDir, pathname.substr(-1) === '/' ? pathname + 'index' + ext : pathname);

    if (filename.indexOf(ext) > -1 && fs.existsSync(filename)) {

      var contents = parser.parse(filename, fs.readFileSync(filename, {
        encoding: 'utf8'
      })).contents;

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(contents);

    } else {
      next();
    }

  };
};
