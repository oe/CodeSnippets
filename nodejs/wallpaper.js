/**
 *
 * 自动抓取中关村壁纸上的壁纸地址(会存入 imglist.txt 中)
 * 修改 @resolution 以设置壁纸分辨率
 * 在start函数中传入壁纸分类的链接及页数(默认1页)
 *
 */

var http = require('http'),
  cheerio = require('/usr/local/lib/node_modules/cheerio'),
  fs = require('fs'),
  iconv = require('/usr/local/lib/node_modules/iconv-lite'),
  querystring = require('querystring'),
  baseUrl = 'http://desk.zol.com.cn',
  // 目标壁纸分辨率
  resolution = '1920x1080',
  buffSize = 20,
  // 缓存要写入的url
  imgUrlBuff = [];

start('http://desk.zol.com.cn/meinv/xingganmeinv/',3);

// get fromurl
function getFromUrl(url, callback){
  var html = '',
    req = http.get(url, function(res){
      res.setEncoding('binary');
      res.on('data', function(data){
        html += data;
      }).on('end', function(){
        var buf = new Buffer(html, 'binary');
            var str = iconv.decode(buf, 'gb2312');//将GBK编码的字符转换成utf8的
        callback(str);
      }).on('close', function(){
        console.log('Close received!');
      });
    });

  req.on('error', function(error){
    fs.appendFile('error.log', new Date().getTime()+' '+error+'\r\n', 'utf-8');
  });
}

// 1. ommit topage will get 1 to fromPage's wallpaper
// 2. toPage < fromPage or not a number, use 1 to fromPage
// 3. default is 1 to 1
function start (url,fromPage, toPage) {
  var i;
  if (toPage === undefined) {
    if (isNaN(fromPage) || fromPage < 1) {
      fromPage = toPage = 1;
    } else {
      toPage = + fromPage;
      fromPage = 1; 
    }
  } else {
    if (isNaN(toPage) || toPage < 1 || toPage < fromPage ) {
      if (isNaN(fromPage) || fromPage < 1) {
        fromPage = toPage = 1;
      } else {
        toPage = + fromPage;
        fromPage = 1; 
      }
    } else {
      if (isNaN(fromPage) || fromPage < 1) {
        fromPage = 1;
        toPage = + toPage;
      } else {
        fromPage = + fromPage;
        toPage = + toPage;
      }
    }
  }
  console.log( fromPage, toPage );
  i = fromPage - 1;
  while (i != toPage) {
    getAlbumInPage(url + (++i) + '.html');
  }
}

// exports.start = start;


function _getAlbumInPage (html) {
  var $ = cheerio.load(html);
  var urls = $('.pic-list2:first-of-type li a').map(function () {
    var href = $(this).attr('href');
    console.log('相册链接 ' + href );
      if (href.indexOf('http') !== 0 ) {
        return href;
      }
    }).get();
  urls.forEach(getUrlInAlbum);
}

// 获取分类下 壁纸相册(list)url
function getAlbumInPage (url) {
  getFromUrl(url,_getAlbumInPage);
}

// 获取相册(list)内 图片url
function getUrlInAlbum (url) {
  getFromUrl(baseUrl + url,function (html) {
    var $ = cheerio.load(html);
    var urls = $('#showImg li a').map(function () {
        return $(this).attr('href');
      }).get();
    _getWallpaperUrl(html);
    urls.shift();
    urls.forEach(function (el) {
      getWallpaperUrl(baseUrl + el);
    });
  });
}


// 私有
function _getWallpaperUrl (html) {
  var $ = cheerio.load(html);
  var el = $('#' + resolution),
    paperUrl = el.length ? el.attr('href') : false;
  paperUrl && getImgUrl(baseUrl + paperUrl);
}

function getWallpaperUrl (url) {
  getFromUrl(url,_getWallpaperUrl);
}

function getImgUrl (url) {
  getFromUrl(url,function (html) {
    var $ = cheerio.load(html);
    var imgUrl = $('img').attr('src');
    if (imgUrl) {
      imgUrlBuff.push( imgUrl );
      if (imgUrlBuff.length >= buffSize) {
        var data = imgUrlBuff.join('\n') + '\n';
        imgUrlBuff.length = 0;
        fs.appendFile('imglist.txt',data,'utf8',function(err){
            if(err)
            {
                console.log(err);
            }
        });
      }
    }
    // console.log('最终图片链接 ' + imgUrl);
  });
}
