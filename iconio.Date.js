/** 
 *  @file    vrivas.Date.js
 *  @author  Victor M. Rivas Santos <vrivas@ujaen.es>
 *  @date    06-dic-2014 , 14:10:02
 *  @desc    Functions dealing with dates, some of them included in Date.prototype
 *  
 *  -------------------------------------
 *  GeNeura Team (http://geneura.ugr.es)
 */


/**
 * Turns a Date into a JSON string
 * @returns {String}
 */
Date.prototype.JSONstringify = function () {
    return JSON.stringify(
            {
                year: this.getFullYear(),
                month: this.getMonth(),
                date: this.getDate(),
                hours: this.getHours(),
                minutes: this.getMinutes(),
                seconds: this.getSeconds()
            }
    );
};

/**
 * Sets the value of a date from a JSON string containing fields: year, month, date, hours, minutes, and seconds
 * @param {string} txt The string encoding the 6 fields corresponding to a date
 * @pre The txt string must have the followings fields: year, month, date, hours, minutes, and seconds
 * @post The date changes its value to the new one specified by txt
 * @throws {e} The same error that has been captured in the try block, related to JSON.parse and/or Date.setTime
 * @returns {string} Returns the new date as a string
 */
Date.prototype.JSONparse = function (txt) {
    try {
        var tmp = JSON.parse(txt);
        this.setTime(new Date(tmp.year, tmp.month, tmp.date, tmp.hours, tmp.minutes, tmp.seconds).getTime());
        return this;
    } catch (e) {
        console.log("In Date.prototype.JSONparse: Bad JSON " + txt + "\n" + e + "\n");
        throw(e);
    }
};

/**
 * Returns the date as a string with the format: AAAMMDDHHMM
 * @returns {String}
 */
Date.prototype.aaaammddhhmm = function () {
    var toRet = "";
    var tmp = this.getFullYear();
    toRet += tmp;
    tmp = this.getMonth() + 1;
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getDate();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getHours();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getMinutes();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    return toRet;
}
/**
 * Returns the date as a string with the format: AAAMMDDHHMMSS
 * @returns {String}
 */
Date.prototype.aaaammddhhmmss = function () {
    var toRet = "";
    var tmp = this.getFullYear();
    toRet += tmp;
    tmp = this.getMonth() + 1;
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getDate();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getHours();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getMinutes();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getSeconds();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    return toRet;
}


/**
 * Returns the date as a string with the format: DD/MM/AAAA, hh:mm:ss
 * @returns {String}
 */
Date.prototype.log = function () {
    var toRet = "";
    tmp = this.getDate();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getMonth() + 1;
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += "/"+tmp;
    var tmp = this.getFullYear();
    toRet += "/"+tmp;
    toRet+=", ";
    tmp = this.getHours();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += tmp;
    tmp = this.getMinutes();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += ":"+tmp;
    tmp = this.getSeconds();
    tmp = ((tmp < 10) ? "0" : "") + tmp;
    toRet += ":"+tmp;
    return toRet;
}


function nowLog() {
    return (new Date()).log(); 
}