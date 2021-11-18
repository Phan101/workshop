// setup connection
const pg = require('pg');
const dbURI = "postgres://kqfjceamynvdet:b5e92b1bbbe1aa81b02281b5f655fe4558f75d8ef116ce308e6c66cf6c25c14e@ec2-52-31-219-113.eu-west-1.compute.amazonaws.com:5432/d2spaji1q8d204";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
	connectionString: connstring,
	ssl: { rejectUnauthorized: false}
});

// database methods
let dbMethods = {}; // empty object

dbMethods.getAllBlogPosts = function (){
    let sql = "SELECT * FROM blogposts";
    return pool.query(sql); // return the promise
}

dbMethods.createBlogPost = function (heading, blogtext, userid){
    let sql = "INSERT INTO blogposts (id, date, heading, blogtext, userid) VALUES(DEFAULT, DEFAULT; $1, $2, $3) returning *";
    let values = [heading, blogtext, userid];
    return pool.query(sql, values); // return the promise
}

dbMethods.deleteBlogPost = function(id){
    let sql = "DELETE FROM blogposts WHERE id = $1 RETURNING *";
    let values = [id];
    return pool.query(sql, values); // return the promise
}

// export dbMethods
module.exports = dbMethods;