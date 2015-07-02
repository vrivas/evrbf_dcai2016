/** 
 *  @file    vrivas.Date.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    06-dic-2014 , 14:10:02
 *  @desc    Constants defining the different kinds of events I will use
 *  
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */

/**
 * 
 * @type Object containing the different names of the events to be processed.
 */
var EVENTTYPES = {
    "NEXT EXPERIMENT": "ne" // Date in which a new experiment should start
    , "START EXPERIMENT": "se" // Order to start the new scheduled experiment
    , "RUNNING EXPERIMENT": "re" // Message indicating the experiment is already running
    , "END EXPERIMENT": "ee" // Order to finished the experiment
    , "FINISHED EXPERIMENT": "fe" //Mesage indicating the experiment did finish
    , "SENDING DATA": "sd" // Sending data to the client to be used in forecasting
    , "SENDING BEST FORECASTING": "sbf" // SEnding the best forecasting currently found
    , "KEEP ALIVE": "ka" // Just keep connection alive
};
    