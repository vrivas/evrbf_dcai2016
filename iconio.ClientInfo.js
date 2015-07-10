/** 
 *  @file    iconio.ClientInfo.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    09-jul-2015 , 14:10:02
 *  @desc    Stroing information about web client
 *  
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */

function ClientInfo() {
    var id = null;
}

ClientInfo.prototype.SetId = function (_p) {
    id = _p;
    // Enviar info de Navigator
    // $$$
    w("Setting id...");
    $.ajax({
        type: 'POST'
        , url: '/clientInformation'
        , data: {
            clientId: id,
            userAgent: navigator.userAgent
        }
        , dataType: 'json'
        , success: function (data) {
            console.log(w("Information about client succesfully sent to server..." + data.message));
        }
        , error: function (xhr, type) {
            console.log(w("ERROR: Information about client couldn't be sent to server..."));
        }
    });
    return id;
};

ClientInfo.prototype.GetId = function () {
    return id;
}



