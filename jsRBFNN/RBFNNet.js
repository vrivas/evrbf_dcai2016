/**
 * @file jsRBFNN/namespace.js
 * @brief Namespace and common functions for RBFNNets
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
// Testing the existence of required libraries
    if (typeof js_rbfnn === "undefined")
        throw new ReferenceError("RBFNNet won't work since jsRBFNN/namespace.js was not loaded.");
    if (typeof js_rbfnn.RBFNeuron === "undefined")
        throw new ReferenceError("RBFNNet won't work since jsRBFNN/RBFNeuron.js was not loaded.");
    if (typeof jsEO === "undefined")
        throw new ReferenceError("RBFNNet won't work since jsEO was not loaded.");
    /**
     * RBFNN (for RBFNN) constructor. Produces a SINGLE OUTPUT
     * @param {array of RBFNeuron} _neurons The neurons of the hidden layer
     * @param {array of floats} _weights Weights from neurons to otuput
     * @param {float} _bias The "extra" weight
     * @returns {Neuron}
     */

    js_rbfnn.RBFNNet = new Class({
        Extends: jsEO // An RBFNNet is an EO
        , initialize: function (_neurons, _weights, _bias) {
            /// Initalize jsEO
            this.parent();
            /// Array storing the neurons of the hidden layer
            this.neurons = (typeof _neurons !== 'undefined') ? _neurons.slice() : [];
            /// Array storing the weights from every hidden neuron to the output; 1 by default
            this.weights = (typeof _weights !== 'undefined') ? _weights.slice() : this.neurons.map(function () {
                return 1;
            });
            /// Bias (and "extra-weigth")
            this.bias = _bias || 0;
            jsEOUtils.debugln("Initializing a RBFNNet ");
        }
        /**
         * Obtanis an output given an entry point using the different neurons
         * @param {array of floats} _point
         * @returns {Number} The neuron¡s output
         */
        , apply: function (_point) {
            var b = this.bias;
            var w = this.weights;
            return this.neurons.reduce(function (prev, e, i) {
                return prev + e.apply(_point) * w[i];
            }
            , this.bias);
        }
        /**
         * Creates a new net with the same that this one has
         * @returns {RBFNNet} The ew net we have cretaed
         */
        , copy: function () {
            jsEOUtils.debugln("Copying a RBFNNet ");
            return  new js_rbfnn.RBFNNet(this.neurons.map(function (e) {
                return e.copy();
            })
                    , this.weights.slice()
                    , this.bias);
        }
        /**
         * Using LMS to train a network
         * @param {Array of arrays of float} _inputs
         * @param {Array of floats} _outputs
         * @param {Number} _numIt
         * @param {Number} _alfa
         * @returns {Nothing}
         */
        , trainLMS: function (_inputs, _outputs, _numIt, _alfa) {
            if (_inputs.length != _outputs.length)
                throw new RangeError("LMS train can't be done: "
                        + "inputs and outputs have different lengths; "
                        + _inputs.length + " vs " + _outputs.length);
            for (var i = 0; i < _numIt; ++i) {
                var rndInputs = [];
                // Fills rndInputs with numbers 0 to _inputs.length
                _inputs.map(function (e, i) {
                    rndInputs[i] = i;
                });
                // For every input in the inputs vector
                for (var j = rndInputs.length; j > 0; --j) {
                    var pos = Math.floor(Math.random() * j);
                    var netsOutput = this.apply(_inputs[pos]);
                    var error = _outputs[pos] - netsOutput;
                    var neuronsEval = this.neurons.map(function (e) {
                        return e.apply(_inputs[pos]);
                    });
                    var mod = Math.sqrt(neuronsEval.reduce(function (prev, e) {
                        return prev + e * e;
                    }, this.bias)); //neuronEval of "bias" is 1; so, adding bias

                    mod = mod == 0 ? 0.000000001 : mod;
                    for (var k = 0; k < this.weights.length; ++k) {
                        this.weights[k] += _alfa * (error * neuronsEval[k] / mod);
                    }
                    this.bias += _alfa * error / mod;
                    // Overwrites the chosen position
                    rndInputs[pos] = rndInputs[j - 1];
                }
            } // i for iterations
        }

    });
    /**
     * Function to test if RBFNNet works properly
     * @returns {undefined}
     */
    js_rbfnn.test = function (_id) {
        var tmp = new js_rbfnn.RBFNNet(
                [new js_rbfnn.RBFNeuron([-100, -100], 1)
                            , new js_rbfnn.RBFNeuron([100, 100], 10)]
                , [10, 20]
                , 100);
        _id = document.getElementById(_id);
        var msg = "";
        msg = "Before training: \n"
                + "     700 is " + tmp.apply([-100, -100]) + "\n"
                + "     , -700 is " + tmp.apply([100, 100]);
        tmp.setFitness(jsEOUtils.distance([700, -700], [tmp.apply([-100, -100]), tmp.apply([100, 100])]));
        msg += "\n"
                + "Error is " + tmp.getFitness();
        if (_id) {
            _id.innerHTML += "<p>" + msg + "</p>\n";
        } else {
            console.log(msg + "\n");
        }
        tmp.trainLMS([
            [-100, -100], [100, 100] // Inputs
        ]
                , [700, -700] // Desired outputs
                , 100 // Iterations
                , 0.3); // Alfa

        msg = "After training: \n"
                + "     700 is " + tmp.apply([-100, -100]) + "\n"
                + "     , -700 is " + tmp.apply([100, 100]);
        tmp.setFitness(jsEOUtils.distance([700, -700], [tmp.apply([-100, -100]), tmp.apply([100, 100])]));
        msg += "\n"
                + "Error is " + tmp.getFitness();
        if (_id) {
            _id.innerHTML += "<p>" + msg + "</p>\n";
        } else {
            console.log(msg + "\n");
        }


        console.log("\n\nTesting copy...\n\n");
        tmp2 = tmp.copy();
        console.log("Before changing...");
        console.log("Original is ", tmp.neurons[0].center[0]);
        console.log("Copy is ", tmp2.neurons[0].center[0]);
        tmp2.neurons[0].center[0] = 9876;
        console.log("After changing tmp2.neurons[0].center[0] to 9876...");
        console.log("Original is ", tmp.neurons[0].center[0]);
        console.log("Copy is ", tmp2.neurons[0].center[0]);


    };
} catch (e) {
    console.log(e.message);
}
