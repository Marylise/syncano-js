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