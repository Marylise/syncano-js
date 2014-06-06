var BigData = {};

BigData.__internalDataGet = function(res, limit, projectId, collectionId, params, callback){
	this.__super__.Data.get(projectId, collectionId, params, function(part){
		res = res.concat(part);
		var pLen = part.length;
		var lastId = part[pLen - 1].id;
		if(pLen === limit){
			params.sinceId = lastId;
			this.__internalDataGet(res, limit, projectId, collectionId, params, callback);
		} else {
			callback(res);
		}
	}.bind(this));
};

BigData.get = function(projectId, collectionId, params, callback){
	var res = [];
	var limit = 100;
	if(typeof params.limit !== 'undefined'){
		limit = params.limit;
	}
	this.__internalDataGet(res, limit, projectId, collectionId, params, function(res){
		callback(res);
	});
};