/**
 * Methods for user management 
 */
var User = {};

/**
 *  Creates new user
 *  
 *  @method User.new
 *  @param {string} name User's name
 *  @param {string} [nick] User's nick
 *  @param {function} [callback] Function to be called when successful response comes
 */
User.new = function(name, nick, callback){
	var method = 'user.new';
	var params = {};
	if(isset(name)){
		params.user_name = name;
	} else {
		throw new Error('user must have a name');
	}
	if(isset(nick)){
		params.nick = nick;
	}
	
	this.__super__.__sendWithCallback(method, params, 'user', callback);
};


/**
 *  Get all users from within instance. To paginate and to get more data, use since_id or since_time parameter.
 *
 *  @method User.getAll
 *  @param {number} sinceId If specified, will only return users with id higher than since_id (newer).
 *  @param {number} limit Number of users to be returned. Default and max value: 100
 */
User.getAll = function(sinceId, limit, callback){
	var method = 'user.get_all';
	
	if(typeof arguments[0] === 'function'){
		callback = arguments[0];
		sinceId = undefined;
		limit = undefined;
	}
	
	var params = {};
	if(isset(sinceId)){
		if(isNumber(sinceId)){
			params.since_id = sinceId;
		} else {
			throw new Error('sinceId must be a number');
		}
	}
	
	if(isset(limit)){
		if(isNumber(limit)){
			params.limit = limit;
		} else {
			throw new Error('limit must be a number');
		}
	}
	
	this.__super__.__sendWithCallback(method, params, 'user', callback);
};


/**
 *  Get users of specified criteria that are associated with Data Objects within specified collection 
 *
 *  @method Data.count
 *  @param {number} projectId Project id
 *  @param {string / Number} collection Either collection id or key
 *  @param {object} [optionalParams] Optional parameters:
 *  @param {string} [optionalParams.state] Return only users whose Data Objects are in specified state. Accepted values: Pending, Moderated, Rejected, All. Default value: All
 *  @param {string / Array} [optionalParams.folders] Folder name that data will be returned from. Max 100 values per request. If not present returns data from across all collection folders
 *  @param {string} [optionalParams.filter] TEXT - only return users that sent data with text IMAGE - only return users that sent data with an image
 *  @param {function} [callback] Function to be called when successful response comes
 */
User.get = function(projectId, collection, optionalParams, callback){
	this.__super__.__checkProjectId(projectId);

	var method = 'user.get';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);

	if(isset(optionalParams)){
		if(isset(optionalParams.folders)){
			params.folders = optionalParams.folders;
		}
		
		if(isset(optionalParams.state)){
			if(inArray(optionalParams.state.toLowerCase(), ['pending','moderated','rejected','all'])){
				params.state = optionalParams.state;
			} else {
				throw new Error('incorrect value of state param');
			}
		}
		
		if(isset(optionalParams.filter)){
			if(inArray(optionalParams.filter.toLowerCase(), ['text', 'image'])){
				params.filter = optionalParams.filter;
			} else {
				throw new Error('incorrect value of filter param - only "text" and "image" are allowed');
			}
		}
	}
	
	this.__super__.__sendWithCallback(method, params, 'user', callback);
};