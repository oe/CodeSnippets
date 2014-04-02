var path = require("path"),
	fs = require("fs"),
	rootPath = __filename,
	scriptName = path.basename(__filename);

renameFilesInDir(path.dirname(rootPath));

function changeFileName(filepath){
	fs.stat(filepath,function(err,stats){
		if(stats.isFile()){
			var filename = path.basename(filepath),
				parentDir =path.dirname(filepath),
				newName,newPath;
			//console.log(thisFilename);
			//这个if就是进行更改文件名的逻辑,可以自行定义,这里定义为将文件命名为当前文件夹的名字加"-文件自身名"
			if( filename != scriptName ){
				newName = filename.replace('幻灯片','').toLowerCase();
				newPath = parentDir + path.sep + newName;
				console.log("going to rename from "+filepath+" to "+newPath);
				fs.rename(filepath,newPath);
			}
		}
		else if(stats.isDirectory()){
			console.log("============["+filepath+"] isDir===========");
			renameFilesInDir(filepath);
		}else{
		console.log("unknow type of file");
		}
	});
}

function renameFilesInDir(dir){
	fs.readdir(dir,function(error,files){
		files.sort(function(a, b) {
			return a < b ? -1 : 1;
		}).forEach(function(file, key) {
			changeFileName(dir+"\\"+file);
		});
	});
}