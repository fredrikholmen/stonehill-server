/**
 * Power module
 * @module Power
 * 
 */

//Private
'use strict';

var pool = require('../lib/mysql_pool').pool;

function execQuery (query, data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) {
			console.error(err);
            if(callback)
			    callback(err, null);
			throw err;
			return;
		}

		conn.query(query, data, function(err, result) {
            if (err) {
                console.error(err);
                throw err;
                conn.release();
                return;
            }

            if(callback)
			    callback(err, result);
			conn.release();
		});                

	});
}

//Public
module.exports = {

	effect: function(callback) {
		//var query = "select round((10*3600)/timestampdiff(SECOND,min(t.datetime), max(t.datetime))) as P from (select * from watthours order by id desc limit 10) t;";
   		var	query = "select count(id)*3600/30 as P from watthours where datetime >= date_sub(now(), INTERVAL 30 SECOND);";
    	execQuery(query, null, callback);
	},

	today: function(callback) {
		var query = "select count(id) as today from watthours where DATE(datetime) = curdate();";

		execQuery(query, null, callback);

	},

	month: function(callback) {
		var query = "select count(id) as month from watthours where DATE(datetime) > date_format(curdate(), '%Y-%m-01');";

		execQuery(query, null, callback);
	}


};