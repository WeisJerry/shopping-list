/**
 * Utility Functions
 */
require('dotenv').config();
var crypt = require('crypto');
const encryption_key = 'aGVsbG8gd29ybGQ=Gvv4ql==2gceJer3';
const algorithm = 'aes-128-ecb';

//The one and only DB connection client
//TODO: switch to connection pool
const { Client } = require('pg');
var client = null;

/**
 * Retrieve the connected DB client.
 * (Initialize it if it does not exist)
 */
module.exports.getDBClient = function () {
    if (client == null) {
        client = new Client({
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
            else {
                console.log("DB Connection initialized");
            }
        });
    }
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
    var cipher = crypt.createCipher(algorithm, encryption_key);
    return cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
}

/**
 * Decrypt a string
 */
module.exports.decrypt = function decrypt(text) {
    var decipher = crypt.createDecipher(algorithm, encryption_key);
    return decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');
}
