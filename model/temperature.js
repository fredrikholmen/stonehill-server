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
   		var	query = "(select sensor, temperature as temp, humidity as hum from temperature where sensor=1 order by datetime desc limit 1) union (select sensor, temperature as temp, humidity as hum from temperature where sensor=2 order by datetime desc limit 1);";
    	execQuery(query, null, callback);
	},

	today_maxmin: function(callback) {
		//var query = "select round((10*3600)/timestampdiff(SECOND,min(t.datetime), max(t.datetime))) as P from (select * from watthours order by id desc limit 10) t;";
   		var	query = "select sensor as sensor, max(temperature) as max_temp, max(humidity) as max_hum, min(temperature) as min_temp, min(humidity) from temperature where date(datetime) >= curdate() GROUP BY sensor;";
    	execQuery(query, null, callback);
	},

	timeline_minute: function(callback) {
		var query = "select sensor as sensor, date_format(datetime, '%H:%i') as slot, avg(temperature) as temp, avg(humidity) as hum from temperature where datetime >= date_sub(now(), INTERVAL 60 MINUTE) group by sensor, date_format(datetime, '%H:%i') order by id asc;";
		var query = "select t1.slot, t1.max as Outdoor_max, t1.min as Outdoor_min, t1.avg as Outdoor_avg, t2.max as Basement_max, t2.min as Basement_min, t2.avg as Basement_avg from (select date_format(datetime, '%H:%i') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 1 and datetime >= date_sub(now(), INTERVAL 60 MINUTE) group by slot) t1, (select date_format(datetime, '%H:%i') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 2 and datetime >= date_sub(now(), INTERVAL 60 MINUTE) group by slot) t2 where t1.slot = t2.slot;";

		execQuery(query, null, callback);
	},

	timeline_30days: function(callback) {
		//var query = "select sensor as sensor, date_format(datetime, '%Y-%m-%d') as slot, avg(temperature) as temp from temperature where datetime >= date_sub(now(), INTERVAL 30 DAY) group by sensor, date_format(datetime, '%Y-%m-%d') order by id asc;";
		var query = "select t1.slot, t1.max as Outdoor_max, t1.min as Outdoor_min, t1.avg as Outdoor_avg, t2.max as Basement_max, t2.min as Basement_min, t2.avg as Basement_avg from (select date_format(datetime, '%Y-%m-%d') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 1 and datetime >= date_sub(now(), INTERVAL 30 DAY) group by slot) t1, (select date_format(datetime, '%Y-%m-%d') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 2 and datetime >= date_sub(now(), INTERVAL 30 DAY) group by slot) t2 where t1.slot = t2.slot;";
		execQuery(query, null, callback);
	},

	timeline_90days: function(callback) {
		//var query = "select sensor as sensor, date_format(datetime, '%Y-%m-%d') as slot, avg(temperature) as temp from temperature where datetime >= date_sub(now(), INTERVAL 30 DAY) group by sensor, date_format(datetime, '%Y-%m-%d') order by id asc;";
		var query = "select t1.slot, t1.max as Outdoor_max, t1.min as Outdoor_min, t1.avg as Outdoor_avg, t2.max as Basement_max, t2.min as Basement_min, t2.avg as Basement_avg from (select date_format(datetime, '%Y-%m-%d') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 1 and datetime >= date_sub(now(), INTERVAL 90 DAY) group by slot) t1, (select date_format(datetime, '%Y-%m-%d') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 2 and datetime >= date_sub(now(), INTERVAL 90 DAY) group by slot) t2 where t1.slot = t2.slot;";
		execQuery(query, null, callback);
	},

	timeline_today: function(callback) {
		var query = "select sensor as sensor, date_format(datetime, '%H') as slot, avg(temperature) as temp, avg(humidity) as hum from temperature where date(datetime) >= curdate() group by sensor, date_format(datetime, '%H') order by id asc;";
		var query = "select t1.slot, t1.max as Outdoor_max, t1.min as Outdoor_min, t1.avg as Outdoor_avg, t2.max as Basement_max, t2.min as Basement_min, t2.avg as Basement_avg from (select date_format(datetime, '%H') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 1 and date(datetime) >= curdate() group by slot) t1, (select date_format(datetime, '%H') as slot, max(temperature) as Max, min(temperature) as Min, avg(temperature) as Avg from temperature where sensor = 2 and date(datetime) >= curdate() group by slot) t2 where t1.slot = t2.slot;";

		execQuery(query, null, callback);
	}

}