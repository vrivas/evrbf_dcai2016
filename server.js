/**
 *  @file   server.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    06-dic-2014 , 14:10:02
 *  @desc    Trying to send objects via SSE using JSON
 *
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */
// Including libraries
var fs = require('fs');
eval(fs.readFileSync('config.js') + '');
eval(fs.readFileSync('vrivas.Date.js') + '');
eval(fs.readFileSync('vrivas.EventTypes.js') + '');
eval(fs.readFileSync('vrivas.Model.js') + '');
eval(fs.readFileSync('vrivas.Persistence.js') + '');
//eval(fs.readFileSync('vrivas.Experiment.js') + '');


/// Id for the experiment
var experimentId = null; //"201412191530";


var forecasting = null; //0;

/// Flag to know if the experiment did start or not
var experimentStarted = null;


var forecastingTimer = null;

var keepAliveCount = 0;

var sentProblems=0;

/// Date indicating when the experiment will initTime
var initTime, endTime;
// initTime = new Date(2014, 12 - 1, 6, 11, 30, 0, 0);

// Experiment will initTime in a few minutes from current time

function distance(data1, data2) {
    return Math.abs(data1 - data2);
}
function minDist(target, cand1, cand2) {
    return(distance(target, cand1) <= distance(target, cand2)) ? cand1 : cand2;
}

function setInitTime() {
    // Minutes to wait until experiment starts.
    var minutesDelay = 1;
    initTime = new Date();
    initTime.setSeconds(0, 0); // In order to compare only year, month, date, hours and minutes
    initTime.setTime(initTime.getTime() + minutesDelay * 60 * 1000);
    //initTime.setHours(17, 05, 0, 0);
}

function setEndTime() {

    // Seconds lasting the experiment.
    var secondsDelay = 1;
    endTime = new Date();
    endTime.setSeconds(0, 0); // In order to compare only year, month, date, hours and minutes
    endTime.setTime(initTime.getTime() + secondsDelay * 1000);
}

function setExperimentTime() {
    setInitTime();
    setEndTime();
}
/**
 * Making AJAX and SSE available from everywhere
 * @param {type} res Response to be given to the client
 * @returns {undefined}
 */
function allowCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
}

function setClientId() {
    return (new Date()).getTime() + "" + parseInt(Math.random() * 1e5);
}

function changeForecasting() {
    console.log(nowLog(), ": Values forecasted: ");
    console.log(" Problem  |  toForecast |  bestVal  | bestFore ");
    for (var i = 0; i < model.problems.length; ++i) {
        console.log("  ", model.problems[i]
                , " | ", model.toForecast[forecasting]
                , " | "
                , model.bestValForecasting[model.problems[i]][model.toForecast[forecasting]]
                , " | "
                , model.bestForecasting[model.problems[i]][model.toForecast[forecasting]]
                , " "
                );
    }
    forecasting = (++forecasting) % model.toForecast.length;
}
/**
 * Object containing many callbacks dealing with server-client communications
 * @type Object
 */
