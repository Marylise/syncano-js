var Tree = {};

Tree.__internalReadLevel = function(projectId, collection, params, ids, callback){
	this.__super__.BigData.get(projectId, collection, params, function(levelData){
		var len = levelData.length;
		var parentIds = [];
		for(var i=0; i<len; i++){
			var item = levelData[i];
			var id = item.id | 0;
			ids.push(id);
			if(item.children_count > 0){
				parentIds.push(id);
			}
		}
		if(parentIds.length > 0){
			params.parentIds = parentIds;
			this.__internalReadLevel(projectId, collection, params, ids, callback);
		} else {
			callback(ids);
		}
	}.bind(this));
};

Tree.__internalRemoveIds = function(projectId, collection, ids, folders, callback){
	var packSize = 100;
	var idsPack = ids.splice(0, packSize);

	var params = {
		dataIds: idsPack,
		folders: folders
	};
	this.__super__.Data.delete(projectId, collection, params, function(){
		if(ids.length === 0){
			callback();
		} else {
			this.__internalRemoveIds(projectId, collection, ids, folders, callback);
		}
	}.bind(this));
};


Tree.delete = function(projectId, collection, dataId, folders, callback){
	var params = {
		parentIds: dataId,
		folders: folders,
		includeChildren: false
	};
	var ids = [dataId];
	this.__internalReadLevel(projectId, collection, params, ids, function(ids){
		this.__internalRemoveIds(projectId, collection, ids, folders, callback);
	}.bind(this));
};