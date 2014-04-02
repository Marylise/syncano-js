/* global describe, it */

(function () {
    'use strict';
	
	var s;
	var eventsHistory = [];
	var uuid = null;
	var projectId = 0;
	
	function lastEvt(){
		return eventsHistory[eventsHistory.length-1];
	}


	describe('Syncano', function(){
		beforeEach(function(){
			s = SyncanoConnector.getInstance();
			s.off('all');
			s.on('all', function(type, data){
				eventsHistory.push([type, data]);
				console.log(type, data);
			});
		});


		describe('Connection', function(){
			it('should connect', function(done){
				s.connect({
					instance: 'develjs',
					api_key: '2a8fac000d915af306dfc0e8df835619c5445e72'
				}, function(data){
					if(typeof data.uuid !== 'undefined'){
						done();
					} else {
						throw Error('problem with connection');
					}
				});
			});
		    it('should trigger event on successful auth', function(){
				lastEvt()[0].should.equal('syncano:auth');
		    });
			if('should set uuid', function(){
				uuid = lastEvt()[1][0].uuid;
				uuid.should.not.equal(null);
			});
		});


		describe('Project', function(){
			it('create new project', function(done){
				s.Project.new('Project name', 'Test project created by mocha', function(rec){
					projectId = rec.id | 0;
					projectId.should.not.equal(0);
					done();
				});
			});
			
		    it('should trigger event on project creation', function(){
				lastEvt()[0].should.equal('syncano:project:new');
		    });
			
			it('find created project on a list', function(done){
				s.Project.get(function(list){
					list.forEach(function(p){
						if(p.id == projectId){
							done();
						}
					});
				});
			});
			
		    it('should trigger event on project list', function(){
				lastEvt()[0].should.equal('syncano:project:get');
		    });
			
			it('get created project directly', function(done){
				s.Project.getOne(projectId, function(rec){
					var id = rec.id | 0;
					id.should.equal(projectId);
					done();
				});
			});
			
		    it('should trigger event on project get', function(){
				lastEvt()[0].should.equal('syncano:project:get_one');
		    });
			
			it('update project details', function(done){
				var n = 'New name',
					d = 'New description';
				s.Project.update(projectId, n, d, function(rec){
					rec.name.should.equal(n);
					rec.description.should.equal(d);
					done();
				});
			});
			
		    it('should trigger event on project update', function(){
				lastEvt()[0].should.equal('syncano:project:update');
		    });
			
			it('delete created project', function(done){
				s.Project.delete(projectId, function(res){
					res.should.equal(true);
					done();
				});
			});
			
		    it('should trigger event on project deletion', function(){
				lastEvt()[0].should.equal('syncano:project:delete');
		    });
		});
	});

})();
