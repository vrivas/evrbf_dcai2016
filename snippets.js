/** 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Trozos de código por si hay que reutilizar


// Separación trn + tst
var iconio_jsRBFNN = {
    "trnRate": 0.75
    , "centersRate": 0.5
    , "main": function (data) {

        // Turning data into patterns for trn+tst
        // We have to remove 1 since last value is for test
        var sampleSize = Math.floor(Math.random() * (data.length - 1) / 2) + 1;
        var trn = [];
        var tst = [];
        var centers = [];
        for (var i = 0; i < data.length - 1 - sampleSize; ++i) {
            var sample = {
                "inputs": data.slice(i, i + sampleSize)
                , "output": data[i + sampleSize]
            };
            if (Math.random() < iconio_jsRBFNN.trnRate) {
                trn.push(sample);
            } else {
                tst.push(sample);
            }
            if (Math.random() < iconio_jsRBFNN.centersRate) {
                centers.push(sample.inputs);
            }
        }

        // Ensuring at least one sample for test and centers
        if (!tst.length) {
            tst.push(trn.pop());
        }

        if (!centers.length) {
            centers.push(trn[Math.floor(Math.random() * trn.length)]);
        }

        // Computing average distance (for radius)
        var radius = (centers.reduce(function (prev, e, i) {
            return (i == 0 ? 0 : prev + jsEOUtils.distance(centers[i - 1], e));
        }, 0)) / centers.length;


        // Creating net
        var net = new js_rbfnn.RBFNNet(trn.map(function (e) {
            return new js_rbfnn.RBFNeuron(e.inputs, radius);
        }));
        
        net.LMStrain(
                trn.map(function (e) {
                    return e.inputs;
                })
                , trn.map(function (e) {
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
                data.length
                );
        // Test: Forecasting for next ("Unknown") value
        toRet.SetTest(
                data.length
                );
        console.log("jsRBFNN funcionando ");
        return toRet;
    }
}
