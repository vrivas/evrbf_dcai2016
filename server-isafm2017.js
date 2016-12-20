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
eval(fs.readFileSync('./isafm2017.Persistence.js') + '');
//eval(fs.readFileSync('iconio.Experiment.js') + '');



function help () {
    console.log('\n\
Server for ISAFM experiments.\n\
\n\
Usage:\n\
    node server-isafm2017.js \n\
        --ip 150.214.178.89 \n\
        --port 80 \n\
        --experimentId ISAFM_YYYYMMDD \n\
\n\
\n\
    node server-isafm2017.js --help\n\
\n\
\n\
By Víctor Rivas (vrivas@ujaen.es) 2016\
    ');
}



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

function setParams () {
    if (process.argv.length > 2) {
        for (var i = 2; i < process.argv.length; i += 2) {
            var val = process.argv[i];
            if (val === "--experimentId") {
                PARAMS.experimentId = process.argv[i + 1];
            } else if (val === "--ip") {
                PARAMS.ip = process.argv[i + 1];
            } else if (val === "--port") {
                PARAMS.port = process.argv[i + 1];
            } else if (val === "--help") {
                help();
                process.exit();
            } else {
                parameterError(val);
            }
        }
    }

    var tmpCad = 'Parameters being used: ';
    for (var p in PARAMS) {
        tmpCad += '\n   ' + p + ': ' + PARAMS[p];
    }
    console.log(tmpCad);
}

function parameterError(param) {
    console.log("ERROR WHILE READING PARAMETERS: parameter ", param, " is unknown.");
    console.log("Use --help to get some help.");
    process.exit(1);
}
/**
 * Main function
 * @return {undefined}
 */
function main() {

    setParams();
    // Variables needed by node to act as a server
    var express = require('express');
    var app = express();
    // Serving static files
    app.use(express.static(__dirname + ''));
    app.use(express.bodyParser());

    console.log("Server for ISAFM2017's experiment started...");

    try {
        // DDBB connection
        //Comentado para mac
        db.setModels(PARAMS.experimentId)
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
        console.log("Experiment: ",  PARAMS.experimentId
            ," Trying to init server in ", PARAMS.ip
            , ":", PARAMS.port, "...\n");
        server = app.listen(PARAMS.port, PARAMS.ip  , function () {
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
