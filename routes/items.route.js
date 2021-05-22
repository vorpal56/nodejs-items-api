const express = require("express")
const {v4: uuidv4 } = require("uuid")
const persistence = require("../persistence/sqlite3")
const router = express.Router()

router.get("/", async (req, res) => {
	const items = await persistence.getItems()
	res.send(items)
})

router.get("/:id", async (req, res) => {
	const itemID = req.params.id
	const item = await persistence.getItemById(itemID)
	res.send(item)
})
router.get("/name/:name", async (req, res) => {
	const itemName = req.params.name
	const items = await persistence.getItemsByName(itemName)
	res.json(items)
})
router.post("/", async (req, res) => {
	const item = {
		id: uuidv4(),
		name: req.body.name,
		completed: false
	}
	const result = await persistence.addItem(item)
	res.send(item)
})

router.put("/:id", async (req, res) => {
	const itemID = req.params.id
	const item = {
		name: req.body.name,
		completed: req.body.completed
	}
	const result = await persistence.updateItem(itemID, item)
	res.send(result)
})

router.delete("/:id", async (req, res) => {
	const itemID = req.params.id
	await persistence.deleteItem(itemID)
	res.sendStatus(200)
})

router.delete("/name/:name", async(req, res)=>{
	const itemName = req.params.name
	await persistence.deleteItemsByName(itemName)
	const result = await persistence.getItems()
	return res.send(result)
})
module.exports = router