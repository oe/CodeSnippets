var path = require("path"),
	fs = require("fs"),
	// rootPath = path.dirname(__filename),
	scriptName = path.basename(__filename);

// traveldir(args[0] || rootPath, rename);

function traveldir (dir,callback) {
	fs.readdir(dir, function (err,files) {
		if (err) {
			console.log('read file error' + error.message);
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

function rename2LowerCase (filePath) {
	var fileName = path.basename(filePath),
		dirName = path.dirname(filePath),
		newPath;
	if (fileName !== scriptName) {
		newPath = dirName + path.sep + fileName.toLowerCase();
		console.log('rename from ' + filePath + ' to ' + newPath);
		fs.rename(filePath, newPath);
	}
}

function renameRemove (filePath, str, lowCase) {
	var fileName = path.basename(filePath),
		dirName = path.dirname(filePath),
		newPath;
	if (fileName !== scriptName) {
		newPath = dirName + path.sep +
			(lowCase ? fileName.replace(str,'').toLowerCase() : fileName.replace(str,''));

		console.log('rename from ' + filePath + ' to ' + newPath);
		fs.rename(filePath, newPath);
	}
}

function main () {
	var args = process.argv.slice(2),
		dir = args[0],
		type = args[1],
		param = args[2],
		tmp;
	if (dir && fs.statSync(dir).isDirectory()) {
		if (type.match(/^-/)) {
			if (type.match(/r/i)) {
				expression
			} else if (type.match(/l/i)) {
				expression
			} else {
				help();
			}
		} else {
			help();
		}
	} else {
		param = type;
		type = dir;
		dir = path.dirname(__filename);
	}
}

function help () {
	console.log('usage to do...');
}
