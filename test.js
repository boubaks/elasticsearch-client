var elsClient = require(__dirname + '/index');
var events = require('events');
var eventEmitter = new events.EventEmitter();

// process.env.ELSLOG = true;

var exit = function exit() {
	process.exit();
}

var createIndice = function createIndice() {
	GLOBAL.searchClient.createIndice('test', function (err, response) {
		if (err) { console.log('error', err); eventEmitter.emit('exit'); } else {
			console.log(JSON.stringify(response));
			eventEmitter.emit('post');
		}
	});
};

var deleteIndice = function deleteIndice() {
	GLOBAL.searchClient.deleteIndice('test', function (err, response) {
		if (err) { console.log('error', err); eventEmitter.emit('exit'); } else {
			console.log(JSON.stringify(response));
			eventEmitter.emit('exit');
		}
	});
};

var post = function post() {
	GLOBAL.searchClient.post('test', 'type', {'username': 'kimchy', 'friend': 'boubaks'}, function (err, response) {
		if (err) { console.log('error', err); eventEmitter.emit('exit'); } else {
			console.log(JSON.stringify(response));
			eventEmitter.emit('search');
		}
	});
};

var search = function search() {
	// time to insert
	setTimeout(function() { 
		GLOBAL.searchClient.search('test', 'username:kimchy', { type: 'type', size: 10, skip: 0 }, function (err, response) {
			if (err) { console.log('error', err); eventEmitter.emit('exit'); } else {
				console.log(JSON.stringify(response));
				eventEmitter.emit('deleteIndice');
			}
		});
	}, 1000);
};

eventEmitter.addListener('createIndice', createIndice);
eventEmitter.addListener('post', post);
eventEmitter.addListener('search', search);
eventEmitter.addListener('deleteIndice', deleteIndice);
eventEmitter.addListener('exit', exit);


var host = 'localhost';
var port = 9200;

GLOBAL.searchClient = undefined;

new elsClient(host, port, function (tmpClient, msg) {
    if (!tmpClient) {
		throw ('Couldn\'t connect to ELS');
	} else {
		GLOBAL.searchClient = tmpClient;
		eventEmitter.emit('createIndice');
	}
});
