/**
 *
 * 自动抓取中关村壁纸上的壁纸地址(会存入 imglist.txt 中)
 * 修改 @resolution 以设置壁纸分辨率
 * 在start函数中传入壁纸分类的链接及页数(默认1页)
 *
 */

var http = require('http'),
  cheerio = require("cheerio"),
  fs = require('fs'),
  iconv = require('iconv-lite'),
  querystring = require('querystring'),
  baseUrl = 'http://desk.zol.com.cn',
  // 目标壁纸分辨率
  resolution = '1366x768',
  buffSize = 20,
  // 缓存要写入的url
  imgUrlBuff = [];

start('http://desk.zol.com.cn/meinv/',3);

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

function start (url,pageCount) {
  var i = 1;
  pageCount = isNaN(pageCount) || pageCount < 1 ? 1 : + pageCount;
  while (pageCount--) {
    getAlbumInPage(url + (i++) + '.html');
  }
}


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
