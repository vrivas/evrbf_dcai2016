/** 
 *  @file    vrivas.Persistence.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    15-dic-2014 , 17:58:16
 *  @desc    Functions used to store information in database
 *  
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */
/// variable storing the db handler
var mongoose = require('mongoose');

var Schema = mongoose.Schema
        , ObjectId = Schema.ObjectId;

/// Fields containing navigators' information
var navigatorSchema = new Schema({
    id: ObjectId
    , clientID: String
    , userAgent: String
    , date: {type: Date, default: Date.now}
});


var solutionSchema = new Schema({
    id: ObjectId
    , problem: String
    , time: String
    , val: Number
    , valReal: Number
    , test: Number
    , expected: Number
    , method: String
    , clientID: String
    , date: {type: Date, default: Date.now}
});

var problemRequestSchema = new Schema({
    id: ObjectId
    , problem: String
    , time: String
    , clientID: String
    , date: {type: Date, default: Date.now}
});


var db = {
    navigatorModel: null
    , solutionModel: null
    , problemRequestModel: null
    , setNavigatorModel: function (experimentId) {
        this.navigatorModel = mongoose.model('navigator_' + experimentId, navigatorSchema);
    }
    , setSolutionModel: function (experimentId) {
        this.solutionModel = mongoose.model('solution_' + experimentId, solutionSchema);
    }
    , setProblemRequestModel: function (experimentId) {
        this.problemRequestModel = mongoose.model('problem_request_' + experimentId, problemRequestSchema);
    }
    , setModels: function (experimentId) {
        this.setNavigatorModel(experimentId);
        this.setSolutionModel(experimentId);
        this.setProblemRequestModel(experimentId);
    }
    , connect: function (server, db) {
        mongoose.connect("mongodb://" + server + "/" + db);
    }
    ,
    /**
     * Saving a new navigator's info in DDBB
     * @param {type} clientId
     * @param {type} userAgent
     * @returns {undefined}
     */
    saveNavigatorInfo: function (clientId, userAgent) {
        this.navigatorModel.create(
                {
                    'clientID': clientId
                    , 'userAgent': userAgent
                }
        , function (err, small) {
            if (err)
                return handleError(err);
            console.log("Navigator's info stored in DDBB: " + clientId + ", " + userAgent);
        });
    }
    ,
    /**
     * Stores a new Solution in DDBB 
     * @param {NewSolution} aNewSolution
     * @returns {void}
     */
    saveNewSolution: function (aNewSolution) {
        this.solutionModel.create(aNewSolution
                , function (err, small) {
                    if (err)
                        return handleError(err);
                    console.log("New Solution's info stored in DDBB: " + aNewSolution.forLog());
                });
    }
    ,
    /**
     * Stores a new Problem Request in the DDBB
     * @param {type} _problem Name of the problem
     * @param {type} _time Time to forecast
     * @param {type} _clientID Client ID
     * @returns {undefined}
     */
    saveProblemRequest: function (_problem
            , _time
            , _clientID) {
        this.problemRequestModel.create(
                {
                    'problem': _problem
                    , 'time': _time
                    , 'clientID': _clientID
                }
        , function (err, small) {
            if (err)
                return handleError(err);
            console.log("New problem request's info stored in DDBB: "
                    + _problem + ", "
                    + _time + ", "
                    + _clientID);
        });
    }

};


function NewSolution(_problem
        , _time
        , _val
        , _valReal
        , _test
        , _expected
        , _method
        , _clientID) {
    //properties/fields 
    this.problem = _problem || null;
    this.time = _time || null;
    this.val = _val || null;
    this.valReal = _valReal || null;

    this.test = _test || null;
    this.expected = _expected || null;
    this.method = _method || null;
    this.clientID = _clientID || null;
}
;

NewSolution.prototype.forLog = function () {
    return "New Solution for " + this.problem
            + " in time " + this.time
            + " Validation solution: " + this.val
            + " Validation expected: " + this.valReal
            + " Test solution: " + this.test
            + " Text expected: " + this.expected
            + " Forecasting method: " + this.method
            + " Client ID: " + this.clientID
            ;
};

