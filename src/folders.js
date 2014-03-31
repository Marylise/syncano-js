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
	this.__super__.__checkProjectId(projectId);
	if(!name){
		throw new Error('Folder must have a name');
	}
	var method = 'folder.new';
	var params = {
		name: name,
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	this.__super__.__sendWithCallback(method, params, 'folder', callback);
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
	this.__super__.__checkProjectId(projectId);
	
	var method = 'folder.get';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	this.__super__.__sendWithCallback(method, params, 'folder', callback);
};


/**
 *  Get folders for specified collection 
 * 
 *  @name method Folder.getOne 
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Collection id or key defining collection for which folder will be returned
 *  @param {string} folderName Folder name defining folder
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Folder.getOne = function(projectId, collection, folderName, callback){
	this.__super__.__checkProjectId(projectId);
	
	var method = 'folder.get_one';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	if(typeof folderName !== 'string'){
		throw new Error('FolderName must be a string');
	}
	params.folder_name = folderName;
	this.__super__.__sendWithCallback(method, params, 'folder', callback);
};


/**
 *  Update existing folder
 * 
 *  @method Folder.update
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Collection id or key defining collection for which folder will be returned
 *  @param {string} folderName Folder name defining folder
 *  @param {string} newName New folder name
 *  @sourceId {string} New source id, can be used for mapping folders to external source
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Folder.update = function(projectId, collection, folderName, newName, sourceId, callback){
	this.__super__.__checkProjectId(projectId);
	var method = 'folder.update';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	if(typeof folderName !== 'string'){
		throw new Error('FolderName must be a string');
	}
	params.name = folderName;
	
	if(typeof newName !== 'undefined' && newName !== null){
		if(typeof newName !== 'string'){
			throw new Error('newName must be a string');
		}
		params.new_name = newName;
	} else {
		throw new Error('newName must be passed');
	}
	
	if(sourceId !== null){
		params.source_id = sourceId + '';
	}
	this.__super__.__sendWithCallback(method, params, 'folder', callback);
};


/**
 *  Permanently delete specified folder and all associated data
 *
 *  @method Folder.delete
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Collection id or key defining collection for which folder will be returned
 *  @param {string} folderName Folder name defining folder
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Folder.delete = function(projectId, collection, folderName, callback){
	this.__super__.__checkProjectId(projectId);
	var method = 'folder.delete';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	if(typeof folderName !== 'string'){
		throw new Error('FolderName must be a string');
	}
	params.name = folderName;
	
	this.__super__.__sendWithCallback(method, params, null, callback);
};