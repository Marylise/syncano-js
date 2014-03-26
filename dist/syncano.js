(function(root, undefined) {

  "use strict";


/**
 * Library agnostic version of jQuery's Extend by @jonjaques 
 */

function type(obj) {
	var checker = {};
	var types = "Boolean Number String Function Array Date RegExp Object".split(" ");
	for(var i in types){
		checker[ "[object " + types[i] + "]" ] = types[i].toLowerCase();
	}
	return obj === null ?
		String( obj ) :
		checker[ Object.prototype.toString.call(obj) ] || "object";
}

function isFunction(obj) {
	return type(obj) === "function";
}

function isWindow(obj) {
	return obj !== null && obj == obj.window;
}

function isPlainObject(obj) {
	var hasOwn = Object.prototype.hasOwnProperty;
	if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
		return false;
	}
	try {
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
		}
	} catch ( e ) {
		return false;
	}
	var key;
	for ( key in obj ) {}
	return key === undefined || hasOwn.call( obj, key );
}

function isArray(obj){
	return type(obj) === "array";
}


function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
 
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		if ( (options = arguments[ i ]) !== null ) {
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				if ( target === copy ) {
					continue;
				}
				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}
					target[ name ] = extend( deep, clone, copy );
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	return target;
}

/**
 * very simple pub-sub structure. Based on PubSubJS by @mroderick (https://github.com/mroderick/PubSubJS) 
 */

var PubSub = {};
var messages = {};
var lastUID = 0;


/**
 *  Register specified function as a callback for given message
 *  @param {string} message - message identifier
 *  @param {function} callback - function to call when message is triggered
 */
PubSub.on = function(message, callback){
	if(typeof callback !== 'function'){
		return false;
	}
	
	if(!messages.hasOwnProperty(message)){
		messages[message] = {};
	}
	
	var token = 'uid_' + (++lastUID);
	messages[message][token] = callback;
	return token;
};


/**
 *  Does message have subscribers?
 *  @param {string} message - message identifier
 *  @return: boolean
 */
PubSub.hasSubscribers = function(message){
	if(typeof message !== 'string'){
		return false;
	}
	if(messages.hasOwnProperty(message) && Object.keys(messages[message]).length){
		return true;
	}
	return false;
};


/**
 *  Remove specified function callback. If no func is given, removes all callbacks for given message
 *  @param {string} message - message identifier
 *  @param {function} func - function to remove
 */
PubSub.off = function(message, func){
	if(!this.hasSubscribers(message)){
		return false;
	}
	if(typeof func === 'undefined'){
		return delete messages[message];
	}
	var list = messages[message];
	for(var uuid in list){
		if(list.hasOwnProperty(uuid)){
			if(func === list[uuid]){
				return delete messages[message][uuid];
			}
		}
	}
	return false;
};


/**
 *  Calls asynchronically all registered functions for given message. Shortcut method for doTrigger(message, false)
 *  @param {string} message - message identifier
 *  @return: boolean (true = success, false = fail)
 */
PubSub.trigger = function(message){
	return PubSub.doTrigger(message, false, Array.prototype.slice.call(arguments, 1));
};


/**
 * Calls synchronically all registered functions for given message. Shortcut method for doTrigger(message, true)
 * @param {string} message - message identifier 
 */
PubSub.triggerSync = function(message){
	return PubSub.doTrigger(message, true, Array.prototype.slice.call(arguments, 1));
};


/**
 * Calls all registered functions for given message
 * @param {string} message - message identifier
 * @param {boolean} sync - true for synchronous calls, false for asynchronous
 */
PubSub.doTrigger = function(message, sync){
	var params = Array.prototype.slice.call(arguments, 2)[0];
	if(!this.hasSubscribers(message)){
		return false;
	}
	var list = messages[message];
	for(var uuid in list){
		if(list.hasOwnProperty(uuid)){
			var func = list[uuid];
			if(sync === false){
				setTimeout(func.call(func, params), 0);
			} else {
				func.call(func, params);
			}
		}
	}
	return true;
};

/* syncano main */

// Base function.
var syncano = function() {
	// Add functionality here.
	return true;
};

syncano.prototype = extend(syncano.prototype, PubSub);

syncano.prototype.test = function(){
	console.log('test', this.hasSubscribers('message'));
};

// Version.
syncano.VERSION = '0.0.1';


// Export to the root, which is probably `window`.
root.syncano = syncano;


}(this));
