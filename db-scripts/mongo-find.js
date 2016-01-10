/**
 * @file mongo-find
 * @brief Put the description here!!!!
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

function all() {
    return sol.find();
}

function sortByMape(_numRecords) {
    return sol.find({}, {"_id": 1, "tsme.MAPE": 1}).limit(_numRecords).sort({"tsme.MAPE": 1});
}

function sortBy( _measure, _numRecords) {
    var fields={ "id": 1}, sorting={};
    fields['tsme.'+_measure]=1;
    sorting['tsme.'+_measure]=1;
    
    return sol.find({}, fields).limit(_numRecords).sort(sorting);
}


function numClients() {
   return nav.find().length();
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
 return clientsSorted().map( 
     function(e) {
         return /\(([^)]+)\)/.exec( e.userAgent)[1];
    });
}

function browsers() {
 var navs=nav.find({}, {"userAgent":1});
 return navs.map(
  function(e) {
    return e.userAgent.substr(e.userAgent.search("\\)" )+2)
  })
  .sort();
}