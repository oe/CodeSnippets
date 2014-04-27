/* ---------------解析URL后附带的query string和hash-----------------
isHash为true时, 解析hash, 否则解析query string
 */
function parseUrl (isHash) {
  var query,
    data = {};
  if (isHash) {
    query = window.location.hash.replace(/^\#/,'');
  } else {
    query = window.location.search.replace(/^\?/,'');
  }
  if (!query) return false;
  query = query.split('&');
  query.forEach(function (ele) {
    var tmp = ele.split('=');
    data[ decodeURIComponent( tmp[0] ) ] = decodeURIComponent( tmp[1] === undefined ? '' : tmp[1] );
  });
  return data;
}

/*-----------------批量模板--------------------
var tpl = '<li data-raw={RAW_DATA}>{CustomerName}<span>{Mobile}</span></li>',
  value = [{CustomerName:'Soloui',Mobile: 12334},{CustomerName:'Olkil',Mobile: 94453}];

value可以是数组也可以是对象
 */
function applyTpl (tpl, value) {
  var str = '',
    values = Array.isArray(value) ? value : [value];
  values.forEach(function (el) {
    str += tpl.replace(/{([^}]+)}/g, function ($0, $1) {
      // if ($1 === 'RAW_DATA') {
      //  return encodeURIComponent( JSON.stringify(el) );
      // } else {
        return el[$1] == null ? '': el[$1];
      // }
    });
  });
  return str;
}

/* ----------------判断是否为汉字----------------
汉字的正则区间为 [\u4E00-\u9FA5]
 */
// 例如判断是否为中文名字
var userName = 'abc';
if (userName.match(/^[\u4E00-\u9FA5]{2,5}$/)) {
  console.log('YES');
} else {
  console.log('NO');
}

/* -----------------把对象序列化为 query string-----------------------
 */
function serialize (data) {
  var res = [],key;
  for (key in data) {
    if (data.hasOwnProperty(key)) {
      res.push( encodeURIComponent( key ) + '=' + encodeURIComponent( data[key] ));
    }
  }
  return res.join('&');
}

/*-------------------------判断对象是否为空----------------------------------*/
function isEmptyObj (obj) {
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

/* ----------- 关闭窗口--------------------- */
function close_window () {
  window.opener = null;
  window.open('','_self','');
  window.close();
}