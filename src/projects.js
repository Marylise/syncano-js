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
			callback();
		}
	});
};
