/**
 * Utility Functions
 */

var mysql = require('mysql');
var crypt = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'oicu812';


module.exports = {
    logError: function (modulename, segment, err) {
        var errTxt = "ERROR: ";
        console.log(errTxt + "An unrecoverable error occurred.");
        console.log(errTxt + "module-" + modulename);
        console.log(errTxt + "segment-" + segment);
        console.log(errTxt + err.name);
        console.log(errTxt + err.stack);
    },

    encrypt: function (text) {
        var cipher = crypt.createCipher(algorithm, password);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },

    decrypt: function (text) {
        var decipher = crypt.createDecipher(algorithm, password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    },

};