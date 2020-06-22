const crypto = require('crypto');
const encryption_key = 'aGVsbG8gd29ybGQ=Gvv4ql==2gceJer3';
const algorithm = 'aes-128-ecb';


// An encrypt function 
function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, encryption_key);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

// A decrypt function 
function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, encryption_key);
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
}

var plain = ["aBcdefGhijklmnOpqrstuvwxyz",
    "1234567890",
    "!@#$%^&*()_+=-[]|}{,./?><\\\"",
    "123EFGabc$%^"
];

var counter;
for (counter = 0; counter < plain.length; counter++) {
    var result = encrypt(plain[counter]);
    console.log("\"" + result + "\",");
    
}
