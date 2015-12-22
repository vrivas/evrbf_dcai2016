/**
 * @file mongo-find
 * @brief Put the description here!!!!
 * @date 21/dic/2015, 12:00
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

// Test
function minim() {
    return db.solution_dcai2016.group(
            {
                "initial": {}
                , "reduce": function (obj, prev) {
                    prev.obj = obj;
                    prev.minim = isNaN(prev.minim) ? obj.tsme.MAPE : Math.min(prev.minim, obj.tsme.MAPE)
                }
            }

    )
}

function all() {
    return db.solution_dcai2016.find();
}

function sortByMape(_numRecords) {
    return db.solution_dcai2016.find({}, {"_id": 1, "tsme.MAPE": 1}).limit(_numRecords).sort({"tsme.MAPE": 1});
}

function sortBy( _measure, _numRecords) {
    var fields={ "id": 1}, sorting={};
    fields['tsme.'+_measure]=1;
    sorting['tsme.'+_measure]=1;
    
    return db.solution_dcai2016.find({}, fields).limit(_numRecords).sort(sorting);
}
