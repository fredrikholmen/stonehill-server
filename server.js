var express = require("express");
var path = require("path");
var pool = require('./lib/mysql_pool');
var bodyParser = require("body-parser");

//Models
var Power = require('./model/power');

var app = express();
app.use(express.static(__dirname + "/public"));

//bodyParser needs to come before .all
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Expose-Headers', 'X-total-count, X-updating-count');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  //console.log(req.method)
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
})


  // Initialize the app.
  var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;

  console.log("[STONEHILL] Stonehill Server started on port: ", port)
  console.log("[STONEHILL] Welcome to Bergbacken!");  

  });

// STONEHILL API ROUTES BELOW
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */


app.get("/", function(req, res) {
  res.status(201).send(new Date());
});

app.get("/power/effect", function(req, res) {

  Power.effect(function(err, result) {
    if (err) {
      handleError(err, err.message, "Failed to execute power query");
    } else {
      res.status(201).json(result);
    }

  });

});

app.get("/power/today", function(req, res) {

  Power.today(function(err, result) {
    if (err) {
      handleError(err, err.message, "Failed to execute power query");
    } else {
      res.status(201).json(result);
    }

  });

});

app.get("/power/month", function(req, res) {

  Power.month(function(err, result) {
    if (err) {
      handleError(err, err.message, "Failed to execute power query");
    } else {
      res.status(201).json(result);
    }

  });

});

app.get("/power/timeline/minute", function(req, res) {

  Power.timeline_minute(function(err, result) {
    if (err) {
      handleError(err, err.message, "Failed to execute timeline query");
    } else {
      res.status(201).json(result);
    }
  })

});

app.get("/power/timeline/today", function(req, res) {

  Power.timeline_today(function(err, result) {
    if (err) {
      handleError(err, err.message, "Failed to execute timeline query");
    } else {
      res.status(201).json(result);
    }
  })

});

app.get("/power/timeline/7days", function(req, res) {

  Power.timeline_7days(function(err, result) {
    if (err) {
      handleError(err, err.message, "Failed to execute timeline query");
    } else {
      res.status(201).json(result);
    }
  })

});

  app.get("/power/timeline/30days", function(req, res) {

  Power.timeline_30days(function(err, result) {
    if (err) {
      handleError(err, err.message, "Failed to execute timeline query");
    } else {
      res.status(201).json(result);
    }
  })

});

app.post("/contacts", function(req, res) {
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */