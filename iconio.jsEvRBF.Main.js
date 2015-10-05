/** 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var logea = true;
var iconio_jsEvRBF = {
    "centersRate": 0.5
    , "main": function (data) {
        // Creating ts samples from raw data
        // We have to remove 1 since last value is for test
        var ag=new js_evrbf( data, 2, 3);
        /*
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
            centers.push(samples[Math.floor(Math.random() * trn.length)]);
        }

        // Computing average distance (for radius)
        var radius = (centers.reduce(function (prev, e, i) {
            return (i == 0 ? 0 : prev + js_rbfnn.distance(centers[i - 1], e));
        }, 0)) / centers.length;


        // Creating net
        var net = new js_rbfnn.RBFNNet(centers.map(function (e) {
            return new js_rbfnn.RBFNeuron(e.inputs, radius);
        }));

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
        
        */
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
        console.log("jsEvRBF running ");
        return toRet;
    }
};

foreMethods = []; // !!!!Temporal para que solo llame a este método. Luego hay que quitarlo
//Adding this GA method to the foreMethods array
foreMethods.push(
        {
            "name": "jsEvRBF"
            , "apply": iconio_jsEvRBF.main
        }
);

