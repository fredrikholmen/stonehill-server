/**
 * Temperature module
 * @module Temperature
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

	current: function(callback) {
		//var query = "select round((10*3600)/timestampdiff(SECOND,min(t.datetime), max(t.datetime))) as P from (select * from watthours order by id desc limit 10) t;";
   		var	query = "SELECT s.id as sensor_id, s.name as sensor, avg(temperature) as temp, avg(humidity) as hum FROM temperature t, sensors s where s.id = t.`sensor` and datetime >= date_sub(now(), INTERVAL 40 MINUTE) GROUP BY sensor;";
    	execQuery(query, null, callback);
	},

	today_maxmin: function(callback) {
		//var query = "select round((10*3600)/timestampdiff(SECOND,min(t.datetime), max(t.datetime))) as P from (select * from watthours order by id desc limit 10) t;";
   		var	query = "select sensor as sensor, max(temperature) as max_temp, max(humidity) as max_hum, min(temperature) as min_temp, min(humidity) from temperature where date(datetime) >= curdate() GROUP BY sensor;";
    	execQuery(query, null, callback);
	},

	timeline_minute: function(callback) {
		var query = "select sensor as sensor, date_format(datetime, '%H:%i') as slot, avg(temperature) as temp, avg(humidity) as hum from temperature where datetime >= date_sub(now(), INTERVAL 60 MINUTE) group by sensor, date_format(datetime, '%H:%i') order by id asc;";

		execQuery(query, null, callback);
	},

	timeline_today: function(callback) {
		var query = "select sensor as sensor, date_format(datetime, '%H') as slot, avg(temperature) as temp, avg(humidity) as hum from temperature where date(datetime) >= curdate() group by sensor, date_format(datetime, '%H') order by id asc;";

		execQuery(query, null, callback);
	}

}