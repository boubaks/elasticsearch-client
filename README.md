# elasticsearch-client
simple elasticsearch client (npm elasticsearch-js used)

## Installation
npm install elasticsearch-client


## Connect
    
    var elsClient = require('elasticsearch-client');
    new elsClient(host, port, function (client, msg) {
      // elasticsearch client
    });
    
## Indices : create & delete

    new elsClient(host, port, function (client, msg) {
      client.createIndice('user', function(err, response) {
        // indice created
      });
      /*
        client.deleteIndice('user', function(err, response) {
        });
      */
    });

## Documents : post, put, get, delete, search & count

    new elsClient(host, port, function (client, msg) {

      /*
      **  index (string) elasticsearch index
      **  type (object) elasticsearch type
      **  object (object) the object that you want to insert
      **  callback (function)
      */
      client.post('user', 'admin', {username: 'kimchy', friend: 'boubaks'}, function (err, response) {
        // _id on response --> qdmok1234DZO_342
      });
      
      /*
      **  index (string) elasticsearch index
      **  type (object) elasticsearch type
      **  id (string) document id
      **  object (object) the object that you want to insert or partial update
      **  options (object) { upsert: {text: 'Hello !'}, } (look the official API docs)
      **  callback (function)
      */
      client.put('user', 'admin', 'qdmok1234DZO_342', {email: 'kimchy@elastic.co'}, null, function(err, response) {
        // adding email on the document /user/admin/qdmok1234DZO_342
      });
      
      /*
      **  index (string) elasticsearch index
      **  type (string) elasticsearch type
      **  id (string) document id
      **  callback (function)
      */
      client.delete('user', 'admin', 'qdmok1234DZO_342', function(err, response) {
        // remove the document /user/admin/qdmok1234DZO_342
      });
      
      /*
      **  index (string) elasticsearch index
      **  type (string) elasticsearch type
      **  query (object) that you want to transform
      **  callback (function)
      */
      client.deleteByQuery('user', 'admin', 'username:kimchy', function(err, response) {
      });
      
      /*
      **  index (string) elasticsearch index
      **  query (object) that you want to transform
      **  options (object) { type: '...', } (look the official API docs)
      **  callback (function)
      */
      client.count('posts', 'text:elastic', {type: 'twitter'}, function(err, response) {
      });
      
      /*
      **  index (string) elasticsearch index
      **  query (object) that you want to transform
      **  options (object) { type: '...', } (look the official API docs)
      **  callback (function)
      */
      client.search('posts', 'text:elastic', {type: 'twitter'}, function(err, response) {
      });
    });
  
## Trace & Debug mode
  You can set PROCESS.env.ELSLOG = true. This option active the ['trace', 'error'] "log" on elasticsearch client.
