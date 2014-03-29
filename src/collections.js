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
