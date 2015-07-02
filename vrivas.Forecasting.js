/** 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Forecasting = (function(_val, _test ) {
  //properties/fields
  var val = _val || null;
  var test = _test || null;

  function _() {}
		
  _.prototype = {
    SetVal: function(_val) { return val=_val }
    ,GetVal: function() { return val; }
    ,SetTest: function( _test ) { return test=_test; }
    ,GetTest: function() {return test;}
  };

  return _;
})();



