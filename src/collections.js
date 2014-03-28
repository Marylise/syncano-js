/**
 * Methods for handling collections - creating, reading, updating, deleting 
 */
var Collection = {};


/**
 *  Create new collection within specified project
 *  
 *  @method Collection.new
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string} name New collection's name
 *  @param {string} key (optional) New collection's key
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
 * @param {string/number} collection Either collection id (number) or key (string)
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
 * @method Collection.activate
 * @param {number} projectId Project id
 * @param {string/number} collection Either collection id (number) or key (string)
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
	}
	
	this.__super__.sendRequest(method, params, function(){
		if(typeof callback === 'function'){
			callback(true);
		}
	});
};


/*
Collection.update = function(projectId, collection, name, description){
};

Collection.delete = function(projectId, collection){
	
};

Collection.addTag = function(projectId, collection, tags, weight, remove_other){
	
};


Collection.deleteTag = function(projectId, collection, tags){
	
};
*/