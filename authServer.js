const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("./persistence/sqlite3")
const usersDB = require("./persistence/users")

var app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const ACCESS_TOKEN_SECRET = "thiswouldbeasuperlong access token secret"
const REFRESH_TOKEN_SECRET = "thiswouldbeasuperlong refresh token secret"

app.post("/login", async (req, res) => {
	const {username, password} = req.body
	let user = await usersDB.getUsersByUsername(username)
	if (user == null) {
		return res.status(400).send("Client error. No user found by username.")
	}
	try {
		if (await bcrypt.compare(password, user.password)) {
			const loginUser = {username : user.username}
			const accessToken = generateAccessToken(loginUser)
			const refreshToken = generateRefreshToken(loginUser)
			return res.json({accessToken: accessToken, refreshToken: refreshToken})
		} 
		return res.send("Wrong password.")
	} catch {
		return res.sendStatus(500)
	}
})

app.delete("/logout", (req, res) => {
	
})

function generateAccessToken(user) {
	return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: "5m"})
}
function generateRefreshToken(user) {
	return jwt.sign(user, REFRESH_TOKEN_SECRET)
}

PORT = 3001

db.init().then(() => {
	app.listen(PORT, () => {
		console.log(`Authentication Server listening on ${PORT}.`)
	})
})




