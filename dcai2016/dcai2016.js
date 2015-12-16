/**
 * @file d6.js
 * @brief Data and main function for the paper for DCAI'2016
 *  Data has been taken from:
 *   http://fx.sauder.ubc.ca/data.html
 *   British vs US DOllar
 *    31-Dec-1979 > 26-Dec-1983, weekly
 
 * @date 15/dic/2015, 12:00
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

// Namespace for dcai2016 > d6
var d6 = {};
d6.data = [2.2345
            , 2.2610
            , 2.2771
            , 2.2748
            , 2.2600
            , 2.2976
            , 2.3051
            , 2.2783
            , 2.2795
            , 2.2356
            , 2.2227
            , 2.1883
            , 2.1804
            , 2.1479
            , 2.1782
            , 2.2083
            , 2.2566
            , 2.2650
            , 2.2782
            , 2.2884
            , 2.3155
            , 2.3543
            , 2.3248
            , 2.3398
            , 2.3350
            , 2.3408
            , 2.3558
            , 2.3764
            , 2.3745
            , 2.3878
            , 2.3561
            , 2.3627
            , 2.3751
            , 2.3666
            , 2.3849
            , 2.4160
            , 2.4090
            , 2.3889
            , 2.3991
            , 2.3885
            , 2.3968
            , 2.4113
            , 2.4363
            , 2.4377
            , 2.4363
            , 2.4077
            , 2.3806
            , 2.3552
            , 2.3438
            , 2.3314
            , 2.3261
            , 2.3644
            , 2.3819
            , 2.4096
            , 2.3964
            , 2.4123
            , 2.3975
            , 2.3473
            , 2.3249
            , 2.2807
            , 2.2270
            , 2.1960
            , 2.2191
            , 2.2616
            , 2.2497
            , 2.2257
            , 2.1898
            , 2.1599
            , 2.1694
            , 2.1490
            , 2.1135
            , 2.0813
            , 2.0773
            , 2.0660
            , 1.9960
            , 1.9513
            , 1.9883
            , 1.9742
            , 1.9105
            , 1.8902
            , 1.8793
            , 1.8579
            , 1.8556
            , 1.7979
            , 1.7929
            , 1.8438
            , 1.8418
            , 1.8412
            , 1.7894
            , 1.8283
            , 1.8141
            , 1.8050
            , 1.8741
            , 1.8464
            , 1.8232
            , 1.8268
            , 1.8746
            , 1.8902
            , 1.9051
            , 1.9266
            , 1.9456
            , 1.9110
            , 1.8803
            , 1.8843
            , 1.9020
            , 1.9207
            , 1.8724
            , 1.8822
            , 1.8689
            , 1.8624
            , 1.8503
            , 1.8430
            , 1.8321
            , 1.8244
            , 1.8082
            , 1.8053
            , 1.7980
            , 1.7839
            , 1.7585
            , 1.7633
            , 1.7739
            , 1.7852
            , 1.8121
            , 1.8307
            , 1.8008
            , 1.7980
            , 1.7926
            , 1.7770
            , 1.7498
            , 1.7291
            , 1.7310
            , 1.7174
            , 1.7247
            , 1.7488
            , 1.7480
            , 1.7319
            , 1.6991
            , 1.7197
            , 1.7534
            , 1.7231
            , 1.7223
            , 1.7079
            , 1.7122
            , 1.6949
            , 1.6941
            , 1.7106
            , 1.7012
            , 1.6813
            , 1.6728
            , 1.6563
            , 1.6152
            , 1.5948
            , 1.6288
            , 1.6201
            , 1.6114
            , 1.6034
            , 1.6171
            , 1.6164
            , 1.5815
            , 1.5757
            , 1.5400
            , 1.5213
            , 1.5403
            , 1.5435
            , 1.5273
            , 1.5089
            , 1.5066
            , 1.5046
            , 1.4647
            , 1.4671
            , 1.5041
            , 1.5388
            , 1.5485
            , 1.5644
            , 1.5770
            , 1.5670
            , 1.5564
            , 1.5826
            , 1.5843
            , 1.5734
            , 1.5293
            , 1.5350
            , 1.5324
            , 1.5371
            , 1.5280
            , 1.5214
            , 1.5239
            , 1.4989
            , 1.4854
            , 1.5109
            , 1.5178
            , 1.4973
            , 1.4938
            , 1.4968
            , 1.5047
            , 1.4994
            , 1.4893
            , 1.5028
            , 1.5002
            , 1.4969
            , 1.4886
            , 1.4870
            , 1.4800
            , 1.4665
            , 1.4593
            , 1.4423
            , 1.4197
            , 1.4236];
d6.inputDimension = 1;
d6.trnSamples = [];
d6.valSamples = [];
d6.createTrnVal = function () {
    do {
        d6.trnSamples = [];
        d6.valSamples = [];
        for (var i = 0; i < d6.data.length - d6.inputDimension; ++i) {
            if (Math.random() <= 0.5) { // Half the data is used for training+validation
                // 10% is used for validation, 90% for training
                var sample = {
                    "input": d6.data.slice(i, i + d6.inputDimension)
                    , "output": d6.data[i + d6.inputDimension]
                };
                if (Math.random() >= 0.1) {
                    d6.trnSamples.push(sample);
                } else {
                    d6.valSamples.push(sample);
                }
            }
        }
    } while (d6.valSamples.length <= 0); // Just in case
    console.log("TrnSamples tiene ", d6.trnSamples.length + " samples");
    console.log("ValSamples tiene ", d6.valSamples.length + " samples");
}

d6.doForecasting = function (_net) {
    var samples = [];
    // Create samples
    for (var i = 0; i < d6.data.length - d6.inputDimension; ++i) {
        samples.push({
            "input": d6.data.slice(i, i + d6.inputDimension)
            , "output": d6.data[i + d6.inputDimension]
        });
    }
    return samples.map(function (e) {
        return _net.apply(e.input);
    });
}


d6.drawForecasting = function (y, f) {
    var ctx = document.getElementById("forecasting").getContext("2d");
    var data = {
        labels: y.map(function (e, i) {
            return i;
        }),
        datasets: [
            {
                label: "Expected",
                fillColor: "rgba(255,255,255,0.0)",
                strokeColor: "rgba(120,120,220,1)",
                data: y
            }
            , {
                label: "Forecasted",
                fillColor: "rgba(255,255,255,0.0)",
                strokeColor: "rgba(220,120,120,1)",
                //pointColor: "rgba(0,220,0,1)",
                /*pointStrokeColor: "#aaf",
                 pointHighlightFill: "#aaf",
                 pointHighlightStroke: "rgba(220,220,250,1)",*/
                data: f
            }
        ]
    };
    new Chart(ctx).Line(data,
            {
                pointDot: false
                , scaleShowLabels: true
                , legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            });
}
/**
 * Main function: sets some properties and executes the evolutionary algorithm
 * @returns {undefined}
 */
