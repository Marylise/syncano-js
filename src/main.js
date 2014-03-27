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
var syncano = function(){
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
syncano.prototype = extend(syncano.prototype, PubSub);


/**
 *  @param {object} params - {instance, api_key, optional timezone}
 */
syncano.prototype.connect = function(params){
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
syncano.prototype.onSocketOpen = function(){
	this.status = states.CONNECTED;
	this.sendAuthRequest();
};


/**
 *  
 */
syncano.prototype.onSocketClose = function(){
	this.status = states.DISCONNECTED;
	this.socket = null;
};


/**
 *  
 */
syncano.prototype.onMessage = function(e){
	var data = JSON.parse(e.data);
	
	if(data.result === 'NOK'){
		this.trigger('syncano:error', data.error);
	} else {
		this.trigger('syncano:message', data);
	}
	
	switch(data.type){
		case 'auth':
			this.doAuthorize(data);
			break;
	}
};


/**
 *  After successful authorization trigger event and send all queued messages
 */
syncano.prototype.doAuthorize = function(data){
	this.uuid = data.uuid;
	this.status = states.AUTHORIZED;
	this.trigger('syncano:authorized', this.uuid);
	this.sendQueue();
};


/**
 *  Sends all requests waiting in the queue
 */
syncano.prototype.sendQueue = function(){
	while(this.requestsQueue.length > 0){
		var request = this.requestsQueue.shift();
		this.socketSend(request);
	}
};


/**
 *  Generated unique message id
 */
syncano.prototype.getNextRequestId = function(){
	return this.requestId++;
};


/**
 *  Sends request as a string. Internal function, should not be used outside
 */
syncano.prototype.socketSend = function(request){
	this.socket.send(JSON.stringify(request) + "\n");
};


/**
 *  sendAuthRequest has to be the first request sent to socket. Contains instance, api_key and optional timezone
 */
syncano.prototype.sendAuthRequest = function(){
	this.socketSend(this.connectionParams);
};

syncano.VERSION = '0.0.1';


/**
 * Export to the root, which is probably `window`. 
 */
root.syncano = syncano;
