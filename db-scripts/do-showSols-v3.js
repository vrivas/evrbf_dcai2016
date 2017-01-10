// Execute as: mongo test db-showSols.js
load("fn.js");
load("isafm2017.js");
print( showSols_v3().forEach(printjson) );
