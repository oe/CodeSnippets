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