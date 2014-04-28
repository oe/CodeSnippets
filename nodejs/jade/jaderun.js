
// on windows NODE_PATH should be added to system environment
// the value maybe C:\Users\Lidequan\AppData\Roaming\npm\node_modules 

var fs = require('fs'),
  path = require("path"),
  jade = require('jade'),
  // html 输出路径
  optPath = '';

main();

function travelJadesInDir (dir,callback) {
  fs.readdir(dir, function (err,files) {
    var count = 0;
    if (err) {
      console.log('read file error: ' + err.message);
    } else {
      files.filter(function(i) {
        // just deal with jade file and file name not start with _
        return i.search(/\.jade$/) > 0 && i.split(path.sep).pop().search(/^_/) === -1;
      }).forEach(function (file,key) {
        var filePath = path.join(dir,file),
          stat = fs.statSync(filePath);
        ++count;
        
        if (stat.isFile()) {
          callback(filePath);
        } else if(stat.isDirectory()) {
          console.log('directory: ' + filePath + ' was ignored.');
          // traveldir(filePath, callback);
        } else {
          console.log('unknow file type:' + filePath);
        }
      });

      if (!count) {
        console.log('No Jade file need to be proccess.\n');
      } else {
        console.log(count + ' Jade files has been processed.\n');
      }
    }
  });
}

function writeFile (fname, content) {
  fname = (fname + '').replace(/\.$/,'');
  if (fname.search(/\.html$/) === -1) {
    fname += '.html';
  }
  fname = path.join(optPath, fname);
  fs.writeFile( fname, content, 'utf8', function(err){
    if(err) {
      console.log(err.message);
      return;
    }
    console.log('----- *' + fname + '*');
  });
}

/*
json file format
1. genertate multi file
{
  "_multi": true,
  "data": [
    {
      "_fname": "abc.html",
      ....
    },
    {
      "_fname": "uio.html",
      ....
    }
  ]
}

2. generate single file
{
  "_fname": "uio.html",
  ....
}*/

function renderJade (file) {
  var jadeStr, compileFn, html, fname,
    index = 1,
    configs = file.replace(/\.jade$/,'.json');
  try {
    if (fs.existsSync(configs)) {
      configs = require(configs);
      jadeStr = fs.readFileSync(file);
      compileFn = jade.compile(jadeStr, {filename:'relative',pretty: true});
      if (configs._multi) {
        configs.data.forEach(function (config) {
          var fname = config._fname ||
                path.basename(file,'.jade') + (index++);

          writeFile(fname, compileFn(config));
        });
      } else {
        fname = configs._fname || path.basename(file,'.jade');
        writeFile(fname, compileFn(config));
      }
    } else {
      writeFile(path.basename(file,'.jade'), jade.renderFile(file, {filename:'relative',pretty: true}));
    }
  } catch (e) {
    console.log('error with file: ' + file + ' , message is: ' + e.message);
  }
}

function main () {
  var args = process.argv.slice(2),
    dir = args[0];
  optPath = args[1];

  if (dir === '/?' || dir === '-help') {
    help();
    return;
  }
  if ( !dir ) {
    dir = path.dirname(__filename);
  }
  if(!fs.existsSync(dir)) {
    console.log('Jade Path *' + dir + '* does not exists!\n');
    help();
    return;
  }
  dir = path.resolve(dir);
  optPath = optPath || dir;
  optPath = path.resolve(optPath);

  console.log('Jade Path:   ' + dir);
  console.log('Output Path: ' + optPath);
   console.log('');
  travelJadesInDir(dir, renderJade);
}

function help () {
  console.log('Usage of jade compile runner script');
  console.log('\t-- by Saiya @version 0.1\n');
  console.log('Commandline:');
  console.log('shell <jade path> <output path>');
  console.log('        <dirpath> is dir that contain jade files, default is current dir.');
  console.log('        <output path> is where html file output.');
}