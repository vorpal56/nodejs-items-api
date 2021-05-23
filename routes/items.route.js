const express = require("express")
const {v4: uuidv4 } = require("uuid")
const itemsDB = require("../persistence/items")
const router = express.Router()

router.get("/", async (req, res) => {
	const items = await itemsDB.getItems()
	res.send(items)
})

router.get("/:id", async (req, res) => {
	const itemID = req.params.id
	const item = await itemsDB.getItemById(itemID)
	res.send(item)
})
router.get("/name/:name", async (req, res) => {
	const itemName = req.params.name
	const items = await itemsDB.getItemsByName(itemName)
	res.json(items)
})
router.post("/", async (req, res) => {
	const item = {
		id: uuidv4(),
		name: req.body.name,
		completed: false
	}
	const result = await itemsDB.addItem(item)
	res.send(item)
})

router.put("/:id", async (req, res) => {
	const itemID = req.params.id
	const item = {
		name: req.body.name,
		completed: req.body.completed
	}
	const result = await itemsDB.updateItem(itemID, item)
	res.send(result)
})

router.delete("/:id", async (req, res) => {
	const itemID = req.params.id
	await itemsDB.deleteItem(itemID)
	res.sendStatus(200)
})

router.delete("/name/:name", async(req, res)=>{
	const itemName = req.params.name
	await itemsDB.deleteItemsByName(itemName)
	const result = await itemsDB.getItems()
	return res.send(result)
})
module.exports = router