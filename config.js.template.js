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
    "ipaddress": process.env.OPENSHIFT_NODEJS_IP || "150.214.178.89"
    , "keepAliveSeconds": 80 // Periodicity for KEEP ALIVE messages to be sent
    , "milliSecs": 5*1000 // Periodicity changin problem
    , "port": process.env.OPENSHIFT_NODEJS_PORT || 8080
}
