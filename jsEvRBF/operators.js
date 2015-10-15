/**
 * @file operators
 * @brief Put the description here!!!!
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
    // Sortcut for EvRBF's namespace
    ns = js_evrbf;
    ns.jsXOver = new Class({
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
} catch (e) {
    console.log(e.message);
}


