// get config
var config = require('../config/config');

var mysql = require('mysql');

module.exports = {

	pool: mysql.createPool(config.mysql),

	execQuery: function (query, data, callback) {
		pool.getConnection(function(err, conn) {
			if (err) {
				console.log(err);
				callback(err, null);
				throw err;
				return;
			}
			conn.query(query, data, function(err, result) {
				callback(err, result);
				conn.release();
			});                

		});
	}

}
