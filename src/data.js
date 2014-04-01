var Data = {};

/**
 *  Creates a new Data Object
 *  All optional params should be passed as a single object: {title:'', text:'', ...}
 * 
 *  @method Data.new
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Either collection id (number) or key (string)
 *  @param {string} dataKey (optional) Used for uniquely identifying message. Has to be unique within collection. Useful for updating
 *  @param {string} userName (optional) Name of user to associate Data Object with. If not set, internal user 'syncano' is used
 *  @param {string} sourceUrl (optional) Source URL associated with message
 *  @param {string} title (optional) Title of data object
 *  @param {string} text (optional) text Text data associated with message
 *  @param {string} link (optional) Link associated with message
 *  @param {string} image (optional) Image data associated with message
 *  @param {string} imageUrl (optional) Image source URL. Used in combination with image parameter
 *  @param {string} folder (optional) Folder name that data will be put in. Default value: 'Default'.
 *  @param {string} state (optional) State of data to be initially set. Accepted values: Pending, Moderated, Rejected. Default value: Pending
 *  @param {number} parentId (optional) If specified, creates one parent-child relation with specified parent id.
 *  @param {object} additional (optional) Any number of additional parameters (key - value)
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Data.new = function(projectId, collection, optionalParams, callback){
	this.__super__.__checkProjectId(projectId);
	
	var method = 'data.new';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	/**
	 *  all optional params
	 */
	if(isset(optionalParams)){
		var stringParams = [
			'dataKey', 'userName', 'sourceUrl', 'title', 'text', 'link', 'image', 'imageUrl', 'folder', 'state'
		];
		for(var i=0; i<stringParams.length; i++){
			var strParam = stringParams[i];
			if(isset(optionalParams[strParam])){
				if(typeof optionalParams[strParam] === 'string'){
					params[uncamelize(strParam)] = optionalParams[strParam];
				} else {
					throw new Error(strParam + ' must be a string');
				}
			}
		}
		
		if(isset(optionalParams.parentId)){
			if(isNumber(optionalParams.parentId)){
				throw new Error('parentId must be a number');
			} else {
				params.parent_id = optionalParams.parentId;
			}
		}
		
		if(isset(params.state)){
			if(['pending', 'moderated', 'rejected'].indexOf(params.state.toLowerCase()) == -1){
				throw new Error('incorrect value of state param');
			}
		}
		
		if(isset(optionalParams.additional)){
			for(var key in optionalParams.additional){
				if(optionalParams.additional.hasOwnProperty(key)){
					var val = optionalParams.additional[key];
					if(stringParams.indexOf(key) !== -1 || key === 'parent_id'){
						throw new Error('Cannot use additional (custom) param named ' + key);
					}
					params[key] = val;
				}
			}
		}
	}
	this.__super__.__sendWithCallback(method, params, 'data', callback);
};


