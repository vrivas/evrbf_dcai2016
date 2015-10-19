/**
 * @file individual.js
 * @brief Definition of the individual for EvRBF
 * @date 19/oct/2015, 13:25
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
        throw new ReferenceError("jsEvRBF.individual won't work since jsEVRBF/EvRBF.js has not been loaded");
    if (typeof js_rbfnn === "undefined")
        throw new ReferenceError("jsEvRBF.individual won't work since jsRBFNN/RBFNNet.js was not loaded.");
    if (typeof jsEOIndividual === "undefined")
        throw new ReferenceError("jsEvRBF.individual won't work since jsEO/core/jsEOIndividual was not loaded.");
    /**
     * jsEvRBF.individual class
     * @param {array of RBFNeuron} _neurons The neurons of the hidden layer
     * @param {array of floats} _weights Weights from neurons to otuput
     * @param {float} _bias The "extra" weight
     * @returns {Neuron}
     */

    js_evrbf.individual = new Class({
        Extends: jsEOIndividual
        , initialize: function (_neurons_or_net, _weights, _bias) {
            // Creating an individual with a chromosome... that is an RBFNNet
            var msg='';
            
            // If there is only one parameter try to build the individual with a copy of it
            if (typeof _weights === 'undefined' && typeof _bias === 'undefined') {
                this.parent(_neurons_or_net);
                msg=' from an existing net';
            } else {
                this.parent(new RBFNNet(_neurons_or_net, _weights, _bias));
                msg=' creating a new net';
            }
            jsEOUtils.debugln("Initializing a js_evrbf.individual"+msg);
        }
    });
} catch (e) {
    console.log(e.message);
}


