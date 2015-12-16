/** 
 *  @file    iconio.ClientInfo.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    09-jul-2015 , 14:10:02
 *  @desc    Stroing information about web client
 *  
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */

/**
 * Constructor of the class
 * @returns {ClientInfo}
 */
function ClientInfo() {
    this.id = null;
    this.info = null;
}
ClientInfo.prototype.randomClientId = function (_p) {
    var letters = "ABCDEFGHIJLKMNOPQRSTUVWXYZabcdefghijklmnrstuvwxyz0987654321";
    var tmp = (new Date()).aaaammddhhmmss() + "-";
    for (var i = tmp.length; i > 0; --i) { // 
        tmp += letters[jsEOUtils.intRandom(0, letters.length - 1)];
    }
    return tmp;
}

ClientInfo.prototype.SetId = function (_p) {
    this.id = _p || this.randomClientId();
    this.info = {
        "userAgent": navigator.userAgent
        , "timestamp": (new Date()).aaaammddhhmmss()
    }
    // Enviar info de Navigator
    // $$$
    w("Setting id...");
    $.ajax({
        type: 'POST'
        , url: '/clientInformation'
        , data: {
            "clientID": this.id
            , "info": this.info
        }
        , dataType: 'json'
        , success: function (data) {
            console.log(w("Information about client succesfully sent to server..." + data.message));
        }
        , error: function (xhr, type) {
            console.log(w("ERROR: Information about client couldn't be sent to server..."));
        }
    });
    return this.id;
};

ClientInfo.prototype.GetId = function () {
    return this.id;
}

ClientInfo.prototype.GetInfo = function () {
    return this.info;
}



