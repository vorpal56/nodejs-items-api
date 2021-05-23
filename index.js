const express = require("express")
const db = require("./persistence/sqlite3")
const itemsRoute = require("./routes/items.route")
const usersRoute = require("./routes/users.route")


var app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use("/items", itemsRoute)
app.use("/user", usersRoute)

db.init().then(() => {
	app.listen(3000, ()=> {
		console.log("Index is running on port 3000")
	})
}).catch(err => {
	console.error(err)
}) 
const gracefulShutdown = () => {
	db.teardown()
			.catch(() => {})
			.then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon