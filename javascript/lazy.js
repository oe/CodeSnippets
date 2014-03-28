// img: img element, original: optional, the true path of the image

var loader = (function (loader) {
  function loadImg (img, original) {
    var tmpImg,
      wrapperClass = img.parentElement.classList;
    console.log('in loadImg');
    if ( wrapperClass.contains('loading') || wrapperClass.contains('loaded') ) return;
    console.log('going to load...');
    tmpImg = document.createElement('img');
    original = original || img.getAttribute('data-original');
    console.log('original ' + original);
    wrapperClass.add('loading');
    tmpImg.addEventListener('load',function (e) {
      img.src = original;
      wrapperClass.remove('loading');
      wrapperClass.add('loaded');
      tmpImg.removeEventListener('load',arguments.callee);
      tmpImg = null;
    });
    tmpImg.src = original;
  }

  function loadImgInWrapper (imgWrapper, original) {
    var img = imgWrapper.children[0],
      wrapperClass = imgWrapper.classList;
    img instanceof HTMLImageElement && !wrapperClass.contains('loading') && !wrapperClass.contains('loaded') && loadImg(img, original);
  }

  function loadImgInContext(context) {
    var wrappers;
    context = context ? context + ' .lazy-img' : '.lazy-img';
    wrappers = document.querySelectorAll(context);
    if (wrappers.length) {
      wrappers = Array.prototype.slice.call(wrappers);
      wrappers.forEach( loadImgWithWrapper );
    }
  }

  loader.loadImg = loadImg;
  loader.loadImgInWrapper = loadImgInWrapper;
  loader.loadImgInContext = loadImgInContext;

  return loader;
})(loader || {});


