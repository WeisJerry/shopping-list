/**
 * Utility Functions
 */

var crypt = require('crypto');
var algorithm = 'aes-256-ctr';
var pwd = 'oicu812';

const { Client } = require('pg');
//for local development
/*const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'groceries',
    password: 'not4U2no',
    port: 5432,
});*/
//for heroku server
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });


client.connect();

module.exports.getDBClient = function () {
    return client;
}

module.exports.logError = function logError(modulename, segment, err) {
    var errTxt = "ERROR: ";
    console.error(errTxt + "An unrecoverable error occurred.");
    console.error(errTxt + "module-" + modulename);
    console.error(errTxt + "segment-" + segment);
    console.error(errTxt + err.stack);
}

module.exports.encrypt = function encrypt(text) {
    var cipher = crypt.createCipher(algorithm, pwd);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

module.exports.decrypt = function decrypt(text) {
    var decipher = crypt.createDecipher(algorithm, pwd)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
