#usage

`grunt docs` - build documentation in docs/ folder
`grunt test` - runs test suite (qunit, but will be changed to mocha)
`grunt` - builds libraries (normal + min), tests and docs

#examples

Get syncano instance

	var s = SyncanoConnector.getInstance();

Register listener for all events:
	
	s.on('all', function(type, data){console.log(type, data);});

Connect to instance

	s.connect({instance: 'your-instance',api_key: 'your-api-key'});

Create new project

	s.Project.new('Test', 'description', function(data){
		console.log('Created project, received: ', data);
	});

Get all projects

	s.Project.get(function(p){
		console.log('Received ' + p.length + ' project(s).');
		p.forEach(function(m){
			console.log(m);
		});
	});

Delete project with id 1000

	s.Project.delete(1000, function(r){
		console.log('Deleted project.', r);
	});
