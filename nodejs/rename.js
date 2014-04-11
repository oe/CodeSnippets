var path = require("path"),
  fs = require("fs"),
  scriptName = path.basename(__filename);

main();

//travel directory
function traveldir (dir,callback) {
  fs.readdir(dir, function (err,files) {
    if (err) {
      console.log('read file error: ' + err.message);
    } else {
      files.sort(function(a, b) {
        return a < b ? -1 : 1;
      }).forEach(function (file,key) {
        var filePath = path.join(dir,file),
          stat = fs.statSync(filePath);
        if (stat.isFile()) {
          callback(filePath);
        } else if(stat.isDirectory()) {
          traveldir(filePath, callback);
        } else {
          console.log('unknow file type:' + filePath);
        }
      });
    }
  });
}
//rename file name to lower case
function rename2LowerCase (filePath) {
  var fileName = path.basename(filePath),
    dirName = path.dirname(filePath),
    newPath;
  if (fileName !== scriptName && !fileName.match(/^\./)) {
    newPath = dirName + path.sep + fileName.toLowerCase();
    console.log('rename from ' + filePath + ' to ' + newPath);
    fs.rename(filePath, newPath);
  }
}
//remove some string in file name
function renameRemove (filePath, str, lowCase) {
  var fileName = path.basename(filePath),
    extName = path.extname(filePath),
    dirName = path.dirname(filePath),
    newPath;
  
  if (fileName !== scriptName && !fileName.match(/^\./)) {
    fileName = fileName.split('.');
    if (fileName.length > 1) {
      fileName.pop();
    }
    // fileName without ext
    fileName = fileName.join('.');
    fileName = fileName.replace(str,'') + extName;
    newPath = dirName + path.sep + fileName.replace(str,'') + extName;
    if (lowCase) {
      fileName = fileName.toLowerCase();
    }
    newPath = dirName + path.sep + fileName;
    console.log('rename from ' + filePath + ' to ' + newPath);
    fs.rename(filePath, newPath);
  }
}
// rename file name to progressive number
function rename2ProgressiveNum (filePath, lowCase) {
  var extName = path.extname(filePath),
      dirName = path.dirname(filePath),
      newPath; 
  if (fileName !== scriptName && !fileName.match(/^\./)) {
    newPath = (rename2ProgressiveNum.NumIndex ++ ) + '' + extName;
    if (lowCase) {
      newPath = newPath.toLowerCase;
    }
    newPath = dirName + path.sep + newPath;
    console.log('rename from ' + filePath + ' to ' + newPath);
    fs.rename(filePath, newPath);
  }
}
// main
function main () {
  var args = process.argv.slice(2),
    dir = args[0],
    type = args[1],
    param = args[2],
    lowCase;
  if ( !dir || !fs.existsSync(dir)) {
    param = type;
    type = dir;
    dir = path.dirname(__filename);
  }
  if (fs.statSync(dir).isFile()) {
    dir = path.dirname(dir);
  }
  console.log('dir is ' + path.resolve(dir));
  if (type && type.match(/^-/)) {
    if (type.match(/r/i)) {
      if (param !== undefined) {
        lowCase = !!type.match(/l/i);
        traveldir(dir,function (filePath) {
          renameRemove(filePath, param, lowCase);
        });
      } else {
        console.log('string that to be removed is required');
        help();
      }
    } else if (type.match(/l/i)) {
      traveldir(dir,rename2LowerCase);
    } else if(type.match(/i/i)){
      if (param !== undefined && isNaN(+param)) {
        help();
      } else {
        if (param === undefined) {
          param = 1;
        } else {
          param = +param;
        }
        rename2ProgressiveNum.NumIndex = param;

        lowCase = !!type.match(/l/i);
        traveldir(dir,function (filePath) {
          rename2ProgressiveNum(filePath, param, lowCase);
        });
      }
    } else {
      help();
    }
  } else {
    help();
  }
}
//help content
function help () {
  console.log('Usage of rename script');
  console.log('\t-- by Saiya @version 0.1\n');
  console.log('    shell <dirpath> [options] string');
  console.log('        <dirpath> is dir that to be renamed, optional, default is current dir');
  console.log('        string is extra param');
  console.log('Options:');
  console.log('    -r (remove string in file name)');
  console.log('       string is the string to be removed, required');
  console.log('    -i (rename file name to  progressive numbers');
  console.log('        param string is the start index of the number, optional, default is 1');
  console.log('    -l (rename to lowcase)');
  console.log('        could be used with -r or -i, such as -rl or -il');
}
