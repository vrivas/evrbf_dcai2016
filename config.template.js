/**
 *  @file   config.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    22-Dec-2015 , 20:13
 *  @desc    Specific server's configuration
 *
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */

var GLOBALS = {
    "ipaddress": "192.168.1.33" || process.env.OPENSHIFT_NODEJS_IP
    , "port": 8080 || process.env.OPENSHIFT_NODEJS_PORT
}
