/**
 *  @file   config.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    22-Jun-2015 , 13:47
 *  @desc    Specific server's configuration
 *
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */

var GLOBALS = {
    "ipaddress": "127.0.0.1" || process.env.OPENSHIFT_NODEJS_IP
    , "keepAliveSeconds": 80 // Periodicity for KEEP ALIVE messages to be sent
    , "milliSecs": 5*1000 // Periodicity changin problem
    , "port": 8080 || process.env.OPENSHIFT_NODEJS_PORT
}
