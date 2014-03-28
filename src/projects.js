/**
 * methods for handling projects - creating, reading, updating, deleting 
 */

var Project = {
	new: function(name, description, callback){
		var method = 'project.new';
		this.__super__.sendRequest(method, {name: name, description: description}, function(data){
			var res = data.project;
			if(typeof callback === 'function'){
				callback(res);
			}
		});
	},
	
	/**
	 *  
	 */
	get: function(callback){
		var method = 'project.get';
		this.__super__.sendRequest(method, {}, function(data){
			var res = data.project;
			if(typeof callback === 'function'){
				callback(res);
			}
		});
	},
	
	/**
	 *  
	 */
	getOne: function(id, callback){
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
	},
	
	
	update: function(id, name, description, callback){
		if(typeof name === 'undefined' && typeof description === 'undefined'){
			return false;
		}
		var method = 'project.update';
		this.__super__.sendRequest(method, {name: name, description: description}, function(data){
			var res = data.project;
			if(typeof callback === 'function'){
				callback(res);
			}
		});
		return true;
	},


	delete: function(id, callback){
		var method = 'project.delete';
		this.__super__.sendRequest(method, {id: id}, function(data){
			if(typeof callback === 'function'){
				callback(data);
			}
		});
	}
};

