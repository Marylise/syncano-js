(function(){
	'use strict';
	
	var s;
	var eventsHistory = [];
	var uuid = null;
	var projectId = 0;
	var collectionId = 0;
	var collectionKey = '';
	
	function lastEvt(){
		return eventsHistory[eventsHistory.length-1];
	}

	/**
	 *   
	 *  TEST COLLECTION MIXIN
	 *
	 */
	describe('Collection', function(){
		beforeEach(function(){
			s = SyncanoConnector.getInstance();
			s.off('all');
			s.on('all', function(type, data){
				eventsHistory.push([type, data]);
				//console.log(type, data);
			});
			s.on('syncano:error', function(e){
				console.warn(e);
			});
		});
		
		
		it('get default project id', function(done){
			projectId = null;
			s.Project.get(function(list){
				list.forEach(function(p){
					if(p.name == 'Default'){
						projectId = p.id | 0;
					}
				});
				projectId.should.not.equal(null);
				done();
			});
		});


		it('create new collection in default project', function(done){
			var n = 'New collection',
				k = 'collkey',
				d = 'Sample collection created by mocha test framework';
			s.Collection.new(projectId, n, {key:k, description:d}, function(rec){
				collectionId = rec.id | 0;
				collectionKey = rec.key;
				rec.name.should.equal(n);
				done();
			});
		});


	    it('trigger event on collection creation', function(){
			lastEvt()[0].should.equal('syncano:collection:new');
	    });


		it('set collection id', function(){
			collectionId.should.not.equal(0);
		});


		it('find created collection on a list', function(done){
			s.Collection.get(projectId, {}, function(list){
				list.forEach(function(c){
					if(c.id == collectionId){
						done();
					}
				});
			});
		});


		it('should throw an error when improper status is passed to Collection.get', function(){
			var err = '';
			try {
				s.Collection.get(projectId, {status: 'wrong'});
			} catch(e){
				err = e;
			}
			err.should.not.equal(null);
		});


	    it('trigger event on collection list', function(){
			lastEvt()[0].should.equal('syncano:collection:get');
	    });


		it('get created collection by id', function(done){
			s.Collection.getOne(projectId, collectionId, function(rec){
				var id = rec.id | 0;
				id.should.equal(collectionId);
				done();
			});
		});


		it('get created collection by key', function(done){
			s.Collection.getOne(projectId, collectionKey, function(rec){
				var id = rec.id | 0;
				id.should.equal(collectionId);
				done();
			});
		});


	    it('trigger event on collection get', function(){
			lastEvt()[0].should.equal('syncano:collection:get_one');
	    });


		it('delete created collection', function(done){
			s.Collection.delete(projectId, collectionId, function(rec){
				rec.should.equal(true);
				done();
			});
		});


	    it('trigger event on collection deletion', function(){
			lastEvt()[0].should.equal('syncano:collection:delete');
	    });
	});
	
	
})();