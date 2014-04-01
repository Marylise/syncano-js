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
	//params: , parentId, additional	
	this.__super__.__checkProjectId(projectId);
	
	var method = 'data.new';
	var params = {
		project_id: projectId
	};
	params = this.__super__.__addCollectionIdentifier(params, collection);
	
	/**
	 *  all optional params
	 */
	if(typeof optionalParams !== 'undefined'){
		var stringParams = [
			'dataKey', 'userName', 'sourceUrl', 'title', 'text', 'link', 'image', 'imageUrl', 'folder', 'state'
		];
		for(var i=0; i<stringParams.length; i++){
			var strParam = stringParams[i];
			if(typeof optionalParams[strParam] !== 'undefined'){
				if(typeof optionalParams[strParam] === 'string'){
					params[uncamelize(strParam)] = optionalParams[strParam];
				} else {
					throw new Error(strParam + ' must be a string');
				}
			}
		}
		
		if(typeof optionalParams.parentId !== 'undefined'){
			if(typeof optionalParams.parentId !== 'number' && parseInt(optionalParams.parentId, 10) != optionalParams.parentId){
				throw new Error('parentId must be a number');
			} else {
				params.parent_id = optionalParams.parentId;
			}
		}
		
		if(typeof params.state !== 'undefined'){
			if(['pending', 'moderated', 'rejected'].indexOf(params.state.toLowerCase()) == -1){
				throw new Error('incorrect value of state param');
			}
		}
		
		if(typeof optionalParams.additional === 'object'){
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