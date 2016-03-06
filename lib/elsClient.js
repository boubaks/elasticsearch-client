var elasticsearch = require('elasticsearch');

exports.elsClient = function(host, port, callback)
{
    var me = this;
    me._client = new elasticsearch.Client({
        host: host + ':' + port,
        log: process.env.ELSLOG === true ? ['trace', 'error'] : null
    });
    
    me._client.ping({
      requestTimeout: 1000,
      // undocumented params are appended to the query string
      hello: "elasticsearch!"
    }, function (error) {
      if (error) {
        console.log('elasticsearch cluster is down!', error);
        callback(null, error);
      } else {
          console.log('Connected to ELS');
          callback(me, "All is well");
      }
    });
};

exports.elsClient.prototype.get = function(index, type, id, callback) {
    this._client.search({
      index: index,
      type: type,
      id: id
    }, function (error, response) {
      callback(error, response);
    });
};

exports.elsClient.prototype.search = function(index, query, options, callback) {
    var tmpSearch = {
        index: index
    };
    for (option in options) {
        tmpSearch[option] = options[option];
    }
    if (typeof query == 'string') {
        tmpSearch.q = query;
        this._client.search(tmpSearch, function (error, response) {
            callback(error, response);
        });
    } else {
        tmpSearch.body = query;
        this._client.search(tmpSearch, function (error, response) {
          callback(error, response);
        });
    }
};

exports.elsClient.prototype.findAndModify = function(index, type, query, object, options, callback) {
    var me = this;

    me.search(index, query, null, function(error, results) {
        if (results && results.hits && results.hits.hits.length > 0) {
            me.put(index, type, results.hits.hits[0]._id, object, null, function (err, res) {
                callback(err, res);        
            });
        } else {
            me.post(index, type, object, function (err, res) {
                callback(err, res);
            });
        }
    });
};


exports.elsClient.prototype.put = function(index, type, id, object, options, callback) {
    var body = {};

    if (options) {
        for (option in options) {
            body[option] = options[option];
        }
    }
    if (object) {
	    body.doc = object;
    }
    this._client.update({
      index: index,
      type: type,
      id: id,
      body: body
    }, function (error, response) {
        callback(error, response);
    })
};

exports.elsClient.prototype.post = function(index, type, object, callback) {
    this._client.create({
      index: index,
      type: type,
      id: object._id ? object._id : null,
      body: object
    }, function (error, response) {
      callback(error, response);
    });
};

exports.elsClient.prototype.delete = function(index, type, id, callback) {
    this._client.delete({
      index: index,
      type: type,
      id: id
    }, function (error, response) {
      callback(error, response);
    });
};

exports.elsClient.prototype.deleteByQuery = function(index, type, query, callback) {
    var tmpDelete = {
      index: "_all"
    };

    if (index) {
      tmpDelete.index = index;
    } if (type) {
      tmpDelete.type = type;
    } if (typeof query == 'string') {
        tmpDelete.q = query;
    } else {
        tmpDelete.body = query;
    }
    this._client.deleteByQuery(tmpDelete, function (error, response) {
      callback(error, response);
    });
}

exports.elsClient.prototype.createIndice = function(index, callback) {
    this._client.indices.create({
      index: index
    }, function (error, response) {
      callback(error, response);
    });
};

exports.elsClient.prototype.deleteIndice = function(index, callback) {
    this._client.indices.delete({
      index: index
    }, function (error, response) {
      callback(error, response);
    });
};

exports.elsClient.prototype.count = function(index, query, options, callback) {
    var tmpSearch = {
        index: index
    };
    for (option in options) {
        tmpSearch[option] = options[option];
    }
    if (typeof query == 'string') {
        tmpSearch.q = query;
        this._client.count(tmpSearch, function (error, response) {
            callback(error, response);
        });
    } else {
        tmpSearch.body = query;
        this._client.count(tmpSearch, function (error, response) {
          callback(error, response);
        });
    }
};