var fs = require('fs'),
  path = require("path"),
  jade = require('jade');
  // scriptName = path.dirname(__filename);

function travelJadesInDir (dir,callback) {
  fs.readdir(dir, function (err,files) {
    if (err) {
      console.log('read file error: ' + err.message);
    } else {
      files.filter(function(i) {
        return i.search(/\.jade$/) > 0 ;
      }).forEach(function (file,key) {
        var filePath = path.join(dir,file),
          stat = fs.statSync(filePath);
        if (stat.isFile()) {
          callback(filePath);
        } else if(stat.isDirectory()) {
          console.log('directory: ' + filePath + ' was ignored.');
          // traveldir(filePath, callback);
        } else {
          console.log('unknow file type:' + filePath);
        }
      });
    }
  });
}

function renderJade (file) {
  var jadeStr, compileFn, html, optName,
    index = 1,
    configs = file.replace(/\.jade$/,'.json');

  try {
    if (fs.existsSync(configs)) {
      configs = require(configs);
      jadeStr = fs.readFileSync(file);
      compileFn = jade.compile('string of jade', {pretty: true});
      if (configs._multi) {
        configs.data.forEach(function (config) {
          var optName = config._fname + '' ||
                path.basename(file,'.jade') + (index++) + '.html',
            html = compileFn(config);
          if (optName.search(/\.html$/) === -1) {
            optName += '.html';
          }
          fs.appendFile( optName, html,'utf8', function(err){
            if(err) console.log(err.message);
          });
        });
      } else {
        html = compileFn(configs);
        optName = configs._fname || path.basename(file,'.jade') + '.html';
        if (optName.search(/\.html$/) === -1) {
          optName += '.html';
        }
        fs.appendFile( optName, html,'utf8', function(err){
          if(err) console.log(err.message);
        });
      }
    } else {
      html = jade.renderFile(file, {pretty: true});
      // writeFile
      optName = path.basename(file,'.jade') + '.html';
      if (optName.search(/\.html$/) === -1) {
        optName += '.html';
      }
      fs.appendFile( optName ,html,'utf8',function(err){
        if(err) console.log(err.message);
      });
    }
  } catch (e) {
    console.log('error with file: ' + file + ' , message is: ' + e.message);
  }
}

function main () {
  var args = process.argv.slice(2),
    dir = args[0];
  if ( !dir || !fs.existsSync(dir)) {
    dir = path.dirname(__filename);
  }
  travelJadesInDir(dir, renderJade);
}