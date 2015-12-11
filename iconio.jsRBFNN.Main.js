/** 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict;'
var logea = true;
var iconio_jsRBFNN = {
    "centersRate": 0.5
    , "main": function (data) {
        // Creating ts samples from raw data
        // We have to remove 1 since last value is for test
        var sampleSize = Math.floor(Math.random() * (data.length - 1) / 2) + 1;
        var samples = [];
        var centers = [];
        for (var i = 0; i < data.length - 1 - sampleSize; ++i) {
            var sample = {
                "inputs": data.slice(i, i + sampleSize)
                , "output": data[i + sampleSize]
            };
            samples.push(sample);
            if (Math.random() < iconio_jsRBFNN.centersRate) {
                centers.push(sample.inputs);
            }
        }
        // Ensuring at least one center
        if (!centers.length) {
            centers.push(samples[Math.floor(Math.random() * samples.length)].inputs);
        }
        // Computing average distance (for radius)
        var radius = (centers.reduce(function (prev, e, i) {
            return (i == 0 ? 0 : (prev + jsEOUtils.distance(centers[i - 1], e)));
        }, 0)) / centers.length;

        // Fixing radius in case it is 0
        radius=(radius==0)?1:radius;
        
        // Creating net
        var net = new js_rbfnn.RBFNNet(centers.map(function (e) {
            return new js_rbfnn.RBFNeuron(e, radius);
        }));
        
        console.log( "Centers ", centers.length);
        console.log( "Before training val is ", net.apply( samples[samples.length-2].inputs ), "vs ", samples[samples.length-2].output );
        console.log( "Before training tst is ", net.apply( samples[samples.length-1].inputs ) , "vs ", samples[samples.length-1].output );
        
        net.trainLMS(
                samples.map(function (e) {
                    return e.inputs;
                })
                , samples.map(function (e) {
                    return e.output;
                })
                , 30
                , 0.3
                );
        
        if (logea) {
            console.log("net is: ");
            console.log(net);
            logea = false;
        }
        // Instatiating the object to return
        var toRet = new ForecastOutput();
        
        // last number in DATA is realVal so it can not be used
        // Val: Forecasting for last known value
        toRet.SetVal(
                net.apply( samples[samples.length-2].inputs )
                );
        // Test: Forecasting for next ("Unknown") value
        toRet.SetTest(
                net.apply( samples[samples.length-1].inputs )
                );
        
                console.log( "After training val is ", net.apply( samples[samples.length-2].inputs ), "vs ", samples[samples.length-2].output );
        console.log( "After training tst is ", net.apply( samples[samples.length-1].inputs ), "vs ", samples[samples.length-1].output );

        console.log("jsRBFNN running ");
        return toRet;
    }
};

foreMethods = []; // !!!!Temporal para que solo llame a este método. Luego hay que quitarlo
//Adding this GA method to the foreMethods array
foreMethods.push(
        {
            "name": "jsRBFNN"
            , "apply": iconio_jsRBFNN.main
        }
);

