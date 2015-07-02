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
eval(fs.readFileSync('vrivas.Date.js') + '');


// Defining global variables
/// Date indicating when the experiment will start
var start;
// start = new Date(2014, 12 - 1, 6, 11, 30, 0, 0);
// Experiment will start in a few minutes from current time
start = new Date();
start.setSeconds(0, 0); // In order to compare only year, month, date, hours and minutes
start.setTime(start.getTime() + 2 * 60 * 1000);

/**
 * Object containing many callbacks dealing with server-client communications
 * @type Object
 */
var cb = {
    /**
     * Information sent to the client when it connects to the server
     * @param {object} response Object used to send information to the client
     * @returns {undefined}
     */
    infoStart: function (response) {
        var content = "data: " + start.JSONstringify() + "\n\n";
        console.log(content);
        response.write(content);
    },
    /**
     * Callback for the setInterval that watch if it is time to start the experiment
     * @param {object} timer The timer handled by setInterval
     * @param {array} args Contains the response object, needed to commnicate with client
     * @returns {undefined}
     */
    apply: function (timer, args) {
        var now = new Date();
        now.setSeconds(0, 0);
        var response = args[0];
        if (now.getTime() === start.getTime()) {
            clearInterval(timer);
            var content = "data: " + now.JSONstringify() + "\n\n";
            response.write(content);
        }
    }
}

/**
 * Main function
 * @return {undefined}
 */
function main() {
    var http = require("http");
    //  Set the environment variables we need.
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    console.log("Trying to start server in ", ipaddress, ":", port, "...\n")

    try {
        http.createServer(function (request, response) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Request-Method', '*');
            response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            response.setHeader('Access-Control-Allow-Headers', '*');
            response.writeHead(200, {"Content-type": "text/event-stream"});
            cb.infoStart(response);
            setInterval(cb, 1000, response);

        }).listen(port, ipaddress, function () {
            console.log((new Date()) + ' Server is now listening on ' + ipaddress + ":" + port);
        });
    } catch (e) {
        console.log("Error in main: " + e + "\n");
    }
    return 1;
}
main(); // Defines and executes main
