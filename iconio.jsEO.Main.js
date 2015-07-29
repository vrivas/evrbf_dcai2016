
/** 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var iconio_jsEO = {
    "fitnessFunction": function (_chr) {
        if (typeof _chr == 'undefined') {
            return null;
        }

        var tmp = 0;
        return (tmp != 0.0) ? 1 / tmp : 1e10;
    }
    , "main": function (data) {
        var verbose = jsEOUtils.getInputParam("verbose", false);
        jsEOUtils.setVerbose(verbose == "true" || verbose == true);
        //jsEOUtils.setProblemId("http://jsEO.vrivas.es/20131030120000_FLOAT" + numCoefs);



        //var myFVGA = new jsEOFVGA(new jsEOOpSendIndividuals(), new jsEOOpGetIndividuals());
        var myFVGA = new jsEOFVGA();

        myFVGA.popSize = parseInt(jsEOUtils.getInputParam("popSize", 500));
        myFVGA.tournamentSize = parseInt(jsEOUtils.getInputParam("tournamentSize", 2));
        myFVGA.xOverRate = parseFloat(jsEOUtils.getInputParam("xOverRate", 10));
        myFVGA.mutRate = parseFloat(jsEOUtils.getInputParam("mutRate", 10));
        myFVGA.mutPower = parseFloat(jsEOUtils.getInputParam("mutPower", 0.5));
        myFVGA.numGenerations = parseInt(jsEOUtils.getInputParam("numGenerations", 50));
        myFVGA.replaceRate = parseFloat(jsEOUtils.getInputParam("replaceRate", 0.5));
        myFVGA.showing = parseInt(jsEOUtils.getInputParam("showing", 3));
        myFVGA.minValue = parseInt(jsEOUtils.getInputParam("minValue", -10));
        myFVGA.maxValue = parseInt(jsEOUtils.getInputParam("maxValue", 10));
        myFVGA.indSize = parseInt(jsEOUtils.getInputParam("indSize", data.length));

        // Instatiating the object to return
        var toRet = new ForecastOutput();
// last number in DATA is realVal so it can not be used
        // Val: Forecasting for last known value
        toRet.SetVal(
                data.length
                );

        // Test: Forecasting for next ("Unknown") value
        toRet.SetTest(
               data.length
                );
        myFVGA.run(iconio_jsEO.fitnessFunction); 
        console.log("jsEO funciona con ", myFVGA.numGenerations)

        return toRet;
    }
}

foreMethods=[]; // !!!!Temporal para que solo llame a este método. Luego hay que quitarlo
//Adding this GA method to the foreMethods array
foreMethods.push(
        {
            "name": "jsEOFVGA"
            , "apply": iconio_jsEO.main
        }
);