var cb = {
    /**
     * Function dealing with calls to /event as part of an event-stream
     */
    processSetEventSource: function (req, res) {
        var now = new Date();
        var clientId = setClientId();
        if (now.getTime() < initTime.getTime()) {
            this.infoStart(res, clientId);
            return;
        }
        if (initTime.getTime() <= now.getTime() && now.getTime() <= endTime.getTime()) {
            this.infoRunning(res, clientId);
            return;
        }
        if (now.getTime() > endTime.getTime()) {
            this.infoFinished(res);
            return;
        }
    }
    /**
     * Information sent to the client when it connects to the server and the
     * experiment is not running yet
     * The information includes:
     * - The kind of message (NEXT EXPERIMENT)
     * - The date when it is supposed to initTime
     * - The seconds remaining
     * @param {object} arguments Set or arguments, being [0] res and [1] req
     * @returns {undefined}
     */
    , infoStart: function (res, clientId) {
        var toSend = {
            eventType: EVENTTYPES["NEXT EXPERIMENT"]
            , initTime: initTime.JSONstringify()
            , endTime: endTime.JSONstringify()
            , seconds: parseInt((initTime - (new Date())) / 1000)
            , clientId: clientId
            , experimentId: experimentId
            , milliSecs: GLOBALS.milliSecs
        };
        var content = "data: " + JSON.stringify(toSend) + "\n\n";
        console.log(content);
        allowCORS(res);
        res.writeHead(200, {"Content-type": "text/event-stream"});
        res.write(content);
        setInterval(this, 1000, res);
    }
    /**
     * Information sent to the client when it connects to the server and
     * the experiment is still running
     * The information includes:
     * - The kind of message (RUNNING EXPERIMENT)
     * - The date when it is supposed to initTime
     * - The seconds remaining
     * @param {object} arguments Set or arguments, being [0] res and [1] req
     * @returns {undefined}
     */
    , infoRunning: function (res, clientId) {
        var toSend = {
            eventType: EVENTTYPES["RUNNING EXPERIMENT"]
            , initTime: initTime.JSONstringify()
            , endTime: endTime.JSONstringify()
            , seconds: parseInt(((new Date() - initTime)) / 1000)
            , clientId: clientId
            , experimentId: experimentId
            , milliSecs: GLOBALS.milliSecs
        };
        var content = "data: " + JSON.stringify(toSend) + "\n\n";
        console.log(content);
        allowCORS(res);
        res.writeHead(200, {"Content-type": "text/event-stream"});
        res.write(content);
    }
    /**
     * Information sent to the client when it connects to the server and
     * the experiment did finished
     * The information includes:
     * - The kind of message (FINISHED EXPERIMENT)
     * - The date when it is supposed to initTime
     * - The seconds remaining
     * @param {object} arguments Set or arguments, being [0] res and [1] req
     * @returns {undefined}
     */
    , infoFinished: function (res) {
        var toSend = {
            eventType: EVENTTYPES["FINISHED EXPERIMENT"]
            , initTime: initTime.JSONstringify()
            , endTime: endTime.JSONstringify()
            , seconds: parseInt(((new Date() - endTime)) / 1000)
            , experimentId: experimentId
        };
        var content = "data: " + JSON.stringify(toSend) + "\n\n";
        console.log(content);
        allowCORS(res);
        res.writeHead(200, {"Content-type": "text/event-stream"});
        res.write(content);
    }
    /**
     * Callback for the setInterval that watch if it is time to initTime the experiment
     * In other case, it sends a keepAlive message
     * @param {object} timer The timer handled by setInterval
     * @param {array} arguments Contains the res object, needed to commnicate with client
     * @returns {undefined}
     */
    , apply: function (timer, arguments) {
        var now = new Date();
        var content = null;
        now.setMilliseconds(0);
        //console.log((new Date()).log() + ": temporizador  " + now.getTime() + " " + initTime.getTime() + "\n");
        if (now.getTime() === initTime.getTime()) {
            if (forecastingTimer) {
                clearInterval(forecastingTimer);
            }
            experimentStarted = true;
            var toSend = {
                eventType: EVENTTYPES["START EXPERIMENT"]
                , initTime: initTime.JSONstringify()
                , endTime: endTime.JSONstringify()
                , seconds: parseInt((endTime.getTime() - now.getTime()) / 1000)
                , experimentId: experimentId
                , milliSecs: GLOBALS.milliSecs
            };
            forecastingTimer = setInterval(changeForecasting, GLOBALS.milliSecs);
            content = "data: " + JSON.stringify(toSend) + "\n\n";
        }

        if (now.getTime() === endTime.getTime()) {
            clearInterval(timer);
            clearTimeout(forecastingTimer)
            var toSend = {
                eventType: EVENTTYPES["END EXPERIMENT"]
                , initTime: initTime.JSONstringify()
                , endTime: endTime.JSONstringify()
                , experimentId: experimentId
                , milliSecs: GLOBALS.milliSecs
            };
            content = "data: " + JSON.stringify(toSend) + "\n\n";
        }

        // If no information has to be sent, just send a keep alive message
        if (!content && keepAliveCount >= GLOBALS.keepAliveSeconds) {

            //19-Jun-2015: Bad JSON if only eventType is sent... don't know why
            var toSend = {
                eventType: EVENTTYPES["KEEP ALIVE"]
                , initTime: initTime.JSONstringify()
                , endTime: endTime.JSONstringify()
                , experimentId: experimentId
                        //, milliSecs: milliSecs
            };
            content = "data: " + JSON.stringify(toSend) + "\n\n";
            keepAliveCount = 0;
        } else {
            ++keepAliveCount;
        }

        if (content) {
            // arguments[0] is the res object
            arguments[0].write(content);
            console.log(content);
        }
    }
    /**
     * Callback to respond a data petition from client
     * @param {object} timer The timer handled by setInterval
     * @param {array} arguments Contains the res object, needed to commnicate with client
     * @returns {undefined}
     */
    , getData: function (req, res) {
        allowCORS(res)
        res.writeHead(200, {"Content-type": "application/json"});
        console.log(req);
        /*
         var now = new Date();
         now.setSeconds(0, 0);
         var res = res;
         if (now.getTime() === initTime.getTime()) {
         clearInterval(timer);
         var tmp = {eventType: EVENTTYPES["SEND DATA"], date: initTime.JSONstringify()};
         var content = "data: " + JSON.stringify(tmp) + "\n\n";
         res.write(content);
         }
         */
    }
    , clientInformation: function (req, res, mongoose) {
        req.body.initTime = Date.now();
        console.log("Client information ");
        for (b in req.body) {
            console.log(b + ": " + req.body[b]);
        }

// Storing in database
        db.saveNavigatorInfo(req.body["clientId"], req.body["userAgent"]);
        allowCORS(res)
        res.writeHead(200, {"Content-type": "application/json"});
        res.write(JSON.stringify({"message": "ok"}));
        res.send();
    }

    , takeANewSolution: function (req, res) {
        for (b in req.body) {
            console.log(b + ": " + req.body[b]);
        }

        console.log(nowLog() + ": New Solution for " + req.body["problem"]
                + " in time " + req.body["time"]
                + " Validation solution: " + req.body["valPrediction"]
                + " Test solution: " + req.body["testPrediction"]
                + " Forecasting method: " + req.body["method"]
                + " Client ID: " + req.body["client"]
                );
        model.bestValForecasting[req.body["problem"]][req.body["time"]] = req.body["valPrediction"];
        model.bestForecasting[req.body["problem"]][req.body["time"]] = req.body["testPrediction"];
        allowCORS(res)
        res.writeHead(200, {"Content-type": "application/json"});
        res.write(JSON.stringify({"message": "ok"}));
        res.send();
    }
    , giveMeAProblem: function (req, res) {
        var
                nData = 2 + Math.floor(Math.random() * 50)  // 50: Magic number ???
                , ddbb = model.problems[Math.floor(Math.random() * model.problems.length)]
                , time = model.toForecast[forecasting]
                , bestVal = model.bestValForecasting[ddbb][time]
                , realVal = model.data[model.indexes[ddbb.substr(0, 3)][time] - 1]

        allowCORS(res)
        res.writeHead(200, {"Content-type": "application/json"});
        var sliceEnd = model.indexes[ddbb.substr(0, 3)][time],
                sliceIni = sliceEnd - nData;
        var toSend = {
            message: "sendingAProblem"
            , ddbb: ddbb
            , time: time
            , bestVal: bestVal
            , realVal: realVal
            , data: model.data.slice(sliceIni, sliceEnd)
        };
        res.write(JSON.stringify(toSend));
        res.send();
        ++sentProblems;
        /*console.log(nowLog(), ": Sending a problem ", JSON.stringify(toSend)
                , " Slice ini: ", sliceIni
                , " Slice end: ", sliceEnd);*/

    }
    /*, keepAlive: function (req, res) {
     allowCORS(res)
     res.writeHead(200, {"Content-type": "application/json"});
     var toSend = {
     message: "keepingAlive"
     , data: ""
     };
     res.write(JSON.stringify(toSend));
     console.log(nowLog(), ": Keeping Alive ", JSON.stringify(toSend));
     res.send();
     }*/
};
/**
 * Main function
 * @return {undefined}
 */
