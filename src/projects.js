/**
 * methods for handling projects - creating, reading, updating, deleting 
 */

var Project = {
	new: function(name, description){
		var method = 'project.new';
		this.__super__.sendRequest(method, {name: name, description: description}, function(data){
			console.log(data);
		});
	},
	
	get: function(){
		var method = 'project.get';
		this.__super__.sendRequest(method, {}, function(data){
			console.log('Calling callback with data: ', data);
		});
	},
	
	getOne: function(id){
		var method = 'project.get_one';
		this.__super__.sendRequest(method, {id: id}, function(data){
			console.log(data);
		});
	},
	
	update: function(id, name, description){
		var method = 'project.update';
		this.__super__.sendRequest(method, {name: name, description: description}, function(data){
			console.log(data);
		});
	},
	
	delete: function(id){
		var method = 'project.delete';
		this.__super__.sendRequest(method, {id: id}, function(data){
			console.log(data);
		});
	}
};

