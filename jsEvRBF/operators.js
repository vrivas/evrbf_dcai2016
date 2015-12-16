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

    /*
     js_evrbf.jsXOver = new Class({// ### Aün sin hacer
     Extends: jsEOOperator,
     initialize: function (_applicationRate, _bitsRate) {
     this.parent(_applicationRate);
     this.bitsRate = _bitsRate;
     jsEOUtils.debugln("Initializing a js_evrf.XOver with " +
     "applicationRate " + this.applicationRate);
     
     },
     operate: function (_auxPop) {
     jsEOUtils.debugln("Applying js_evrf.XOver");
     var toRet = new jsEOPopulation();
     if (typeof _auxPop == 'undefined') {
     return toRet;
     }
     if (_auxPop.length() <= 0) {
     toRet.add(_auxPop.getAt(0).copy());
     return toRet;
     }
     
     var rnd2 = Math.floor(Math.random() * (_auxPop.length() - 1)) + 1;
     jsEOUtils.debugln("  rnd2 is " + rnd2 +
     " while length is " + _auxPop.length() +
     " and " + typeof _auxPop.pop[0]);
     
     var tmpChr1 = _auxPop.getAt(0).getChromosome();
     var tmpChr2 = _auxPop.getAt(rnd2).getChromosome();
     var point1 = Math.floor(Math.random() * (tmpChr1.length - 1));
     var point2 = point1 + Math.floor(Math.random() * (tmpChr1.length - point1));
     
     jsEOUtils.debugln("  Individuals are " + tmpChr1 + " and " + tmpChr2);
     jsEOUtils.debugln("  Points are " + point1 + " and " + point2);
     
     var newChr = new Array();
     for (var i = 0; i < point1; ++i) {
     newChr.push(tmpChr1[i]);
     }
     for (var i = point1; i <= point2; ++i) {
     newChr.push(tmpChr2[i]);
     }
     for (var i = point2 + 1; i < tmpChr1.length; ++i) {
     newChr.push(tmpChr1[i]);
     }
     
     jsEOUtils.debugln("  Inicio es " + tmpChr1 + " Final  " + newChr);
     toRet.add(new jsEOFVIndividual());
     toRet.getAt(0).setChromosome(newChr);
     return toRet;
     }
     });
     
     */
    /**
     * Centers Mutator... transitory until re-reading the original paper
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
                        var tmp=e.radius;
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

} catch (e) {
    console.log(e.message);
}


