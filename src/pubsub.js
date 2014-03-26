/**
 * very simple pub-sub structure. Based on PubSubJS by @mroderick (https://github.com/mroderick/PubSubJS) 
 */

var PubSub = {};
var messages = {};
var lastUID = 0;

/**
 *  
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
 *  @param: message
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
 *  Calls asynchronically all registered functions for given message
 *  @param: message 
 *  @return: boolean (true = success, false = fail)
 */
PubSub.trigger = function(message){
	var params = Array.prototype.slice.call(arguments, 1);
		
	if(!this.hasSubscribers(message)){
		return false;
	}
	var list = messages[message];
	for(var uuid in list){
		if(list.hasOwnProperty(uuid)){
			var func = list[uuid];
			setTimeout(func.call(func, params), 0);
		}
	}
	return true;
};