d6.main = function () {
    console.log("Executing jsEvRBF for DCAI'2016...");
    var baseURL = "http://localhost/vrivas/iconio-php/";
    jsEOUtils.setVerbose(eval(jsEOUtils.getInputParam("verbose", false)));
    
    jsEOUtils.setGetURL(baseURL + "sending.php")
    jsEOUtils.setSendURL(baseURL + "receiving.php")
    jsEOUtils.setProblemId("DCAI2016FORECASTING");
    d6.createTrnVal();
    var tmp = new js_evrbf.jsEvRBF(
                    {"data": d6.data
                        , "trnSamples": d6.trnSamples
                        , "valSamples": d6.valSamples
                        , "numNeurons": 7
                        , "inputDimension": d6.inputDimension
                        , "popSize": 10
                        , "replaceRate": .8
                        , "numGenerations": 50*0+2
                        , "mutRate": 0.7
                        , "mutPower": 0.5
                        , "opSend": new jsEOOpSendIndividuals()
                        , "opGet": new jsEOOpGetIndividuals()
                        , "verbose": false
                    }
            );
            //jsEOUtils.setShowing(tmp.popSize);
            tmp.run(js_evrbf.fitnessFunction);
            var expected = d6.data.slice(d6.inputDimension); // Removing the numInputs first elements
            var forecasted = d6.doForecasting(tmp.getPopulation().getAt(0).getChromosome());
            d6.drawForecasting(expected, forecasted);
            console.log("MSE: ", parseFloat(TSEM.MSE(expected, forecasted).toFixed(7)).toExponential())
            console.log("MASE: ", TSEM.MASE(expected, forecasted))
            var msg = "";
            if (typeof _id !== "undefined" && _id) {
                document.getElementById(_id).innerHTML += "<p>" + msg + "</p>\n";
            } else {
                console.log(msg + "\n");
            }
            jsEOUtils.drawAverageFitness2("myChart");
        }