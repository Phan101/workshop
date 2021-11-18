const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

const blogposts = rquire("./modules/blogposts.js");
// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());

server.use(blogposts);

server.use(function(err, rq, res, next){
	res.status(500).json({
		error: "Something went wrong on the server!",
		descr: err
	}).end();
})

// start server ------------------------
server.listen(server.get("port"), function () {
	//console.log("server running", server.get("port"));
});

