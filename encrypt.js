//Run manually to encrypt passwords

const crypt = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'oicu812';

function encrypt(text) {
    var cipher = crypt.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

function decrypt(text) {
    var decipher = crypt.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};

var hw = encrypt("Canada")
console.log(hw)
console.log(decrypt(hw))
