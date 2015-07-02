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
     * @param {object} res Object used to send information to the client
     * @returns {undefined}
     */
    infoStart: function (res) {
        var content = "data: " + start.JSONstringify() + "\n\n";
        console.log(content);
        res.write(content);
    },
    /**
     * Callback for the setInterval that watch if it is time to start the experiment
     * @param {object} timer The timer handled by setInterval
     * @param {array} args Contains the res object, needed to commnicate with client
     * @returns {undefined}
     */
    apply: function (timer, args) {
        var now = new Date();
        now.setSeconds(0, 0);
        var res = args[0];
        if (now.getTime() === start.getTime()) {
            clearInterval(timer);
            var content = "data: " + now.JSONstringify() + "\n\n";
            res.write(content);
        }
    }
}

/**
 * Main function
 * @return {undefined}
 */
function main() {

    var http = require('http'),
            url = require('url'),
            path = require("path"),
            fs = require("fs");
    //  Set the environment variables we need.
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    console.log("Trying to start server in ", ipaddress, ":", port, "...\n")

    try {
        var server = http.createServer().listen(port, ipaddress, function () {
            console.log((new Date()) + ' Server is now listening on ' + ipaddress + ":" + port);
        });

        server.on('request', function (req, res) {
            var url_parts = url.parse(req.url, true);
            switch (url_parts.pathname) {
                case '/':
                case '/index.html':
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Request-Method', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    //res.write('<html><body>Hello!</body></html>');

                    fs.readFile("./index.html", "binary", function (err, file) {
                        if (err) {
                            res.writeHead(500, {"Content-Type": "text/plain"});
                            res.write(err + "\n");
                            res.end();
                            return;
                        }

                        res.writeHead(200);
                        res.write(file, "binary");
                        res.end();
                    });
                    break;
                case '/event':
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Request-Method', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.writeHead(200, {"Content-type": "text/event-stream"});
                    cb.infoStart(res);
                    setInterval(cb, 1000, res);
                    break;
                default:
                    res.write('Unknown path: ' + JSON.stringify(url_parts));
            }
            res.end();
        });
    } catch (e) {
        console.log("Error in main: " + e + "\n");
    }
    return 1;
}
main(); // Defines and executes main


