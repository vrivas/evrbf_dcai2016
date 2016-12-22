// Execute as: mongo test db-showSols.js
load("fn.js");
load("isafm2017.js");
print( showSols_v2().forEach(printjson) );
