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
	},

	timeline_minute: function(callback) {
		var query = "select date_format(datetime, '%H:%i') as slot, count(id)/1000 as energy from watthours where datetime >= date_sub(now(), INTERVAL 60 MINUTE) group by date_format(datetime, '%H:%i') order by id asc;";

		execQuery(query, null, callback);
	},

	timeline_today: function(callback) {
		var query = "select date_format(datetime, '%H') as slot, count(id)/1000 as energy from watthours where DATE(datetime) = curdate() group by date_format(datetime, '%H');";

		execQuery(query, null, callback);
	},

	timeline_7days: function(callback) {
		var query = "select date_format(datetime, '%Y-%m-%d') as slot, count(id)/1000 as energy from watthours where DATE(datetime) > date_sub(curdate(), INTERVAL 7 DAY) group by date_format(datetime, '%Y-%m-%d') order by id asc;";

		execQuery(query, null, callback);
	},

	timeline_30days: function(callback) {
		var query = "select date_format(datetime, '%Y-%m-%d') as slot, count(id)/1000 as energy from watthours where DATE(datetime) > date_sub(curdate(), INTERVAL 30 DAY) group by date_format(datetime, '%Y-%m-%d') order by id asc;";

		execQuery(query, null, callback);
	},


};