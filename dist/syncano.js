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
 * Register specified function as a callback for given message
 * @param {string} message - message identifier
 * @param {function} callback - function to call when message is triggered
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
 * Does message have subscribers?
 * @param {string} message - message identifier
 * @return: boolean
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
 * Remove specified function callback. If no func is given, removes all callbacks for given message
 * @param {string} message - message identifier
 * @param {function} func - function to remove
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
 * Calls asynchronically all registered functions for given message. Shortcut method for doTrigger(message, false)
 * @param {string} message - message identifier
 * @return: boolean (true = success, false = fail)
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
	var list, uuid, func;
	var called = false;

	var params = Array.prototype.slice.call(arguments, 2)[0];
	if(this.hasSubscribers(message)){
		list = messages[message];
		for(uuid in list){
			if(list.hasOwnProperty(uuid)){
				func = list[uuid];
				if(sync === false){
					setTimeout(func.call(func, params), 0);
				} else {
					func.call(func, params);
				}
				called = true;
			}
		}
	}
	/**
	 *  trigger event for 'all'. Send original message name as the first parameter
	 */
	var allMessage = 'all';
	if(this.hasSubscribers(allMessage)){
		list = messages[allMessage];
		for(uuid in list){
			if(list.hasOwnProperty(uuid)){
				func = list[uuid];
				if(sync === false){
					setTimeout(func.call(func, message, params), 0);
				} else {
					func.call(func, message, params);
				}
				called = true;
			}
		}
	}

	return called;
};

/**
 *  
 */
var states = {
	DISCONNECTED: 1,
	CONNECTED: 2,
	AUTHORIZED: 3
};


/**
 * @constructor 
 */
var Syncano = function(){
	// TODO: in final version change url
	this.socketURL = 'https://api.hydraengine.com/ws';
	this.socket = null;
	this.status = states.DISCONNECTED;
	this.requestId = 1;
	this.uuid = null;
	
	/**
	 *  queue for messages which could not be sent because of no connection 
	 */
	this.requestsQueue = [];
	
	/**
	 *  in this list we will keep arrays of [action, callback] for every sent message, so we will be able to run callback function
	 *  when answer to message arrives. The list is indexed with message_id attribute
	 */
	this.waitingForResponse = {};
};


/**
 *  add PubSub mixin
 */
Syncano.prototype = extend(Syncano.prototype, PubSub);


/**
 *  @param {object} params - {instance, api_key, optional timezone}
 */
Syncano.prototype.connect = function(params){
	if(typeof params.api_key === 'undefined' || typeof params.instance === 'undefined'){
		throw new Error('syncano.connect requires instance name and api_key');
	}
	if(typeof root.SockJS === 'undefined'){
		throw new Error('SockJS is required');
	}
	this.connectionParams = params;
	this.socket = new root.SockJS(this.socketURL);
	this.socket.onopen = this.onSocketOpen.bind(this);
	this.socket.onclose = this.onSocketClose.bind(this);
	this.socket.onmessage = this.onMessage.bind(this);
};


/**
 *  Immediately after opening socket, send auth request
 */
Syncano.prototype.onSocketOpen = function(){
	this.status = states.CONNECTED;
	this.sendAuthRequest();
};


/**
 *  
 */
Syncano.prototype.onSocketClose = function(){
	this.status = states.DISCONNECTED;
	this.socket = null;
};


/**
 *  Method called every time the message is received. Message is passed as e.data
 *  If there was an error, e.data.result is 'NOK' (not ok), otherwise e.data has response data.
 */
Syncano.prototype.onMessage = function(e){
	var data = JSON.parse(e.data);
	
	if(data.result === 'NOK'){
		this.trigger('syncano:error', data.error);
	} else {
		this.trigger('syncano:received', data);
	}
	
	switch(data.type){
		case 'auth':
			this.parseAuthorizationResponse(data);
			break;
			
		case 'callresponse':
			this.parseCallResponse(data);
			break;
	}
};


/**
 *  After successful authorization trigger event and send all queued messages
 */
Syncano.prototype.parseAuthorizationResponse = function(data){
	this.uuid = data.uuid;
	this.status = states.AUTHORIZED;
	this.trigger('syncano:authorized', this.uuid);
	this.sendQueue();
};


/**
 *  Receiven new callresponse message. If we were waiting for this response, handle it (call callback, etc). Otherwise - ignore
 *  @param {object} data - data received
 */
Syncano.prototype.parseCallResponse = function(data){
	var messageId = data.message_id;
	if(typeof messageId !== 'undefined' && typeof this.waitingForResponse[messageId] !== 'undefined'){
		var rec = this.waitingForResponse[messageId];
		var actionType = rec[0].replace('.', ':');
		var callback = rec[1];
		this.trigger('syncano:' + actionType, data.data);
		if(typeof callback === 'function'){
			callback(data.data);
		}
		delete this.waitingForResponse[messageId];
	} else {
		this.trigger('syncano:ignored', data);
	}
};


/**
 *  Sends all requests waiting in the queue
 */
Syncano.prototype.sendQueue = function(){
	while(this.requestsQueue.length > 0){
		var request = this.requestsQueue.shift();
		this.socketSend(request);
	}
};


/**
 *  Generated unique message id
 */
Syncano.prototype.getNextRequestId = function(){
	return this.requestId++;
};


/**
 *  Sends request as a string. Internal low-level function, should not be used outside
 *  @param {object} request
 */
Syncano.prototype.socketSend = function(request){
	this.socket.send(JSON.stringify(request) + "\n");
};


/**
 *  Universal high-level function for sending requests to syncano.
 */
Syncano.prototype.sendRequest = function(method, params, callback){
	if(typeof params === 'undefined'){
		params = {};
	}
	
	var request = {
		type: 'call',
		method: method,
		params: params
	};
	
	request.message_id = this.getNextRequestId();

	/**
	 *  Remember method and callback on the waitingForResponse list. When the response comes, callback will be called
	 */
	this.waitingForResponse[request.message_id] = [method, callback];
	
	/**
	 *  Send message to socket if already open and authorized. Otherwise - push to requestsQueue
	 */
	if(this.status == states.AUTHORIZED){
		this.trigger('syncano:call', request);
		this.socketSend(request);
	} else {
		this.trigger('syncano:queued', request);
		this.requestsQueue.push(request);
	}
};


/**
 *  sendAuthRequest has to be the first request sent to socket. Contains instance, api_key and optional timezone
 */
Syncano.prototype.sendAuthRequest = function(){
	this.socketSend(this.connectionParams);
};


var instance = null;


/**
 * Export to the root, which is probably `window`. 
 */
root.SyncanoConnector = {
	getInstance: function(){
		if(instance === null){
			instance = new Syncano();
		}
		return instance;
	}
};


}(this));
