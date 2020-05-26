/**
 * Utility Functions
 */
require('dotenv').config();
var crypt = require('crypto');
var algorithm = 'aes-256-ctr';
var pwd = 'oicu812';

//The one and only DB connection client
//TODO: switch to connection pool
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

client.connect(function (err, result) {
    if (err) {
        utils.logError(modulename, "connectClient", err);
        throw err;
    }
});

/**
 * Retrieve the connected DB client.
 */
module.exports.getDBClient = function () {
    return client;
}

/**
 * Log an error that occurred and throw it.
 */
module.exports.logError = function logError(modulename, segment, err) {
    var errTxt = "ERROR: ";
    console.error(errTxt + "An unrecoverable error occurred.");
    console.error(errTxt + "module-" + modulename);
    console.error(errTxt + "segment-" + segment);
    console.error(errTxt + err.stack);
}

/**
 * Encrypt a plaintext string
 */
module.exports.encrypt = function encrypt(text) {
    var cipher = crypt.createCipher(algorithm, pwd);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * Decrypt a string
 */
module.exports.decrypt = function decrypt(text) {
    var decipher = crypt.createDecipher(algorithm, pwd)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
