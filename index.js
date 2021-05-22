const express = require("express")
const db = require("./persistence/sqlite3")

var app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", async (req, res) => {
	const items = await db.getItems()
	res.json(items)
})
const itemsRoute = require("./routes/items.route")
app.use("/items", itemsRoute)

db.init().then(() => {
	app.listen(3500, ()=> {
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