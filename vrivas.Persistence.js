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
var navigatorsSchema = new Schema({
    id: ObjectId
    , clientId: String
    , userAgent: String
    , date: {type: Date, default: Date.now}
});

var db = {
    navigatorsModel: null
    , setNavigatorsModel: function( experimentId ) {
        this.navigatorsModel= mongoose.model('navigators_'+experimentId, navigatorsSchema);
    }
    , connect: function(server, db) {
        mongoose.connect("mongodb://" + server + "/" + db);
    }
    , saveNavigatorInfo: function(clientId, userAgent) {
        this.navigatorsModel.create(
                {
                    'clientId': clientId
                    , 'userAgent': userAgent
                }
        , function(err, small) {
            if (err)
                return handleError(err);
            console.log("Navigator's info stored in DDBB: " + clientId + ", " + userAgent);
        });
    }
};
