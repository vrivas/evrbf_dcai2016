  /**
 * @file fn.js
 * @brief Functions to extract data from database
 * @date 21/dic/2015, 12:00
 * @author Victor M. Rivas Santos <vrivas@ujaen.es>
 *         Geneura Team (http://geneura.wordpress.com)
 */
/*
 * --------------------------------------------
 *
 * Copyright (C) 2015 Victor M. Rivas Santos <vrivas@ujaen.es>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

// Test
var nav=db.navigator_dcai_20160108;
var sol=db.solution_dcai_20160108;
function minim() {
    return sol.group(
            {
                "initial": {}
                , "reduce": function (obj, prev) {
                    prev.obj = obj;
                    prev.minim = isNaN(prev.minim) ? obj.tsme.MAPE : Math.min(prev.minim, obj.tsme.MAPE)
                }
            }

    )
}


function solutions( ) {
    return sol.find({"tsme.MSE":{$ne:1e6}});
}


function sortBy( _measure, _numRecords) {
    var fields={ "id": 1}, sorting={}, query={};
    fields["clientID"]=1;
    fields['tsme.'+_measure]=1;
    sorting['tsme.'+_measure]=1;
    query["tsme."+_measure]={$ne:1e6};
    return sol.find(query, fields).limit(_numRecords).sort(sorting);
}

function sortByWithClient( _measure, _numRecords ) {
    var toRet=sortBy( _measure, _numRecords ).toArray();
    var clients=nav.find().toArray();
    return toRet.map(
      function(e) {
        for( var i=0; i<clients.length; ++i ) {
          if( e["clientID"]==clients[i]["clientID"] ){
            e["client"]=clients[i];
            return e;
          }
        }
      }
    );
}

function numClients() {
   return nav.find().length();
}

function numSolutions() {
  return sol.find().length();
}



function clientsByUserAgent( cad ) {
    // Chrome browsers also include "Safari" in their descriptions
    if( cad==="Safari" ) return safari();

    var byQuery=nav.find( { userAgent: new RegExp(cad)}).length();
    var total=numClients();
    return { "query": cad
        , "byQuery": byQuery
        , "total": total
        , "rate": ((byQuery/total)*100).toFixed(2)+"%"
    }
}


function linux() {
    return clientsByUserAgent( "Linux" );
}

function windows() {
    return clientsByUserAgent( "Windows" );
}

function android() {
    return clientsByUserAgent( "Android" );
}


function chrome() {
    return clientsByUserAgent( "Chrome" );
}

function firefox() {
    return clientsByUserAgent( "Firefox" );
}

// Chrome browsers also include "Safari" in their descriptions
function safari() {
    var safari=nav.find( { userAgent: new RegExp("Safari")}).length();
    var chrome=nav.find( { userAgent: new RegExp("Chrome")}).length();
    var byQuery=safari-chrome;
    var total=numClients();
    return { "query": "Safari"
        , "byQuery": byQuery
        , "total": total
        , "rate": ((byQuery/total)*100).toFixed(2)+"%"
    }
}

function clientsSorted() {
    return nav.find({}, {"userAgent":1}).sort( {"userAgent": 1});
}



function os() {
 var oss=clientsSorted().map(
     function(e) {
         return /\(([^)]+)\)/.exec( e.userAgent)[1];
    });

  var toRet=[];
  var lastOS="";
  oss.forEach( function(e) {
   if( e==lastOS )
     toRet[toRet.length-1].count++;
     else {
      toRet.push( {"os": e, "count":1 });
      lastOS=e;
    }
   });
   return toRet;

}

function browsers() {
 var navs=nav.find({}, {"userAgent":1});
 navs=navs.map(
  function(e) {
    return e.userAgent.substr(e.userAgent.search("\\)" )+2)
  })
  .sort();
  var toRet=[];
  var lastBrowser="";
  navs.forEach( function(e) {
   if( e==lastBrowser )
     toRet[toRet.length-1].count++;
     else {
      toRet.push( {"browser": e, "count":1 });
      lastBrowser=e;
    }
   });
   return toRet;
}




function allStats(_numRecords){
  var measures=["MSE",
  , "RMSE"
  , "MAE"
  , "MdAE"
  , "MAPE"
  , "MdAPE"
  , "RMSPE"
  , "RMdSPE"
  , "sMAPE"
  , "sMdAPE"
  , "MASE"
  , "RMSSE"
  , "MdASE"
]
  var toRet=[];
  measures.forEach(
    function(e) {
        toRet.push( {"measure": e,
        "values": stats(e, _numRecords)});
    }
  );
  return toRet;
}

function stats( _measure, _numRecords ) {
  var values=sortBy(_measure, _numRecords).toArray().map( function(e){return e["tsme"][_measure];});
  _numRecords=values.length;
  var average=values.reduce( function(prev,e){return e+prev;},0 )/_numRecords;
  var desvest=values.reduce( function(prev,e,i){return (e-average)*(e-average)+prev;}, 0);
  return {"average":average.toExponential(4), "desvest": desvest.toExponential(4)};
}
