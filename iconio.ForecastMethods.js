/** 
 *  @file    iconio.ForecastMethods.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    09-Jul-2015 , 14:10:02
 *  @desc    Methods designed to provide forecasting values
 *  
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */


var foreMethods = [
    {
        "name": "average"
        , "apply":
                /**
                 * Example og forecasting function: Computes a new prediction using the average value
                 * @returns An object of type ForecastOutput, containing 2 values: val and test, where:
                 *   - val: Forecasting for last known value, and 
                 *   - test: Forecasting for next ("Unknown") value
                 */

                        function (data) {
                            // last number in DATA is realVal so it can not be used
                            var toRet = new ForecastOutput();
                            // Val: Forecasting for last known value
                            toRet.SetVal(
                                    Math.floor((data.slice(0, data.length - 1).reduce(
                                            function (a, b) {
                                                return a + b;
                                            })) / (data.length - 1))
                                    );

                            // Test: Forecasting for next ("Unknown") value
                            toRet.SetTest(
                                    Math.floor((data.reduce(
                                            function (a, b) {
                                                return a + b;
                                            })) / (data.length))
                                    );

                            return toRet;
                        }

            }
    , {
        "name": "random"
        , "apply":
                /**
                 * Example og forecasting function: Computes a new prediction using a random value
                 * @returns An object of type ForecastOutput, containing 2 values: val and test, where:
                 *   - val: Forecasting for last known value, and 
                 *   - test: Forecasting for next ("Unknown") value
                 */

                        function (data) {
                            var min = data.slice(0, data.length - 1).reduce(
                                    function (a, b) {
                                        return a < b ? a : b;
                                    }
                            );
                            var max = data.slice(0, data.length - 1).reduce(
                                    function (a, b) {
                                        return a > b ? a : b;
                                    }
                            );

                            var toRet = new ForecastOutput();
                            // Val: Forecasting for last known value
                            toRet.SetVal(
                                    Math.floor(min + Math.random() * (max - min + 1))
                                    );

                            // Test: Forecasting for next ("Unknown") value
                            min = min < data[data.length - 1] ? min : data[data.length - 1];
                            max = max > data[data.length - 1] ? max : data[data.length - 1];

                            toRet.SetTest(
                                    Math.floor(min + Math.random() * (max - min + 1))
                                    );

                            return toRet;
                        }

            }
    ,
];