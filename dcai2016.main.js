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
d6.numExecutions = 0; // NUmber of executions in this client
d6.inputDimension = 1; // Dimension for input patterns = centers' dimension
d6.trnSamples = []; // Samples for training
d6.valSamples = []; // Samples for validation
d6.timer = null;
d6.bestFitness = 0; // Best fitness found up to this moment in this client
/**
 * Creates the set of samples for training and validation
 * @returns {d6} Returns d6 itself to concatenate operations
 */
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
    return this;
}

/**
 * Tries to forecast the whole dataset, creating the corresponding inputs-output samples
 * @param {type} _net The RBFNN that performs the forecasting (probably, the best one=population().getAt(0)
 * @returns {Array} THe set of outputs computed by the net; one per sample.
 */
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


/**
 * Draws a graphic with expected values and yielded ones
 * @param {type} y Expected values
 * @param {type} f Yielded values
 * @returns {d6} Returns the object d6 to concatenate operations.
 */
d6.drawForecasting = function (y, f) {
    var ctx = document.getElementById("forecasting").getContext("2d");
    var data = {
        labels: y.map(function (e, i) {
            return !(i%10)?i:"";
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
                , scaleSteps: 10
                , scaleShowLabels: true
                , responsive: true
                , animation: false
                , legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            });
    return this;
}

/**
 * Set an unique id for the client, and stores it in sessionStorage. In case it existed, it makes nothing
 * @returns {d6} Returns the d6 object to concatenate operations
 */
d6.setClientInfo = function () {
    d6.clientInfo = new ClientInfo();
    if (typeof (Storage) !== "undefined") {
        if (typeof (sessionStorage.clientId) !== "undefined") {
            d6.clientInfo.SetId(sessionStorage.clientId);
            jsEOUtils.debugln("Retrieving id stored in session: " + sessionStorage.clientId);
        } else {
            sessionStorage.clientId = d6.clientInfo.SetId();
            d6.clientInfo.SendInfo();
            jsEOUtils.debugln("Storing a new id in session: " + sessionStorage.clientId);
        }
    } else {
        d6.clientInfo.SetId();
        d6.clientInfo.SendInfo();
        jsEOUtils.debugln("Creating (but not storing in session) a new id: " + sessionStorage.clientId);

    }
    return this;
}

/**
 * Sends a new solution to the server to be stored in the DDBB
 * @param {type} _rbfnn The net
 * @param {type} _tsme The time-series measured errors yielded by the net
 * @param {type} _url The url to which data has to be sent
 * @returns {d6} The d6 object to allow concatenation of operations
 */
d6.sendNewSolution = function (_rbfnn, _tsme, _url) {
    _url = _url || "/newSolution";
    $.ajax({
        type: 'POST'
        , url: _url
        , data: {
            "problem": jsEOUtils.getProblemId()
            , "clientID": this.clientInfo.GetId()
            , "rbfnn": JSON.stringify(_rbfnn)
            , "tsme": _tsme // time-series measured errors
        }
        , dataType: 'json'
        , success: function (data) {
            console.log("Information about client succesfully sent to server: " + _url
                    + "\n Data received: " + data);
        }
        , error: function (xhr, type) {
            console.log("ERROR: Information about client couldn't be sent to server..." + _url);
        }
    });
    return this;
};

/**
 * Establishes the values and action for button stopTimer
 * @returns {d6} Returns the d6 object to concatenate operations 
 */
d6.stopTimerActions = function () {
    $("#stopTimer").click(function () {
        if (d6.timer != null) {
            clearTimeout(d6.timer);
            d6.timer = null;
            $(this).hide();
            jsEOUtils.print("<p>Finally, <strong>all the executions have ended!!</strong> Thanks for helping us!</p>")
            jsEOUtils.print("<p>Do you want to <a href='javascript:history.go(0);'>execute a new set of experiments again?</a></p>");
        }
    });
    return this;
}
/**
 * Main function: sets some properties and executes the evolutionary algorithm
 * @returns {undefined}
 */
d6.main = function (maxExecutions) {
    maxExecutions = maxExecutions || 1;
    try {
        console.log("Executing jsEvRBF for DCAI'2016...");

        jsEOUtils.setVerbose(eval(jsEOUtils.getInputParam("verbose", false)));
        jsEOUtils.setProblemId("DCAI2016FORECASTING");
        d6.stopTimerActions();
        d6.setClientInfo();
        d6.createTrnVal();
        var algorithm = new js_evrbf.jsEvRBF(
                {"data": d6.data
                    , "trnSamples": d6.trnSamples
                    , "valSamples": d6.valSamples
                    , "numNeurons": 10
                    , "inputDimension": d6.inputDimension
                    , "tournamentSize": 3
                    , "popSize": 15
                    , "numGenerations": 50
                    , "replaceRate": .2
                    , "xOverRate": .2
                    , "mutRate": 0.8
                    , "mutPower": 0.5
                            //, "opSend": new jsEOOpSendIndividuals()
                            //, "opGet": new jsEOOpGetIndividuals()
                    , "verbose": false
                }
        );
        //jsEOUtils.setShowing(tmp.popSize);
        ++d6.numExecutions;

        // Writting some pre-execution information:
        jsEOUtils.replace( navigator.userAgent, "sp_browser")
                .replace(d6.numExecutions, "sp_numExecutions")
                .replace( d6.numExecutions, "sp_numExecutionsTitle")
                .replace(maxExecutions, "sp_maxExecutions")
                .replace(maxExecutions, "sp_maxExecutionsTitle")
                .replace(((d6.numExecutions / maxExecutions) * 100).toFixed(1)+"%", "sp_percExecutions");

        algorithm.run(js_evrbf.fitnessFunction);
        var tmpFitness = algorithm.getPopulation().getAt(0).getFitness()
        d6.bestFitness = (!tmpFitness || d6.bestFitness > tmpFitness) ? d6.bestFitness : tmpFitness;
        var expected = d6.data.slice(d6.inputDimension); // Removing the numInputs first elements
        var forecasted = d6.doForecasting(algorithm.getPopulation().getAt(0).getChromosome());
        var tsem = TSEM.setOfErrors(expected, forecasted);
        d6.sendNewSolution(algorithm.getPopulation().getAt(0).getChromosome(), tsem);
        d6.drawForecasting(expected, forecasted);
        jsEOUtils.replace(algorithm.getPopulation().getAt(0).getFitness().toFixed(3), "sp_currentFitness")
                .replace(tsem.MAPE.toFixed(3), "sp_currentMAPE")
                .replace(d6.bestFitness.toFixed(3), "sp_bestFitness");

        jsEOUtils.drawAverageFitness2("myChart");
        if (d6.numExecutions < maxExecutions) {
            d6.timer = setTimeout(d6.main, 3000, maxExecutions);
        } else {
            $("#stopTimer").click();
        }
    } catch (e) {
        console.log("Error: d6.main: " + e);
    }
}
