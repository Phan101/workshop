const express = require("express");
const db = require("./db.js");
const router = express.Router();
const protect = require("./auth.js");

// endpoints ----------------------------
router.get("/blogposts", protect, async function(req, res, next) {
	
	console.log(res.locals.username);
	console.log(res.locals.userid);

	try {
		let data = await db.getAllBlogPosts();
		res.status(200).json(data.rows).end();
	}
	catch (err) {
		next(err);
	}
	// res.status(200).send("Hello from GET").end();
});

router.post("/blogposts", protect, async function(req, res, next) {	
	let updata = req.body;
	let userid = res.locals.userid; // must be changed when users get implemented

	try{
		let data = await db.createBlogPost(updata.heading, updata.blogtext, userid);

		if(data.rows.length > 0){
			res.status(200).json({msg: "The blogpost was created successfully."}).end();
		} else {
			throw "The blogpost couldn't be created";
		}
	}
	catch(err) {
		next(err);
	}
	//console.log(req.body.country);
	//res.status(200).send("Hello from POST").end();
});

router.delete("/blogposts", protect, async function(req, res, next) {
	let updata = req.body;
	let userid = res.locals.userid;

	try{
		
		let data = await db.deleteBlogPost(updata.id, userid);
		if(data.rows.length > 0){
			res.status(200).json({msg: "The blogpost was deleted successfully"}).end();
		} else {
			throw "The blogpost couldn't be deleted";
		}
	}
	catch(err){
		next(err);
	}
//	res.status(200).send("Hello from DELETE").end();
});

module.exports = router;