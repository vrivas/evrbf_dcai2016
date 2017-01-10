/**
* @file isafm2017.js
* @brief Functions to perform statistics from experiments for ISAFM
@ @pre This file needs fn.js to have been loaded previously
* @date 21/dic/2016, 12:00
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

/*var navs=[ "navigator_isafm_20161220_chrome_55_0_2883_87"
  , "navigator_isafm_20161220_chromium_55_0_2883_87"
  , "navigator_isafm_20161220_edge_38_14393_0_0"
  , "navigator_isafm_20161220_firefox47"
  , "navigator_isafm_20161220_firefox50_1_0_ls"
  , "navigator_isafm_20161220_firefox50_1_0_ws"
  , "navigator_isafm_20161220_ie_11_0_9600_18537"
  , "navigator_isafm_20161220_safari_10_0_1" ];

var sols=["solution_isafm_20161220_chrome_55_0_2883_87"
  , "solution_isafm_20161220_chromium_55_0_2883_87"
  , "solution_isafm_20161220_edge_38_14393_0_0"
  , "solution_isafm_20161220_firefox47"
  , "solution_isafm_20161220_firefox50_1_0_ls"
  , "solution_isafm_20161220_firefox50_1_0_ws"
  , "solution_isafm_20161220_ie_11_0_9600_18537"
  , "solution_isafm_20161220_safari_10_0_1" ];
*/

var navs=["navigator_20170108_firefox_50_1_0_macs",
, "navigator_20170108_safari_10_0_2_macs"
, "navigator_20170108_firefox_47_0_linuxes"
, "navigator_20170108_chromium_51_0_2704_79_linuxes"
, "navigator_20170108_firefox_50_1_0_androids"
, "navigator_20170108_chrome_55_0_2883_95_macs"
, "navigator_20170108_edge_14_14393"
, "navigator_20170108_chrome_55_0_2883_87_windows"];

var sols=["solution_20170108_firefox_50_1_0_macs",
, "solution_20170108_safari_10_0_2_macs"
, "solution_20170108_firefox_47_0_linuxes"
, "solution_20170108_chromium_51_0_2704_79_linuxes"
, "solution_20170108_firefox_50_1_0_androids"
, "solution_20170108_chrome_55_0_2883_95_macs"
, "solution_20170108_edge_14_14393"
, "solution_20170108_chrome_55_0_2883_87_windows"];



function showSols() {
  var toRet=[];
  sols.forEach(function(e){
    sol=db[e]
    toRet.push( { "db": e,
      "allStats": allStats()});
  });
  return toRet;
}


function showSols_v2() {
  var data=showSols();
  var toRet=[];
  data.forEach(function(e){
    var cad=e.allStats.reduce( function(prev, e) {
      return prev+";"+e.measure+";"+e.values["average"]+";"+e.values["desvest"];
    }, e.db+";");
    toRet.push(cad);
  });
  return toRet;
}


function showSols_v3() {

  var toRet=[];
  for( var e=0; e<sols.length; ++e ) {
    sol=db[sols[e]];
    for( var i=0; i<sol.find().length(); ++i ) {
      toRet.push( { "db":sols[e],
        "stats": sol.find()[i].tsme
        } );
    } 
  }
  return toRet;
}


function showSols_v4() {

  var toRet=[];
  var navegadores=sols.join(";");
  for( var j=0; j<10; ++j ) {
    var cad="MSE;";
    for( var e=0; e<sols.length; ++e ) {
      sol=db[sols[e]];
      cad+=sol.find()[j].tsme["MSE"]+";"
    } 
    toRet.push( cad );
  }
  return toRet;
}









