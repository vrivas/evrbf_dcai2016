/* global js_evrbf, e, jsEOUtils, jsEOOperator */

/**
 * @file operators
 * @brief Set of operators in Javascript for EvRBF
 * @date 15/oct/2015, 12:00
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


try {

    if (typeof js_evrbf === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEVRBF/EvRBF.js has not been loaded");
    if (typeof jsEOOperator === "undefined")
        throw new ReferenceError("EvRBF won't work since jsEO/core/jsEOperator.js has not been loaded");
    /**
     * XOver Mutator... transitory until re-reading the original paper
     * @type Class
     */
    js_evrbf.XOver = new Class({
        Extends: jsEOOperator,
        initialize: function (_applicationRate, _trnSamples, _trainIterations, _trainAlfa) {
            this.parent(_applicationRate);
            this.trnSamples = _trnSamples || [];
            this.trainIterations = _trainIterations || 1;
            this.trainAlfa = _trainAlfa || 0;
            jsEOUtils.debugln("Initializing a js_evrf.XOver with"
                    + " applicationRate " + this.applicationRate);
        },
        operate: function (_auxPop) {
            jsEOUtils.debugln("Applying js_evrf.XOver ");
            //console.log("Applying js_evrf.XOver");
            var ch0 = _auxPop.getAt(0).getChromosome().copy();
            var ch1 = _auxPop.getAt(1).getChromosome().copy();
            var chX = ch0.copy();

            var p0_ini = jsEOUtils.intRandom(0, ch0.size() - 1);
            var p0_end = jsEOUtils.intRandom(p0_ini + 1, ch0.size() - 1);
            var p1_ini = jsEOUtils.intRandom(0, ch1.size() - 1);
            var p1_end = jsEOUtils.intRandom(p1_ini + 1, ch1.size() - 1);
            /*
             console.log("Chromosome 0: size: " + ch0.size() + ", ini: " + p0_ini + ", end: " + p0_end
             , "Chromosome 1: size: " + ch1.size() + ", ini: " + p1_ini + ", end: " + p1_end);
             */
            // Interchanging neurons
            ch0.neurons = ch0.neurons.slice(0, p0_ini).concat(ch1.neurons.slice(p1_ini, p1_end)).concat(ch0.neurons.slice(p0_end, ch0.neurons.length));
            ch1.neurons = ch1.neurons.slice(0, p1_ini).concat(chX.neurons.slice(p0_ini, p0_end)).concat(ch1.neurons.slice(p1_end, ch1.neurons.length));


            ch0.trainLMS(
                    this.trnSamples.map(function (e) {
                        return e.input;
                    }) // INputs
                    , this.trnSamples.map(function (e) {
                        return e.output;
                    })// Desired outputs
                    , this.trainIterations // Iterations
                    , this.trainAlfa);
            ch1.trainLMS(
                    this.trnSamples.map(function (e) {
                        return e.input;
                    }) // INputs
                    , this.trnSamples.map(function (e) {
                        return e.output;
                    })// Desired outputs
                    , this.trainIterations // Iterations
                    , this.trainAlfa);
            return (new jsEOPopulation())
                    .add(new js_evrbf.individual(ch0))
                    .add(new js_evrbf.individual(ch1));
        }
    });


    /**
     * Centers Mutator...transitory until re - reading the original paper
     * @type Class
     */
    js_evrbf.CenterMut = new Class({
        Extends: jsEOOperator,
        initialize: function (_applicationRate, _centersRate, _min, _max, _trnSamples, _trainIterations, _trainAlfa) {
            this.parent(_applicationRate);
            this.centersRate = _centersRate || 0.5;
            this.min = _min || 0;
            this.max = _max || 1;
            this.trnSamples = _trnSamples || [];
            this.trainIterations = _trainIterations || 1;
            this.trainAlfa = _trainAlfa || 0;
            jsEOUtils.debugln("Initializing a js_evrf.CenterMut with"
                    + " applicationRate " + this.applicationRate
                    + " and centersRate " + this.centersRate
                    + " values between " + _min + " and " + _max
                    );
        },
        operate: function (_auxPop) {
            jsEOUtils.debugln("Applying js_evrf.CenterMut");
            //console.log("Applying js_evrf.CenterMut with values" + this.min + " and " + this.max);

            var tmpChr = _auxPop.getAt(0).getChromosome().copy();
            var self = this;
            // Changing the values of the centers for those neurons selected according to this.centersRate
            tmpChr.neurons
                    .filter(function () {
                        return Math.random() <= self.centersRate;
                    })
                    .forEach(function (e) {
                        e.center.forEach(function (e, i, v) {
                            v[i] = jsEOUtils.random(self.min, self.max);
                        });
                    });
            tmpChr.trainLMS(
                    this.trnSamples.map(function (e) {
                        return e.input;
                    }) // INputs
                    , this.trnSamples.map(function (e) {
                        return e.output;
                    })// Desired outputs
                    , this.trainIterations // Iterations
                    , this.trainAlfa);
            return (new jsEOPopulation())
                    .add(new js_evrbf.individual(tmpChr));
        }
    });
    /**
     * RADIUS Mutator... transitory until re-reading the original paper
     * @type Class
     */
    js_evrbf.RadiusMut = new Class({
        Extends: jsEOOperator,
        initialize: function (_applicationRate, _radiusRate, _min, _max, _trnSamples, _trainIterations, _trainAlfa) {
            this.parent(_applicationRate);
            this.min = _min || 0;
            this.max = _max || 1;
            this.radiusRate = _radiusRate || 0.5;
            this.trnSamples = _trnSamples || [];
            this.trainIterations = _trainIterations || 1;
            this.trainAlfa = _trainAlfa || 0;
            jsEOUtils.debugln("Initializing a js_evrf.RadiusMut with"
                    + " applicationRate " + this.applicationRate
                    + " values between " + _min + " and " + _max);
        },
        operate: function (_auxPop) {
            jsEOUtils.debugln("Applying js_evrf.RadiusMut with values" + this.min + " and " + this.max);
            //console.log("Applying js_evrf.RadiusMut with values" + this.min + " and " + this.max);
            var tmpChr = _auxPop.getAt(0).getChromosome().copy();
            var self = this;
            // Changing the values of the radius for those neurons selected according to this.radiusRate
            tmpChr.neurons
                    .filter(function () {
                        return Math.random() <= self.radiusRate;
                    })
                    .forEach(function (e, i) {
                        var tmp = e.radius;
                        e.radius = jsEOUtils.random(self.min, self.max);
                        //console.log( "Radius changes from ", tmp, " to ", e.radius );
                    });
            tmpChr.trainLMS(
                    this.trnSamples.map(function (e) {
                        return e.input;
                    }) // INputs
                    , this.trnSamples.map(function (e) {
                        return e.output;
                    })// Desired outputs
                    , this.trainIterations // Iterations
                    , this.trainAlfa);
            return (new jsEOPopulation())
                    .add(new js_evrbf.individual(tmpChr));
        }
    });

    /**
     * Sending information
     * @type Class
     */
    js_evrbf.opSendInfo = new Class({
        Extends: jsEOOpSendIndividuals,
        operate: function (_auxPop) {
            var data2bSend = "data=" + jsEOUtils.getProblemId() + ",";
            var tmpCad = "";
            for (var i = 0; i < this.numIndividuals; ++i) {
                if (i > 0) {
                    tmpCad += ",";
                }
                var tmpChr = _auxPop.getAt(i).getChromosome();
                if (Object.prototype.toString.call(tmpChr) === '[object Array]') {
                    for (var j = 0; j < tmpChr.length; ++j) {
                        if (j > 0) {
                            tmpCad += ",";
                        }
                        tmpCad += tmpChr[j];
                    }
                } else {
                    tmpCad += tmpChr;
                }

                tmpCad += "," + _auxPop.getAt(i).getFitness();
            }

            data2bSend += tmpCad;
            try {
                new Request({
                    url: jsEOUtils.getSendURL(),
                    method: 'GET',
                    async: true,
                    data: data2bSend,
                    timeout: 1000,
                    onSuccess: function (responseText) {
                        jsEOUtils.debugln('EvRBF:operator.js:opSendInfo: Conection response: ' + responseText);
                    },
                    onTimeout: function () {
                        jsEOUtils.debugln("EvRBF:operator.js:opSendInfo: Timeout while conecting to " +
                                jsEOUtils.getSendURL());
                        this.cancel();
                    },
                    onFailure: function () {
                        jsEOUtils.debugln("EvRBF:operator.js:opSendInfo: Failure while conecting to " +
                                jsEOUtils.getSendURL());
                        this.cancel();
                    }

                }).send();
            } catch (err) {
                jsEOUtils.debugln("jsEOOpSendIndividual: Error captured!");
                return null;
            }

            return null;
        }
    }); // Class opSendInfo

} catch (e) {
    console.log(e.message);
}


