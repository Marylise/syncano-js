/* syncano main */

// Base function.
var syncano = function() {
	// Add functionality here.
	return true;
};

syncano.prototype = extend(syncano.prototype, PubSub);

syncano.prototype.test = function(){
	console.log('test', this.hasSubscribers('message'));
};

// Version.
syncano.VERSION = '0.0.1';


// Export to the root, which is probably `window`.
root.syncano = syncano;
