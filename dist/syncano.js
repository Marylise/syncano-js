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
 * Methods for handling projects - creating, reading, updating, deleting 
 */
var Project = {};

	
/**
 * Create new project 
 * 
 * @method Project.new
 * @param {string} name Name of the project
 * @param {string} description Short description of the project
 * @param {function} callback Optional function to be called when successful response comes
 */
Project.new = function(name, description, callback){
	var method = 'project.new';
	this.__super__.sendRequest(method, {name: name, description: description}, function(data){
		var res = data.project;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};
	

/**
 *  Gets list of all projects in current instance
 *
 *  @method Project.get
 *  @param {function} callback Optional function to be called when successful response comes
 */
Project.get = function(callback){
	var method = 'project.get';
	this.__super__.sendRequest(method, {}, function(data){
		var res = data.project;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};

	
/**
 *  Receives detailed informations about project with given id 
 * 
 *  @method Project.getOne
 *  @param {number} id Project identifier
 *  @param {function} callback Optional function to be called when successful response comes
 */
Project.getOne = function(id, callback){
	if(typeof id !== 'number'){
		throw new Error('Project.getOne() - id must be a number');
	}
	var method = 'project.get_one';
	this.__super__.sendRequest(method, {id: id}, function(data){
		var res = data.project;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};
	

/**
 *  Updates project details (name, description)
 *
 *  @method Project.update
 *  @param {number} id Project identifier
 *  @param {string} name Optional new name of the project
 *  @param {string} name Optional new description of the project
 *  @param {function} callback Optional function to be called when successful response comes
 */
Project.update = function(id, name, description, callback){
	if(typeof id !== 'number'){
		throw new Error('Project.update() - id must be a number');
	}
	if((typeof name === 'undefined' || name === null) && (typeof description === 'undefined' || name === null)){
		return false;
	}
	var method = 'project.update';
	var params = {};
	if(name){
		params.name = name;
	}
	if(typeof description !== 'undefined' && description !== null){
		params.description = description;
	}
	this.__super__.sendRequest(method, params, function(data){
		var res = data.project;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
	return true;
};


/**
 *  Deletes project
 *
 *  @method Project.delete
 *  @param {function} callback Optional function to be called when successful response comes
 */
Project.delete = function(id, callback){
	var method = 'project.delete';
	this.__super__.sendRequest(method, {project_id: id}, function(){
		if(typeof callback === 'function'){
			callback(true);
		}
	});
};


/**
 * Methods for handling collections - creating, reading, updating, deleting 
 */
var Collection = {};


/**
 *  Create new collection within specified project
 *  
 *  @method Collection.new
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string} name New collections name
 *  @param {string} key (optional) New collections key
 *  @param {string} description (optional) New collection's description
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Collection.new = function(projectId, name, key, description, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.new - projectId must be a number');
	}
	var method = 'collection.new';
	var params = {
		name: name,
		project_id: projectId
	};
	if(typeof description !== 'undefined' && description !== null){
		params.description = description;
	}
	if(typeof key !== 'undefined' && key !== null){
		params.key = key;
	}
	this.__super__.sendRequest(method, params, function(data){
		var res = data.collection;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};


/**
 *  Get collections from specified project
 *
 * @method Collection.get
 * @param {number} projectId Project id
 * @param {string} status Status of events to list. Accepted values: active, inactive, all. Default value: all
 * @param {string/array} withTags If specified, will only list events that has specified tag(s) defined. Note: tags are case sensitive
 * @param {function} callback (optional) Function to be called when successful response comes
 */
Collection.get = function(projectId, status, withTags, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.get - projectId must be a number');
	}
	var method = 'collection.get';
	var params = {
		project_id: projectId
	};
	if(typeof status === 'undefined' || status === null){
		params.status = 'all';
	}
	
	if(typeof withTags !== 'undefined' && withTags !== null){
		params.with_tags = withTags;
	}
	this.__super__.sendRequest(method, params, function(data){
		var res = data.collection;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};


/**
 * Get one collection from specified project.
 * collection_id/collection_key parameter means that one can use either one of them - collection_id or collection_key 
 *
 * @method Collection.getOne
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {function} callback (optional) Function to be called when successful response comes
 */
Collection.getOne = function(projectId, collection, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.getOne - projectId must be a number');
	}
	
	var method = 'collection.get_one';
	var params = {
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Collection.getOne - collection key/id must be passed');
	}
	
	this.__super__.sendRequest(method, params, function(data){
		var res = data.collection;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};


/**
 * Activates specified collection 
 * 
 * @method Collection.activate
 * @param {number} projectId Project id
 * @param {number} collectionId Collection id defining collection to be activated
 * @param {boolean} force If set to True, will force the activation by deactivating all other collections that may share it's data_key.
 * @param {function} callback (optional) Function to be called when successful response comes
 */
Collection.activate = function(projectId, collectionId, force, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.activate - projectId must be a number');
	}
	
	if(typeof collectionId !== 'number'){
		throw new Error('Collection.activate - collectionId must be a number');
	}
	
	var method = 'collection.activate';
	var params = {
		project_id: projectId,
		collection_id: collectionId
	};
	
	if(typeof force === 'undefined' || force === null){
		params.force = false;
	} else {
		params.force = force;
	}
	
	this.__super__.sendRequest(method, params, function(){
		if(typeof callback === 'function'){
			callback(true);
		}
	});
};


/**
 * Deactivates specified collection
 * collection_id/collection_key parameter means that one can use either one of them - collection_id or collection_key 
 *
 * @method Collection.deactivate
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {function} callback (optional) Function to be called when successful response comes
 */
Collection.deactivate = function(projectId, collection, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.deactivate - projectId must be a number');
	}

	var method = 'collection.deactivate';
	var params = {
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Collection.deactivate - collection key/id must be passed');
	}
	
	this.__super__.sendRequest(method, params, function(){
		if(typeof callback === 'function'){
			callback(true);
		}
	});
};


/**
 * Update existing collections name and/or description
 * 
 * @method Collection.update
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {string} name (optional) New collection name
 * @param {string} description (optional) New collection description
 * @param {function} callback (optional) Function to be called when successful response comes 
 */
Collection.update = function(projectId, collection, name, description, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.update - projectId must be a number');
	}
	var method = 'collection.update';
	var params = {
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Collection.update - collection key/id must be passed');
	}
	
	if(typeof name !== 'undefined' && name !== null){
		params.name = name;
	}
	if(typeof description !== 'undefined' && description !== null){
		params.name = description;
	}
	
	this.__super__.sendRequest(method, params, function(data){
		var res = data.collection;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};


/**
 * Add a tag to specific event.
 * Note: tags are case sensitive. 
 * 
 * @method Collection.addTag
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {string / Array} tags Tag(s) to be added. Either string (one tag) or array (multiple tags)
 * @param {float} weight Tags weight. Default value = 1
 * @param {boolean} removeOther If true, will remove all other tags of specified collection. Default value: False
 * @param {function} callback (optional) Function to be called when successful response comes 
 */
Collection.addTag = function(projectId, collection, tags, weight, removeOther, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.addTag - projectId must be a number');
	}
	var method = 'collection.add_tag';
	var params = {
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Collection.addTag - collection key/id must be passed');
	}
	
	if(typeof tags !== 'string' && !(typeof tags === 'object' && typeof tags.length !== 'undefined')){
		throw new Error('Collection.addTag - tags must be passed');
	}
	
	/**
	 *  currently only ascii chars are supported
	 */
	var testTagString;
	if(typeof tags === 'string'){
		testTagString = tags;
	} else {
		testTagString = tags.join(',');
	}
	if(!/^[\000-\177]*$/.test(testTagString)){
		throw new Error('Collection.addTag - non ascii characters found in tag name');
	}
	
	params.tags = tags;

	params.weight = weight || 1;
	params.remove_other = !!removeOther || false;
	
	this.__super__.sendRequest(method, params, function(){
		if(typeof callback === 'function'){
			callback(true);
		}
	});
};


/**
 * Delete a tag or tags from specified collection.
 * Note: tags are case sensitive 
 *
 * @method Collection.deleteTag
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {string / Array} tags Tag(s) to be added. Either string (one tag) or array (multiple tags)
 * @param {function} callback (optional) Function to be called when successful response comes 
 */
Collection.deleteTag = function(projectId, collection, tags, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.deleteTag - projectId must be a number');
	}
	var method = 'collection.delete_tag';
	var params = {
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Collection.deleteTag - collection key/id must be passed');
	}
	
	if(typeof tags !== 'string' && !(typeof tags === 'object' && typeof tags.length !== 'undefined')){
		throw new Error('Collection.deleteTag - tags must be passed');
	}
	
	/**
	 *  currently only ascii chars are supported
	 */
	var testTagString;
	if(typeof tags === 'string'){
		testTagString = tags;
	} else {
		testTagString = tags.join(',');
	}
	if(!/^[\000-\177]*$/.test(testTagString)){
		throw new Error('Collection.deleteTag - non ascii characters found in tag name');
	}
	
	params.tags = tags;
	
	this.__super__.sendRequest(method, params, function(){
		if(typeof callback === 'function'){
			callback(true);
		}
	});
};


/**
 * Permanently delete specified collection and all associated data.
 * 
 * @method Collection.delete
 * @param {number} projectId Project id
 * @param {string / Number} collection Either collection id (number) or key (string)
 * @param {function} callback (optional) Function to be called when successful response comes 
 */
Collection.delete = function(projectId, collection, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Collection.delete - projectId must be a number');
	}
	var method = 'collection.delete';
	var params = {
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Collection.delete - collection key/id must be passed');
	}

	this.__super__.sendRequest(method, params, function(){
		if(typeof callback === 'function'){
			callback(true);
		}
	});
};


/**
 * methods for handling folders - creating, reading, updating, deleting 
 */

var Folder = {};

/**
 *  Create new folder within specified collection
 *
 *  @method Folder.new
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Either collection id (number) or key (string)
 *  @param {string} name Folder name
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Folder.new = function(projectId, collection, name, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Folder.new - projectId must be a number');
	}
	if(!name){
		throw new Error('Folder.new - folder must have a name');
	}
	var method = 'folder.new';
	var params = {
		name: name,
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Folder.new - collection key/id must be passed');
	}
	
	this.__super__.sendRequest(method, params, function(data){
		var res = data.folder;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
};


/**
 *  Get folders for specified collection
 *
 *  @name method Folder.get 
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Collection id or key defining collection for which folders will be returned
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Folder.get = function(projectId, collection, callback){
	if(typeof projectId !== 'number'){
		throw new Error('Folder.get - projectId must be a number');
	}
	
	var method = 'folder.get';
	var params = {
		project_id: projectId
	};
	if(typeof collection == 'string'){
		params.collection_key = collection;
	} else if (typeof collection == 'number'){
		params.collection_id = collection;
	} else {
		throw new Error('Folder.get - collection key/id must be passed');
	}
	
	this.__super__.sendRequest(method, params, function(data){
		var res = data.folder;
		if(typeof callback === 'function'){
			callback(res);
		}
	});
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
 * Real time high level library for Syncano (www.syncano.com)
 *
 * @class Syncano
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
	
	/**
	 *  High-level function mixins
	 */
	this.Project = Project;
	this.Project.__super__ = this;
	this.Collection = Collection;
	this.Collection.__super__ = this;
	this.Folder = Folder;
	this.Folder.__super__ = this;
};


/**
 *  add PubSub mixin
 */
Syncano.prototype = extend(Syncano.prototype, PubSub);


/**
 *  Establishes connecion to the server and sends authorization request.
 *  
 *  @method connect
 *  @param {object} params Connection parameters {instance, api_key, optional timezone}. If any of them is not defined, error is thrown
 *  @param {function} callback Optional callback to be called after successful connection and authorization.
 */
Syncano.prototype.connect = function(params, callback){
	if(typeof params === 'undefined' || typeof params.api_key === 'undefined' || typeof params.instance === 'undefined'){
		throw new Error('syncano.connect requires instance name and api_key');
	}
	if(typeof root.SockJS === 'undefined'){
		throw new Error('SockJS is required');
	}
	this.connectionParams = params;
	if(this.status != states.DISCONNECTED){
		this.reconnectOnSocketClose = true;
		return;
	}

	if(typeof callback === 'function'){
		this.waitingForResponse.auth = ['auth', callback];
	}

	this.socket = new root.SockJS(this.socketURL);
	this.socket.onopen = this.onSocketOpen.bind(this);
	this.socket.onclose = this.onSocketClose.bind(this);
	this.socket.onmessage = this.onMessage.bind(this);
};


/**
 *  Internal method called after the socket is open. Sends authorization request - instance, api_key and (optional) timezone 
 *  defined in this.connectionParams.
 *
 *  @method onSocketOpen
 */
Syncano.prototype.onSocketOpen = function(){
	this.status = states.CONNECTED;
	this.socketSend(this.connectionParams);
};


/**
 *  Internal method called automatically when socket is closed. Clears SockJS instance, changes state to DISCONNECTED. If there was
 *  waiting request to reconnect, handles reconnection with the same params.
 *
 *  @method onSocketClose
 */
Syncano.prototype.onSocketClose = function(){
	this.status = states.DISCONNECTED;
	this.socket = null;
	if(this.reconnectOnSocketClose === true){
		this.reconnectOnSocketClose = false;
		this.connect(this.connectionParams);
	}
};


/**
 *  Method called every time the message is received. Message is passed as e.data
 *  If there was an error, e.data.result is 'NOK' (not ok), otherwise e.data has response data.
 * 
 *  @method onMessage
 *  @param {object} e event object
 */
Syncano.prototype.onMessage = function(e){
	var data = JSON.parse(e.data);
	
	if(data.result === 'NOK'){
		this.trigger('syncano:error', data.data.error);
		if(data.type === 'auth'){
			this.socket.close();
			this.trigger('syncano:auth:error');
		}
		return;
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
 *
 *  @method parseAuthorizationResponse
 *  @param {object} data Object send by server. Fields: timestamp, uuid, type, result
 */
Syncano.prototype.parseAuthorizationResponse = function(data){
	this.uuid = data.uuid;
	this.status = states.AUTHORIZED;
	this.trigger('syncano:authorized', this.uuid);
	this.parseCallResponse({message_id: 'auth', data:data});
	this.sendQueue();
};


/**
 *  Receiven new callresponse message. If we were waiting for this response, handle it (call callback, etc). Otherwise - ignore
 *
 *  @method parseCallResponse
 *  @param {object} data - data received. Fields: type (=callresponse), message_id, result, data
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
 *  Sends all requests waiting in the queue and clears the queue.
 *
 *  @method sendQueue
 */
Syncano.prototype.sendQueue = function(){
	while(this.requestsQueue.length > 0){
		var request = this.requestsQueue.shift();
		this.socketSend(request);
	}
};


/**
 *  Generates unique message id
 * 
 *  @method getNextRequestId
 *  @return {number} next unique identifier
 */
Syncano.prototype.getNextRequestId = function(){
	return this.requestId++;
};


/**
 *  Sends request as a string. Internal low-level function, should not be used outside
 * 
 *  @method socketSend
 *  @param {object} request 
 */
Syncano.prototype.socketSend = function(request){
	this.socket.send(JSON.stringify(request) + "\n");
};


/**
 *  Universal high-level function for sending requests to syncano. 
 *  Sends request to 'method' with given 'params' if the socket is connected. If not, puts request on the queue to be sent later.
 *  Uses internal 'waitingForResponse' object to match request with response.
 *
 *  @method sendRequest
 *  @param {string} method Name of the Syncano method to call (check syncano docs)
 *  @param {object} params Parameters to send. Every method needs different parameters (check syncano docs)
 *  @param {function} callback Function to call after receiving response from server
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
