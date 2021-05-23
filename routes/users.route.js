const express = require("express")
const {v4: uuidv4 } = require("uuid")
const usersDB = require("../persistence/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = express.Router()

const ROUNDS = 10

const ACCESS_TOKEN_SECRET = "thiswouldbeasuperlong access token secret"
const REFRESH_TOKEN_SECRET = "thiswouldbeasuperlong refresh token secret"

router.get("/", async (req, res) => {
	const users = await usersDB.getUsers()
	res.send(users)
})

router.get("/:id", async (req, res) => {
	const userID = req.params.id
	const user = await usersDB.getUserById(userID)
	res.send(user)
})
router.get("/name/:name", async (req, res) => {
	const userName = req.params.name
	const users = await usersDB.getUsersByName(userName)
	res.json(users)
})
router.post("/", async (req, res) => {
	const {name, username, password } = req.body
	try {
		let hashedPassword = await bcrypt.hash(password, ROUNDS)
		const user = {
			id: uuidv4(),
			name: name,
			username: username,
			password: hashedPassword
		}
		const result = await usersDB.addUser(user)
		res.send({id: user.id, name: user.name, username: user.username})
	} catch {
		let hashedPassword = await bcrypt.hash(password, ROUNDS)
		const user = {
			id: uuidv4(),
			name: name,
			username: username,
			password: hashedPassword
		}
		const result = await usersDB.addUser(user)
		res.status(500).send("something went wrong in the creating new user")
	}
})

router.put("/:id", authenticateToken, async (req, res) => {
	const userID = req.params.id
	const {name, username, password } = req.body
	try {
		const user = {
			name: name,
			username: username,
		}
		
		if (password != null) {
			let hashedPassword = await bcrypt.hash(password, ROUNDS)
			user.password = hashedPassword
		}
		const result = await usersDB.updateUser(userID, user)
		res.send(result)
	} catch (err) {
		res.status(500).send("something went wrong in the updating user")
	}
})

router.delete("/:id", async (req, res) => {
	const userID = req.params.id
	await usersDB.deleteUser(userID)
	res.sendStatus(200)
})

router.delete("/name/:name", async(req, res)=>{
	const userName = req.params.name
	await usersDB.deleteUsersByName(userName)
	const result = await usersDB.getUsers()
	return res.send(result)
})

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]
	if (authHeader == null) {
		return res.sendStatus(401)
	}
	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, authData) => {
		if (err) {
			return res.status(403).send("Access Token is invalid.")
		}
		req.user = authData
		next()
	})
}
module.exports = router