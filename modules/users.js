const express = require("express");
const db = require("./db.js");
const authUtils = require("./auth_utils.js");
const router = express.Router();

// Endpoints

// User login
router.post("/users/login", async function(req, res, next){
    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if(cred.username === "" || cred.password === ""){
        res.status(401).json({error: "No username or password"}).end();
        return;
    }

    try {
        let data = await db.getUser(cred.username);

        if(data.rows.length > 0){
            let userid =  data.rows[0].id;
            let username = data.rows[0].username;
            let password = data.rows[0].password;
            let salt = data.rows[0].salt;
            
            let pwVerify = authUtils.verifyPassword(cred.password, password, salt);
            if(pwVerify){
                let tok = authUtils.createToken(username, userid);
                res.status(200).json({
                msg: "The login was successful!",
                token: tok
                }).end();

            } else {
                res.status(403).send("Password not correct");
                return;
            }

            
        } else {
            res.status(403).send("No user found");
            return;
        }

    } catch(err) {
        next(err);
    }
})

// List all users
router.get("/users", async function(req, res, next){
    try {
        let data = await db.getAllUsers();
        res.status(200).json(data.rows).end();
    }
    catch(err) {
        next(err);
    }
    
})

// Create a new user
router.post("/users", async function(req, res, next){
    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if(cred.username === "" || cred.password === ""){
        res.status(401).json({error: "No username or password"}).end();
        return;
    }

    let hash = authUtils.createHash(cred.password);

    try{
        let data = await db.createUser(cred.username, hash.value, hash.salt);
        if(data.rows.length > 0){
            res.status(200).json({msg: "The user was created successfully"}).end();
        } else {
            throw "The user couldn't be created";
        }
    }
    catch(err){
        next(err);
    }


})

// Delete a user
router.delete("/users", async function(req, res, next){
    res.status(200).send("Hello from DELETE - /users").end();
})

module.exports = router;