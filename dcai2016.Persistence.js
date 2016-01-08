/** 
 *  @file    dcai2016.Persistence.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    21-dic-2015 , 12:47:16
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
    , date: {type: Date, default: Date.now}
    , clientID: String
    , userAgent: String
});


var solutionSchema = new Schema({
    id: ObjectId
    , date: {type: Date, default: Date.now}
    , problem: String
    , clientID: String
    , rbfnn: String
    , tsme: {
        MSE: Number
        , RMSE: Number
        , MAE: Number
        , MdAE: Number
        , MAPE: Number
        , MdAPE: Number
        , RMSPE: Number
        , RMdSPE: Number
        , sMAPE: Number
        , sMdAPE: Number
        , MASE: Number
        , RMSSE: Number
        , MdASE: Number
    }
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
    , setModels: function (experimentId) {
        this.setNavigatorModel(experimentId);
        this.setSolutionModel(experimentId);
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
            //console.log("Navigator's info stored in DDBB: " + clientId + ", " + userAgent);
        });
    }
    ,
    /**
     * Stores a new Solution in DDBB 
     * @param {NewSolution} aNewSolution
     * @returns {void}
     */
    saveNewSolution: function (problem, clientID, rbfnn, tsme) {
        /*
         console.log("Trying to store a new Solution's  in DDBB: "
         + " Problem: " + problem           
         + " Client ID: " + clientID
         + " RBFNN: " + rbfnn
         + " Errors: " + tsme);
         */
        // Fixing NaN errors
        for( i in tsme ) {
          tsme[i]=(isNaN(tsme[i]))?1e6:tsme[i];
        }
        this.solutionModel.create({
            'problem': problem
            , 'clientID': clientID
            , 'rbfnn': rbfnn
            , 'tsme': tsme
        }
        , function (err, small) {
            if (err)
                return handleError(err);
            else
                return ("New Solution's info stored in DDBB: "
                        + " Problem: " + problem
                        + " Client ID: " + clientID
                        + " RBFNN: " + rbfnn
                        + " Errors: " + tsme);
        });
    }
};
