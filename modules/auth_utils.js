const crypto = require("crypto");

// the secret must be stored in an env. variable in the finished app
const secret = "mcdonalds";

let utils = {};

utils.decodeCred = function (credString){
    let cred = {};

    // remove the word "basic"
    let b64String = credString.replace("basic ", ""); 

    // convert to ASCII text
    let asciiString = Buffer.from(b64String, "base64").toString("ascii");

    // extract the username, using regex
    cred.username = asciiString.replace(/:.*/, "");

    // extract password
    cred.password = asciiString.replace(cred.username + ":", "");

    return cred;
}

utils.createHash = function(password){
   // const crypto = require("crypto");
    let hash = {};

    hash.salt = Math.random().toString();
    hash.value = crypto.scryptSync(password, hash.salt, 64).toString("hex");

    return hash;
}

utils.createToken = function(username, userID){
  //  let crypto = require("crypto");

    // Part 1 & 2 as JSON-text
    let part1 = JSON.stringify({"alg": "HS256", "typ": "JWT"});
    let part2 = JSON.stringify({"user": username, "userid": userID, "iat": Date.now()});

    // Part 1 & 2 as base64
    let b64Part1 = Buffer.from(part1).toString("base64");
    let b64Part2 = Buffer.from(part2).toString("base64");

    // combine part 1 & 2 separated with . (punktum)
    let openPart = b64Part1 + "." + b64Part2;

    // create the 3.part (signature) using a hash-function in the cryptomodule
    let secret = "mcdonalds"; // must be stored in an env. variable in the finished app
    let sign = crypto.createHmac("SHA256", secret).update(openPart).digest("base64");

    return openPart + "." + sign;
}

utils.verifyToken = function(token){
    // string method split to extract three parts into an array
    let tokenArr = token.split(".");
    let openPart = tokenArr[0] + "." + tokenArr[1];
    let signToCheck = tokenArr[2];

    let secret = "mcdonalds"; // must be stored in an env. variable in the finished app
    let sign = crypto.createHmac("SHA256", secret).update(openPart).digest("base64");

    if(signToCheck !== sign){
        // Signature not ok
        return false;
    }

    let payloadTxt = Buffer.from(tokenArr[1], "base64").toString("ascii");
    let payload = JSON.parse(payloadTxt); // Payload ex: {user: "beo", userid: 1, iat: 163234324}

    let expireTime = payload.iat + 24 * 60 * 60 * 1000 // time in milliseconds
    if(expireTime < Date.now()){
        // Token has expired
        return false;
    }

    // Token ok
    return payload;
}

utils.verifyPassword = function(pswFromUser, hashFromDB, saltFromDB){
    hash = crypto.scryptSync(pswFromUser, saltFromDB, 64).toString("hex");
    
    if(hash === hashFromDB){
        return true;
    }
    return false;
}

module.exports = utils;

/*
// Using the function to create a hashed password and salt:
let hash = createHash("kongolav");
console.log(hash);

// Using the function to create a token:
let token = createToken("josteinn");
console.log(token);*/