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
function ClientInfo(_id) {
    this.id = _id || this.randomClientId();

}
ClientInfo.prototype.randomClientId = function (_p) {
    var letters = "ABCDEFGHIJLKMNOPQRSTUVWXYZabcdefghijklmnrstuvwxyz0987654321";
    var tmp = (new Date()).aaaammddhhmmss() + "-";
    for (var i = tmp.length; i > 0; --i) { // 
        tmp += letters[jsEOUtils.intRandom(0, letters.length - 1)];
    }
    return tmp;
}

ClientInfo.prototype.SetId = function (_id) {
    this.id = _id || this.randomClientId();
    return this.id;
}

ClientInfo.prototype.GetId = function () {
    return this.id;
}

ClientInfo.prototype.SendInfo = function ( _url ) {
    // Enviar info de Navigator
    // $$$
    _url= _url || "/clientInformation";
    $.ajax({
        type: 'POST'
        , url: _url 
        , data: {
            "clientID": this.id
            , "userAgent": navigator.userAgent
        }
        , dataType: 'json'
        , success: function (data) {
            console.log("Information about client succesfully sent to server: " + _url 
                    + "\n Data received: "+data );
        }
        , error: function (xhr, type) {
            console.log("ERROR: Information about client couldn't be sent to server..." + _url);
        }
    });
    return this.id;
};





