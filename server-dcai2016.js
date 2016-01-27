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
eval(fs.readFileSync('./config.js') + '');
//eval(fs.readFileSync('./iconio.Date.js') + '');
eval(fs.readFileSync('./dcai2016.Persistence.js') + '');
//eval(fs.readFileSync('iconio.Experiment.js') + '');


/// Id for the experiment
var experimentId = "DCAI2016FORECASTING"


function distance(data1, data2) {
    return Math.abs(data1 - data2);
}
function minDist(target, cand1, cand2) {
    return(distance(target, cand1) <= distance(target, cand2)) ? cand1 : cand2;
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

function errorMessage(message) {
    return "!!!! " + message;
}
/**
 * Object containing many callbacks dealing with server-client communications
 * @type Object
 */
var cb = {
    /**
     * Saves info about a new client that has connected
     * @param {type} req
     * @param {type} res
     * @param {type} mongoose
     * @returns {undefined}
     */

    saveClientInformation: function (req, res, mongoose) {
        req.body.initTime = Date.now();
        /*
         
         console.log("Client information ");
         for (b in req.body) {
         console.log(b + ": " + req.body[b]);
         }
         */
        // Storing in database
        db.saveNavigatorInfo(req.body["clientID"], req.body["userAgent"]);
        allowCORS(res)
        res.writeHead(200, {"Content-type": "application/json"});
        res.write(JSON.stringify({"message": "ok"}));
        res.send();
    }

    , saveNewSolution: function (req, res) {
        
        //console.log("SaveNewSolution");

                db.saveNewSolution(
                        req.body["problem"]
                        , req.body["clientID"]
                        , req.body["rbfnn"]
                        , req.body["tsme"]
                        );
        
        allowCORS(res)
        res.writeHead(200, {"Content-type": "application/json"});
        res.write(JSON.stringify({"message": "ok"}));
        res.send();
    }
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

    console.log("Server for DCAI2016's experiment started...");

    try {
        // DDBB connection
        //Comentado para mac
        db.setModels(experimentId)
        // Comentado para mac
        db.connect("localhost", "test");

    } catch (e) {
        console.log(
                errorMessage("Error in main due to connection with database: "
                        + e)
                );
    }

    try {
        app.post('/clientInformation', function (req, res) {
            cb.saveClientInformation(req, res, mongoose);
        });

        app.post('/newSolution', function (req, res) {
            cb.saveNewSolution(req, res);
        });
    } catch (e) {
        console.log(errorMessage("Error in main due to any app.ACTION: " + e));
    }

    try {
        console.log("Trying to init server in ", GLOBALS.ipaddress, ":", GLOBALS.port, "...\n");
        server = app.listen(GLOBALS.port, GLOBALS.ipaddress, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Example app listening at http://%s:%s', host, port);
        });
    } catch (e) {
        console.log(errorMessage("Error in main due to app.listen: " + e));
    }

    return 1;
}


/**
 * Main program
 */
main(); // Defines and executes main
