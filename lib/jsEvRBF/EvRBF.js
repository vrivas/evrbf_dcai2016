/* global jsEOUtils, js_evrbf */

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
    if (typeof js_evrbf.CenterMut === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEVRBF/operators.js has not been loaded");
    if (typeof js_rbfnn === "undefined")
        throw new ReferenceError("EvRBF won't work since jsRBFNN/RBFNN.js has not been loaded");
    if (typeof jsEOUtils === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEO/core/jsEO.js has not been loaded");
    if (typeof jsEO === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEO/core/jsEOUtils.js has not been loaded");



    js_evrbf.jsEvRBF = new Class({
        Extends: jsEOGA // jsEvRBF is a Genetic Algorithm
        , data: [] // Needed to initialize centers, radii, and trn and validation samples
        , trnSamples: []
        , valSamples: []
        , numNeurons: 0
        , inputDimension: 0
        , trnValRate: 0.75  // % per training
        , trainIterations: 10
        , trainAlfa: 0.3
        , verbose: false
        , configure: false
        , popSize: 100
        , tournamentSize: 2
        , xOverRate: 0.5
        , mutRate: 0.8
        , mutPower: 0.2
        , numGenerations: 100
        , replaceRate: 0.3
        , getIndividualsRate: 0.0 // Initially, no communication with server is needed

        , initialize: function (params
                // Possible params
                /*
                 _data
                 , _trnSamples
                 , _valSamples
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
                 , _showing
                 */
                ) {
            if (!params.numNeurons || params.numNeurons < 1)
                throw new RangeError("The number of (hidden) neurons is smaller than 1, jsEvRBF can't create nets...");
            if (!params.inputDimension || params.inputDimension < 1)
                throw new RangeError("The dimension of the input is smaller than 1, jsEvRBF can't create inputs...");
            if (params.data && params.data.length > 0 && params.inputDimension >= params.data.length)
                throw new RangeError("The dimension of the input is greater or equal than data length, jsEvRBF can't create inputs...");
            if (params.trnSamples.length > 0 && params.inputDimension != params.trnSamples[0].input.length)
                throw new RangeError("A set of samples for training has been provided, but the value for inputDimension doesn't fit the length of input patterns");

            // Reading parameters
            this.data = params.data || [];
            this.trnSamples = params.trnSamples || [];
            this.valSamples = params.valSamples || [];
            this.numNeurons = params.numNeurons;
            this.inputDimension = params.inputDimension;
            this.trnValRate = params.trnValRate || jsEOUtils.getInputParam("trnValRate", this.trnValRate);
            this.trainIterations = params.trainIterations || jsEOUtils.getInputParam("trainIterations", this.trainIterations);
            this.trainAlfa = params.trainAlfa || jsEOUtils.getInputParam("trainAlfa", this.trainAlfa);
            this.verbose = params.verbose || jsEOUtils.getInputParam("verbose", this.verbose);
            this.configure = params.configure || jsEOUtils.getInputParam("configure", this.configure);
            this.popSize = params.popSize || parseInt(jsEOUtils.getInputParam("popSize", this.popSize));
            this.tournamentSize = params.tournamentSize || parseInt(jsEOUtils.getInputParam("tournamentSize", this.tournamentSize));
            this.xOverRate = params.xOverRate || parseFloat(jsEOUtils.getInputParam("xOverRate", this.xOverRate));
            this.mutRate = params.mutRate || parseFloat(jsEOUtils.getInputParam("mutRate", this.mutRate));
            this.mutPower = params.mutPower || parseFloat(jsEOUtils.getInputParam("mutPower", this.mutPower));
            this.numGenerations = params.numGenerations || parseInt(jsEOUtils.getInputParam("numGenerations", this.numGenerations));
            this.replaceRate = params.replaceRate || parseFloat(jsEOUtils.getInputParam("replaceRate", this.replaceRate));
            this.getIndividualsRate = params.getIndividualsRate || jsEOUtils.getInputParam("getIndividualsRate", this.getIndividualsRate);
            jsEOUtils.setShowing(params.showing || parseInt(jsEOUtils.getInputParam("showing", this.showing)));
            if (typeof params.opGet != 'undefined') {
                params.opGet.setApplicationRate(this.getIndividualsRate);
            }
            this.parent(params.opSend, params.opGet);

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
            if (this.trnSamples.length <= 0)
                throw new RangeError("EvRBF.js: createIndividuals: "
                        + "No neurons and nets could be created since trnSamples.length is " + this.trnSamples.length);
            if (this.popSize <= 0)
                throw new RangeError("EvRBF.js: createIndividuals: "
                        + "No neurons and nets could be created since popSize is " + this.popSize);
            for (var i = 0; i < this.popSize; ++i) {
                var nNeurons = jsEOUtils.intRandom(1, Math.max(1, Math.min(this.numNeurons, this.trnSamples.length)));
                // Selecting random different samples from training to act as centers
                var tmpAleat = Array
                        .apply(0, Array(this.trnSamples.length))
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

                jsEOUtils.debugln(" - Starting the creation of individuals ");
                //console.log("  Centers: ", centers);
                this.population.addIndividual(
                        new js_evrbf.individual(
                                new js_rbfnn.RBFNNet(
                                        centers.map(function (e) {
                                            return new js_rbfnn.RBFNeuron(e, radii)
                                        }))
                                )
                        );
            }
        }
        , run: function (_fitFn) {
            // Program
            if (this.configure) {
                this.doConfigure();
                return;
            }

            if (this.data.length > 0 && (this.trnSamples.length <= 0 || this.valSamples.length <= 0)) {
                // Creating the patterns needed by the algorithm only if data is provide
                // in other case, use trnSamples and valSamples
                jsEOUtils.debugln("Creating patterns,  splitting TRN/VAL ");
                this.splitTrnVal();
            }

            this.population = new jsEOPopulation();
            this.createIndividuals();
            jsEOUtils.debugln("Adding a population of ", this.getPopulation().length, " indiviuals");

            var self = this;
            this.population.getPopulation().
                    forEach(function (e) {
                        e.chromosome
                                .trainLMS(
                                        self.trnSamples.map(function (e) {
                                            return e.input;
                                        }) // INputs
                                        , self.trnSamples.map(function (e) {
                                            return e.output;
                                        })// Desired outputs
                                        , self.trainIterations // Iterations
                                        , self.trainAlfa); // Alfa
                    });

            this.population
                    .evaluate(_fitFn, {"valSamples": this.valSamples})
                    .sort();

            this.indivSelector = new jsEOOpSelectorTournament(this.tournamentSize,
                    Math.floor(this.popSize * this.replaceRate));
            this.operSelector = new jsEOOperatorsWheel();

            var minValue = Math.min.apply(null, this.data);
            var maxValue = Math.max.apply(null, this.data);


            this.operSelector
                    .addOperator(new js_evrbf.XOver(this.xOverRate
                            , this.trnSamples
                            , this.trainIterations
                            , this.trainAlfa))
                    .addOperator(new js_evrbf.CenterMut(this.mutRate
                            , this.mutPower
                            , minValue
                            , maxValue
                            , this.trnSamples
                            , this.trainIterations
                            , this.trainAlfa))
                    .addOperator(new js_evrbf.RadiusMut(this.mutRate
                            , this.mutPower
                            , minValue
                            , maxValue
                            , this.trnSamples
                            , this.trainIterations
                            , this.trainAlfa));

            if (this.opGet) {
                this.operSelector.addOperator(this.opGet);
            }

            //jsEOUtils.showPop(this.population, "Initial population");
            //jsEOUtils.println("Average fitness: " + jsEOUtils.averageFitness(this.population));
            this.privateRun(_fitFn, {"valSamples": this.valSamples}, this.numGenerations);
            //jsEOUtils.showPop(this.population, "Final population");
            //jsEOUtils.println("Average fitness: " + jsEOUtils.averageFitness(this.population));
            //jsEOUtils.drawStats();

        }

    });

    /**
     * 
     * @param {jsRBFNN} net The net to evaluate
     * @param {Object} Params The set of parameters needed to call the fitness function. Needs to include valSamples for the evaluation
     * @returns {Real data} Used as fitness for the net
     */
    js_evrbf.fitnessFunction = function (net, params) {
        if (typeof params.valSamples === 'undefined')
            throw new ReferenceError("js_evrbf.fitnessFunction has been passed params WITHOUT valSamples");

        var init = 0;
        toRet = params.valSamples.reduce(function (init, e) {
            return init + jsEOUtils.distance(net.apply(e.input), e.output);
        }, init);
        return (toRet != 0.0) ? 1 / toRet : 1e10;
    }

    /**
     * Function to test if EvRBF works properly
     * @returns {undefined}
     */
    js_evrbf.test = function (_id) {
        console.log("Testing jsEvRBF...");
        var data = Array.apply(0, Array(20)).map(function (e, i) {
            return i * 10;
        })
        console.log(data);
        var tmp = new js_evrbf.jsEvRBF(data, 2, 3);
        tmp.popSize = 10;
        tmp.replaceRate = 0.75;
        tmp.numGenerations = 300;
        tmp.run(js_evrbf.fitnessFunction);
    };
} catch (e) {
    console.log(e.message);
}

