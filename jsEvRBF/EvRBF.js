/**
 * @file jsEVRBF/EvRBF.js
 * @brief Implementation of the EvRBF algorithm
 * @date 24/sep/2015, 12:00
 * @author Victor M. Rivas Santos vrivas@ujaen.es
 *         Geneura Team (http://geneura.wordpress.com)
 */
/*
 * --------------------------------------------
 *
 * Copyright (C) 2015 Victor M. Rivas Santos vrivas@ujaen.es
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 * 
 */
try {

    if (typeof js_evrbf === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEVRBF/EvRBF.js has not been loaded");
    if (typeof js_rbfnn === "undefined")
        throw new ReferenceError("EvRBF won't work since jsRBFNN/RBFNN.js has not been loaded");
    if (typeof jsEOUtils === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEO/core/jsEO.js has not been loaded");
    if (typeof jsEO === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEO/core/jsEOUtils.js has not been loaded");
    // Sortcut for EvRBF's namespace
    ns = js_evrbf;
    ns.jsEvRBF = new Class({
        Extends: jsEOGA // jsEvRBF is a Genetic Algorithm
        , data: [] // Needed to initialize centers, radii, and trn and validation samples
        , numNeurons: 0
        , inputDimension: 0
        , trnValRate: 0.75  // % per training
        , trainIterations: 10
        , trainAlfa: 0.3
        , verbose: false
        , configure: false
        , popSize: 2
        , tournamentSize: 2
        , xOverRate: 0.8
        , mutRate: 0.2
        , mutPower: 0.5
        , numGenerations: 100
        , replaceRate: 0.3
        , getIndividualsRate: 0.0 // Initially, no communication with server is needed
        , showing: 3
        , trnSamples: []
        , valSamples: []
        , initialize: function (
                _data
                , _numNeurons
                , _inputDimension
                , _trnValRate
                , _trainIterations
                , _trainAlfa
                , _opSend
                , _opGet
                , _verbose
                , _configure
                , _popSize
                , _tournamentSize
                , _xOverRate
                , _mutRate
                , _mutPower
                , _numGenerations
                , _replaceRate
                , _getIndividualsRate
                , _showing) {
            if (_data.length <= 0)
                throw new RangeError("Data sent to jsEvRBF has size 0... no neurons and nets could be created");
            if (_numNeurons < 1)
                throw new RangeError("The number of (hidden) neurons is smaller than 1, jsEvRBF can't create nets...");
            if (_inputDimension < 1)
                throw new RangeError("The dimension of the input is smaller than 1, jsEvRBF can't create inputs...");
            if (_inputDimension >= _data.length)
                throw new RangeError("The dimension of the input is greater or equal than data length, jsEvRBF can't create inputs...");
            // Reading parameters
            this.data = _data;
            this.numNeurons = _numNeurons;
            this.inputDimension = _inputDimension;
            this.trnValRate = _trnValRate || jsEOUtils.getInputParam("trnValRate", this.trnValRate);
            this.trainIterations = _trainIterations || jsEOUtils.getInputParam("trainIterations", this.trainIterations);
            this.trainAlfa = _trainAlfa || jsEOUtils.getInputParam("trainAlfa", this.trainAlfa);

            this.verbose = _verbose || jsEOUtils.getInputParam("verbose", this.verbose);
            this.configure = _configure || jsEOUtils.getInputParam("configure", this.configure);
            this.popSize = _popSize || parseInt(jsEOUtils.getInputParam("popSize", this.popSize));
            this.tournamentSize = _tournamentSize || parseInt(jsEOUtils.getInputParam("tournamentSize", this.tournamentSize));
            this.xOverRate = _xOverRate || parseFloat(jsEOUtils.getInputParam("xOverRate", this.xOverRate));
            this.mutRate = _mutRate || parseFloat(jsEOUtils.getInputParam("mutRate", this.mutRate));
            this.mutPower = _mutPower || parseFloat(jsEOUtils.getInputParam("mutPower", this.mutPower));
            this.numGenerations = _numGenerations || parseInt(jsEOUtils.getInputParam("numGenerations", this.numGenerations));
            this.replaceRate = _replaceRate || parseFloat(jsEOUtils.getInputParam("replaceRate", this.replaceRate));
            this.getIndividualsRate = _getIndividualsRate || jsEOUtils.getInputParam("getIndividualsRate", this.getIndividualsRate);
            this.showing = _showing || parseInt(jsEOUtils.getInputParam("showing", this.showing));
            if (typeof _opGet != 'undefined') {
                _opGet.setApplicationRate(this.getIndividualsRate);
            }
            this.parent(_opSend, _opGet);

            jsEOUtils.debugln("Initializing the jsEvRBF object... ");
        }
        , splitTrnVal: function () {
            // Splitting into trn and val
            var numTotalSamples = this.data.length - this.inputDimension; // -1 since the prediction has to be included in the pattern
            var numTrnSamples = Math.floor(numTotalSamples) * this.trnValRate;
            if (numTrnSamples <= 0)
                throw new RangeError("A TRN/VAL rate of " + this.trnValRate + " makes impossible for jsEvRBF to create training samples...");
            if (numTrnSamples >= numTotalSamples)
                throw new RangeError("A TRN/VAL rate of " + this.trnValRate + " makes impossible for jsEvRBF to create validation samples...");
            // Training and validation
            for (var i = 0; i < numTotalSamples; ++i) {
                var tmp = {
                    "input": this.data.slice(i, i + this.inputDimension)
                    , "output": this.data[i + this.inputDimension ]
                };
                if (i < numTrnSamples) {
                    this.trnSamples.push(tmp);
                } else {
                    this.valSamples.push(tmp);
                }

            }

            console.log("  Data: ", this.data);
            console.log("  trnSamples: ", this.trnSamples);
            console.log("  valSamples: ", this.valSamples);
        }

        // The doConfigure method has to be fixed!!!
        , doConfigure: function () {
            var msg = "";
            jsEOUtils.setOutput("jsEOForm");
            jsEOUtils.println("<strong>Configuring EvRBF</strong><br/>");
            msg = "<form method='GET' action='./index.html' name='f1'>";
            msg += "<p>Verbosity: <input type='radio' name='verbose' value='true'>True ";
            msg += "<input type='radio' name='verbose' value='False'>False</p>";
            msg += "<p>Individual size: <input type='text' name='indSize' value='" +
                    this.indSize + "' size='4'></p>";
            msg += "<p>Population size: <input type='text' name='popSize' value='" +
                    this.popSize + "' size='4'></p>";
            msg += "<p>Tournament size: <input type='text' name='tournamentSize' value='" +
                    this.tournamentSize + "' size='4'></p>";
            msg += "<p>CrossOver rate: <input type='text' name='xOverRate' value='" +
                    this.xOverRate + "' size='4'></p>";
            msg += "<p>Mutation rate: <input type='text' name='mutRate' value='" +
                    this.mutRate + "' size='4'></p>";
            msg += "<p>Bits changed by mutator rate: <input type='text' name='mutPower' value='" +
                    this.mutPower + "' size='4'></p>";
            msg += "<p>Number of generations: <input type='text' name='numGenerations' value='" +
                    this.numGenerations + "' size='4'></p>";
            msg += "<p>Replace rate: <input type='text' name='replaceRate' value='" +
                    this.replaceRate + "' size='4'></p>";
            msg += "<p>'Get Individuals' rate: <input type='text' name='getIndividualsRate' value='" +
                    this.getIndividualsRate + "' size='4' readonly></p>";
            msg += "<p>Number of individuals to show: <input type='text' name='showing' value='" +
                    this.showing + "' size='4'></p>";
            msg += "<p>Minimum value for genes: <input type='text' name='minValue' value='" +
                    this.minValue + "' size='4'></p>";
            msg += "<p>Maximum value for genes: <input type='text' name='maxValue' value='" +
                    this.maxValue + "' size='4'></p>";
            msg += "<p><input type='submit' value='Send data'>" +
                    "<input type='reset' value='Reset'></p>";
            msg += "</form>"
            jsEOUtils.clear()
                    .println(msg)
                    .setOutput("jsEOConsole");
        }
        , createIndividuals: function () {
            for (var i = 0; i < this.popSize; ++i) {
                var nNeurons = jsEOUtils.intRandom(1, Math.max(this.numNeurons, this.trnSamples.length));
                // Selecting random different samples from training to act as centers
                var tmpAleat = Array
                        .apply(0, Array(nNeurons))
                        .map(function (e, i) {
                            return i;
                        });
                var centers = [];
                var radii = 1.0;
                for (var j = 0; j < nNeurons; ++j) {
                    var pos = jsEOUtils.intRandom(0, tmpAleat.length - 1);
                    centers.push(this.trnSamples[tmpAleat[pos]].input);
                    tmpAleat[pos] = tmpAleat[tmpAleat.length - 1];
                    tmpAleat.pop();
                    if (j > 0) {
                        radii = Math.max(radii, jsEOUtils.distance(centers[j - 1], centers[j]));
                    }
                }

                //console.log("  Centers: ", centers);
                this.population.addIndividual(
                        new js_rbfnn.RBFNNet(
                                centers.map(function (e) {
                                    return new js_rbfnn.RBFNeuron(e, radii)
                                }))
                        );
            }
        }
        , run: function (_fitFn) {
            // Program
            if (this.configure) {
                this.doConfigure();
                return;
            }


            // Creating the patterns needed by the algorithm
            console.log("Creating patterns,  splitting TRN/VAL ");
            this.splitTrnVal();

            this.population = new jsEOPopulation();
            this.createIndividuals();

            console.log("Training population ");
            var tmpthis = this;
            this.population.getPopulation().
                    forEach(function (e) {
                        e.trainLMS(
                                tmpthis.trnSamples.map(function (e) {
                                    return e.input;
                                }) // INputs
                                , tmpthis.trnSamples.map(function (e) {
                                    return e.output;
                                })// Desired outputs
                                , tmpthis.trainIterations // Iterations
                                , tmpthis.trainAlfa); // Alfa
                    });

            console.log("Evaluating population ");
            this.population.evaluate(_fitFn, this.valSamples);

            console.log("Sorting population ");
            this.population.sort();
            this.population.getPopulation().
                    forEach(function (e, i) {
                        console.log("Net ", i, " fitness ", e.getFitness());
                    });


            this.indivSelector = new jsEOOpSelectorTournament(this.tournamentSize,
                    Math.floor(this.popSize * this.replaceRate));
            this.operSelector = new jsEOOperatorsWheel();
            /*
             this.operSelector.
             addOperator(new jsEOFVOpCrossOver(this.xOverRate));
             this.operSelector.
             addOperator(new jsEOFVOpMutation(this.mutRate,
             this.mutPower,
             this.minValue,
             this.maxValue));
             if (this.opGet) {
             this.operSelector.addOperator(this.opGet);
             }
             
             jsEOUtils.showPop(this.population, "Initial population", this.showing);
             jsEOUtils.println("Average fitness: " + jsEOUtils.averageFitness(this.population));
             this.privateRun(_fitFn, this.numGenerations, this.showing);
             jsEOUtils.showPop(this.population, "Final population", this.showing);
             jsEOUtils.println("Average fitness: " + jsEOUtils.averageFitness(this.population));
             //jsEOUtils.drawStats();
             */
        }

    });

    /**
     * 
     * @param {jsRBFNN} net The net to evaluate
     * @param {Data Samples} valSamples The set of samples for the evaluation
     * @returns {Real data} Used as fitness for the net
     */
    ns.fitnessFunction = function (net, valSamples) {
        var init = 0;
        toRet = valSamples.reduce(function (init, e) {
            return init + jsEOUtils.distance(net.apply(e.input), e.output);
        }, init);
        return (toRet != 0.0) ? 1 / toRet : 1e10;
    }

    /**
     * Function to test if EvRBF works properly
     * @returns {undefined}
     */
    ns.test = function (_id) {
        console.log("Testing jsEvRBF...");
        var data = Array.apply(0, Array(20)).map(function (e, i) {
            return i * 10;
        })
        console.log(data);
        var tmp = new ns.jsEvRBF(data, 2, 3);
        tmp.run(ns.fitnessFunction);
        _id = document.getElementById(_id);
        var msg = "";
        if (_id) {
            _id.innerHTML += "<p>" + msg + "</p>\n";
        } else {
            console.log(msg + "\n");
        }
    };
} catch (e) {
    console.log(e.message);
}

