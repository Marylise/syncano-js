test("the base function exists", function() {
  ok(syncano);
});

test("PubSub tests", function(){
	var called1 = false, called2 = false;
	
	var callback1 = function(params){
		called1 = true;
		equal(params.length, 2, 'Arguments array should have 2 elements');
	};
	var callback2 = function(params){
		called2 = true;
		equal(params.length, 2, 'Arguments array should have 2 elements');
	};
	
	var s = new syncano();
	var msg = 'MY MESSAGE';
	
	ok(
		typeof s.on === 'function' && typeof s.off === 'function' && typeof s.hasSubscribers === 'function' && typeof s.trigger === 'function',
		'PubSub methods should be available'
	);
	
	equal(s.hasSubscribers(msg), false, 'Empty syncano object should not have any subscribers');
	
	s.on(msg, callback1);
	equal(s.hasSubscribers(msg), true, 'After single call of "on" method, subscribers list should be not empty');
	
	s.on(msg, callback2);
	equal(s.hasSubscribers(msg), true, 'After second call of "on" method, subscribers list still should be not empty');

	s.off(msg, callback1);
	s.triggerSync(msg, 'hello world!', 17);
	equal(called1, false, 'Callback 1 should not be called');
	equal(called2, true, 'Callback 1 should be called');
	
	s.off(msg, callback2);
	equal(s.hasSubscribers(msg), false, 'After disabling all subscribers, the list should be empty');
	
	var res = s.triggerSync(msg, 'new!');
	equal(res, false, 'Trigger should not be called when there are no subscribers');
});