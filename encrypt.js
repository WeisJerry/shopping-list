/**
 * Run to manually encrypt passwords for initial DB construction and testing.
 */

const crypt = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'oicu812';

/**
 * Encrypt a string of text. Returns encrypted string.
 * @param {string} text 
 */
function encrypt(text) {
    var cipher = crypt.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

/**
 * Decrypt a string of text. Returns decrypted string.
 * @param {string} text 
 */
function decrypt(text) {
    var decipher = crypt.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};

// Manually encrypt/decrypt
var plainText = "oicu812";
var encrypted = encrypt(plainText);
console.log("Encrypting password " + plainText);
console.log("Encrypted value: " + encrypted);
var decrypted = decrypt(encrypted);
console.log("Decrypted value: " + decrypted);
