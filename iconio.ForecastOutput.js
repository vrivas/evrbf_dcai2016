/** 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ForecastOutput(_val, _test) {
    //properties/fields
    this.val = _val || null;
    this.test = _test || null;
}

ForecastOutput.prototype.SetVal=function( _p ) {
    return this.val=_p;
}

ForecastOutput.prototype.GetVal=function( ) {
    return this.val;
}

ForecastOutput.prototype.SetTest=function( _p ) {
    return this.test=_p;
}

ForecastOutput.prototype.GetTest=function( ) {
    return this.test;
}





