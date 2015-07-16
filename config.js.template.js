/**
 *  @file   config.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    22-Jun-2015 , 13:47
 *  @desc    Specific server's configuration
 *
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */

var _g_now=new Date();
_g_now.setSeconds(0, 0);
var GLOBALS = {
    "ipaddress": "127.0.0.1" || process.env.OPENSHIFT_NODEJS_IP
    , "keepAliveSeconds": 80 // Periodicity for KEEP ALIVE messages to be sent
    , "milliSecs": 1*1000 // Periodicity changing problem
    , "port": 8080 || process.env.OPENSHIFT_NODEJS_PORT
    , "startMinutesDelay": 1 // Time to wait until start experiment (if startHour and startMinute are null
    , "startHour": null || _g_now.getHours() // Change NULL for your desired hour
    , "startMinute": null || _g_now.getMinutes() // change NULL for your desired minute
    , "secondsLasting": 1
}
GLOBALS.initTime=new Date(2015, 7-1, 16, 11, 30, 0, 0)*null // Comment *null to use this date
if( !GLOBALS.initTime )
    GLOBALS.initTime=new Date( _g_now.getTime() + GLOBALS.startMinutesDelay * 60 * 1000 )