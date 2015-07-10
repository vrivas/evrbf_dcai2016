/** 
 *  @file    vrivas.Experiment.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    19-dic-2014 , 15:05:02
 *  @desc    Class containing info about the experiment
 *  
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */

/**
 * Constructor or class Experiment
 * @param {string} id  Experiment's identifier
 * @param {int} millisecs  Millisecs fro clients to find a solution
 * @param {date} initTime  Date to start the experiment
 * @param {date} endTime  Date to finish the experiment
 * @returns {Experiment}
 */

function Experimemt(_id
        , _millisecs
        , _initTime
        , _endTime) {

    this.id = _id || null;
    this.millisecs = _millisecs || null;
    this.initTime = _initTime || null;
    this.endTime = _endTime || null;
}