function main() {

    // Variables needed by node to act as a server
    var express = require('express');
    var app = express();
    // Serving static files
    app.use(express.static(__dirname + ''));
    app.use(express.bodyParser());

    // Setting the initial and final time for the experiment
    setExperimentTime();
    // Setting parameters for the experiment
    experimentId = initTime.aaaammddhhmm();
    forecasting = 0;
    console.log("Experiment " + experimentId
            + " scheduled at " + initTime.log()
            + " (i.e. " + Math.floor((initTime.getTime() - Date.now()) / 1000) + " seconds)"
            + " starting to forecast at " + model.toForecast[forecasting]
            + " and changing problem every " + GLOBALS.milliSecs + " milliseconds "
            + "...\n");
    experimentStarted = false;

    try {
        // DDBB connection
        //Comentado para mac
        db.setNavigatorsModel(experimentId)
        // Comentado para mac
        db.connect("localhost", "test");

    } catch (e) {
        console.log("Error in main due to connection with database: " +
                e + "\n");
    }

    try {
        app.get('/setEventSource', function (req, res) {
            cb.processSetEventSource(req, res);
        });
        app.get('/getData', function (req, res) {
            cb.getData(req, res);
        });
        app.post('/clientInformation', function (req, res) {
            cb.clientInformation(req, res, mongoose);
        });
        app.get('/giveMeAProblem', function (req, res) {
            cb.giveMeAProblem(req, res);
        });

        app.post('/takeANewSolution', function (req, res) {
            cb.takeANewSolution(req, res);
        });
    } catch (e) {
        console.log("Error in main due to any app.ACTION: " + e + "\n");
    }

    try {
        console.log("Trying to initTime server in ", GLOBALS.ipaddress, ":", GLOBALS.port, "...\n");
        server = app.listen(GLOBALS.port, GLOBALS.ipaddress, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Example app listening at http://%s:%s', host, port);
        });
    } catch (e) {
        console.log("Error in main due to app.listen: " + e + "\n");
    }

    return 1;
}


/**
 * Main program
 */
main(); // Defines and executes main
