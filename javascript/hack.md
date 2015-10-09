### 简单快速的解析url
```javascript
var parser = document.createElement('a');
parser.href = "http://example.com:3000/pathname/?search=test#hash";
parser.protocol; // => "http:"
parser.hostname; // => "example.com"
parser.port;     // => "3000"
parser.pathname; // => "/pathname/"
parser.search;   // => "?search=test"
parser.hash;     // => "#hash"
parser.host;     // => "example.com:3000"

// 也可以使用正则, 不过先应当保证url是合法的
var urlReg = /^(\w+):\/\/([^/]+)(\/[^?]*)?(\?[^#]*)?(#.*)?$/;
var matches = urlReg.exec(url);
// matches[1] protocol
// matches[2] host (include port)
// matches[3] path
// matches[4] query
// matches[5] hash
// 
// undefined shows when without that part
```