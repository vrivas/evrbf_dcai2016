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




var Experimemt = (
        function (_id
                , _millisecs
                , _initTime
                , _endTime) {

            var id = _id || null;
            var millisecs = _millisecs || null;
            var initTime = _initTime || null;
            var endTime = _endTime || null;
            function _() {
            }

            _.prototype = {
                SetId: function (_p) {
                    return id = _p;
                }
                , GetId: function () {
                    return id;
                }
                , SetMillisecs: function (_p) {
                    return millisecs = _p;
                }
                , GetMillisecs: function () {
                    return millisecs;
                }
                , SetInitTime: function (_p) {
                    return initTime = _p;
                }
                , GetInitTime: function () {
                    return initTime;
                }
                , SetEndTime: function (_p) {
                    return endTime = _p;
                }
                , GetEndTime: function () {
                    return endTime;
                }
            };
            return _;
        })();