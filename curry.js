/*
keyCode
Windows:
	Escape 27; Tab 9; CapsLock 20; Shift 16; Ctrl 17;
	Alt 18; Win 91;Enter 13; Backspace 8; Delete 46;
Mac:Escape 27; Tab 9; CapsLock 20; Shift 16; Ctrl 17;
	Alt 18; CMD 91;Enter 13; No Backspace; Delete 8;

*/


/*Make a function step by step
 *	function add(a,b){return a + b};
 *	//add5 is a function like add but with an argument 5
 *	var add5 = curry(add,5);
 *	add5(2); //get 7
 *	add(4); //get 9
 *just make an function partialApply
 **/

function curry (fn) {
	var slice = Array.prototype.slice,
		storeArgs = slice.call(arguments, 1);
	return function  () {
		var newArgs = slice.call(arguments),
			args = storeArgs.concat(newArgs);
		return fn.apply(null,args);
	}
}



//---------------------------------------------------
/* a perfect inherit demo
 this code shows how to inherit better
*/
function Parent () {
	// body...
}
function Child () {
	Parent.apply(this,arguments);
}
function inherit (Child, Parent) {
	// create a temp function
	var F = function(){};
	F.prototype = Parent.prototype;
	//inherit prototype from temp function
	//seperate Child & Parent proto relation
	Child.prototype = new F();
	// Save prototype of parent
	Child.uber = Parent.prototype;
	// reset constructor of Child
	Child.prototype.constructor = Child;
}



//-------------------------------------------------------

// Deep copy

// copy property from parent to child
function extendDeep (parent, child) {
	var i,
		toStr = Object.prototype.toString,
		astr = '[object Array]';
	child = child || {};
	if (parent) {
		for (i in parent) {
			if (parent.hasOwnProperty(i)) {
				if (parent[i] && typeof p[i] === 'object') {
					child[i] = toStr.call(parent[i]) === astr ? [] : {};
					extendDeep(parent[i],child[i]);
				} else {
					child[i] = parent[i];
				}
			}
		}
	}
	return child;
}
//HTML encode & decode
function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
}

function htmlDecode( html ) {
    var a = document.createElement( 'a' ); a.innerHTML = html;
    return ('textContent' in a) ? a.textContent : a.innerText;
}

//forward html event
$(".box").click(function(){
     $(this).toggleClass("highlight");
});


function passThrough(e) {
    $(".box").each(function() {
       // check if clicked point (taken from event) is inside element
       var mouseX = e.pageX;
       var mouseY = e.pageY;
       var offset = $(this).offset();
       var width = $(this).width();
       var height = $(this).height();

       if (mouseX > offset.left && mouseX < offset.left+width 
           && mouseY > offset.top && mouseY < offset.top+height)
         $(this).click(); // force click event
    });
}

$("#shield").click(passThrough);

var dthen = new Date();
		
setInterval(function(){
	dNow = new Date();
	$('#shield').css('height', ((dNow.getSeconds()+(dNow.getMilliseconds()/1000))*50)%300 +'px');
},10)

var doPassThrough = true;
$('input').click(function(){
  doPassThrough =  !doPassThrough;
  if (doPassThrough){
    $("#shield").click(passThrough);
  } else {
    $('#shield').unbind('click', passThrough);
  }
});