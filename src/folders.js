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