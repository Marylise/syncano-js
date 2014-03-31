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