/**
 *  Get data from collection(s) or whole project with optional additional filtering. All filters, unless explicitly noted otherwise, affect all hierarchy levels.
 *  To paginate and to get more data, use since_id or since_time parameter
 *  All optional params should be passed as a single object: {key: value, ...}
 *
 *  @method Data.get
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Either collection id (number) or key (string)
 *  @param {string / Array} dataIds (optional) If specified, will return data objects with specified ids. Note: has no effect on returned data object's children. Max 100 values per request 
 *  @param {string} state (optional) State of data to be returned. Accepted values: Pending, Moderated, Rejected, All. Default value: All.
 *  @param {string / Array} folders (optional) Folder name that data will be returned from. Max 100 values per request. If not presents returns data from across all collection folders
 *  @param {string} sinceId (optional) If specified, will only return data with id higher than since_id (newer). Note: has no effect on returned data object's children
 *  @param {string} sinceTime (optional) String with date. If specified, will only return data with created_at or updated_at time after specified value (newer). Note: has no effect on returned data object's children
 *  @param (number) maxId (optional) If specified, will only return data with id lower than max_id (older)
 *  @param {number} limit (optional) Number of Data Objects to be returned. Default and max value: 100 
 *  @param {string} order (optional) Sets order of data that will be returned. ASC (default) - oldest first, DESC - newest first
 *  @param {string} orderBy (optional) Orders by specified criteria. created_at (default), updated_at
 *  @param {string} filter (optional) TEXT - only data with text field specified, IMAGE - only data with an image attached
 *  @param {string} includeChildren (optional) If true, include Data Object children as well (recursively). Default value: True.
 *  @param {number} depth (optional) Max depth of children to follow. If not specified, will follow all levels until children limit is reached
 *  @param {number} childrenLimit (optional) Limit of children to show (if include_children is True). Default and max value: 100 (some children levels may be incomplete if there are more than this limit).
 *  @param {string / Array} parentIds (optional) Data Object id or ids. If specified, only children of specific Data Object parent will be listed
 *  @param {string} byUser (optional) If specified, filter by Data Object user's name
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Data.get = function(projectId, collection, optionalParams, callback){
	var i;

	this.__super__.__checkProjectId(projectId);
	
	var method = 'data.get';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	if(isset(optionalParams)){
		
		/**
		 *  these optionalParams are just copied to params array if they are set
		 */
		var justSetParams = ['dataIds', 'folders', 'byUser', 'parentIds'];
		for(i=0; i<justSetParams.length; i++){
			var jsParam = justSetParams[i];
			if(isset(optionalParams[jsParam])){
				params[uncamelize(jsParam)] = optionalParams[jsParam];
			}
		}
		
		/**
		 *  these optionalParams have to be numbers - so check if they are set and are proper numbers. If not - throw an Error
		 */
		var numericParams = ['maxId', 'limit', 'sinceId', 'depth', 'childrenLimit'];
		for(i=0; i<numericParams.length; i++){
			var numParam = numericParams[i];
			if(isset(optionalParams[numParam])){
				if(isNumber(optionalParams[numParam])){
					params[uncamelize(numParam)] = optionalParams[numParam];
				} else {
					throw new Error(numParam + ' must be a number');
				}
			}
		}
		
		if(isset(optionalParams.state)){
			if(['pending','moderated','rejected','all'].indexOf(optionalParams.state.toLowerCase()) !== -1){
				params.state = optionalParams.state;
			} else {
				throw new Error('incorrect value of state param');
			}
		}
		
		if(isset(optionalParams.sinceTime)){
			if(isDate(optionalParams.sinceTime)){
				params.since_time = optionalParams.sinceTime;
			} else {
				throw new Error('Param sinceTime must be a proper date string');
			}
		}
		
		if(isset(optionalParams.order)){
			if(['asc', 'desc'].indexOf(optionalParams.order.toLowerCase()) !== -1){
				params.order = optionalParams.order;
			} else {
				throw new Error('incorrect value of order param - only "asc" and "desc" are allowed');
			}
		}
		
		if(isset(optionalParams.orderBy)){
			if(inArray(optionalParams.orderBy.toLowerCase(), ['created_at', 'updated_at'])){
				params.order_by = optionalParams.orderBy;
			} else {
				throw new Error('incorrect value of order_by param - only "created_at" and "updated_at" are allowed');
			}
		}
		
		if(isset(optionalParams.filter)){
			if(inArray(optionalParams.filter.toLowerCase(), ['text', 'image'])){
				params.filter = optionalParams.filter;
			} else {
				throw new Error('incorrect value of filter param - only "text" and "image" are allowed');
			}
		}
		
		if(isset(optionalParams.includeChildren)){
			if(isBool(optionalParams.includeChildren)){
				params.include_children = optionalParams.includeChildren;
			} else {
				throw new Error('includeChildren param must be boolean');
			}
		}
	}

	this.__super__.__sendWithCallback(method, params, 'data', callback);
};


/**
 * Get data by data_id or data_key
 * 
 *  @method Data.getOne 
 *  @param {number} projectId Project id that collection will be created for
 *  @param {string / Number} collection Either collection id (number) or key (string)
 *  @param {string / Number} data Either data id (number) or key (string)
 *  @param {function} callback (optional) Function to be called when successful response comes
 */
Data.getOne = function(projectId, collection, data, callback){
	this.__super__.__checkProjectId(projectId);
	
	var method = 'data.get_one';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	if(typeof data === 'string'){
		params.data_key = data;
	} else if (typeof data == 'number'){
		params.data_id = data;
	} else {
		throw new Error('Data key/id must be passed');
	}
	
	this.__super__.__sendWithCallback(method, params, 'data', callback);
};

