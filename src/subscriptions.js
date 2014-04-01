/**
 * Subscriptions handling methods 
 */
var Subscription = {};


/**
 *  Subscribe to project level notifications
 *
 *  @method Subscription.subscribeProject
 *  @param {number} projectId Project id
 *  @param {function} [callback] Function to be called when successful response comes
 */
Subscription.subscribeProject = function(projectId, callback){
	var method = 'subscription.subscribe_project';
	if(!isset(projectId) || !isNumber(projectId)){
		throw new Error('projectId must be defined');
	}
	this.__super__.__sendWithCallback(method, {project_id: projectId}, true, callback);
};