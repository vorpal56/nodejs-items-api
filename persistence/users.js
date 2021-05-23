async function getUsers() {
	return new Promise((accept, reject) => {
		db.all(`select * from users`, (err, rows) => {
			if (err) return reject(err)
			accept(rows.map( row => 
				Object.assign({}, {id: row.id, name: row.name, username: row.username})
			))
		})
	})
}

async function getUserById(id) {
	return new Promise((accept, reject) => {
		db.get(`select * from users where id = ?`, [id], (err, row) =>{
			if (err) return reject(err)
			accept({id: row.id, name: row.name, username: row.username})
		})
	})
}

async function getUsersByUsername(name) {
	return new Promise((accept, reject) =>{
		db.all(`select * from users where username = ?`, [name], (err, rows) => {
			if (err) return reject(err)
			accept(rows.map(row => Object.assign({}, row))[0])
		}) 
	})
}

async function addUser(user) {
	return new Promise((accept, reject) => {
		const {id, name, username, password} = user
		db.run(`insert into users(id, name, username, password) values(?, ?, ?, ?)`, [id, name, username, password], err =>{
			if (err) return reject(err)
			accept(`Added ${user.name} to the items table`)
		})
	})
}

async function updateUser(id, user) {
	return new Promise((accept, reject) => {
		const {name, username, password} = user
		if (password == null) {
			db.run(`update users set name=?, username=? where id = ?`, [name, username, id], err => {
				if (err) return reject(err)
				accept()
			})
		} else {
			db.run(`update users set name=?, username=?, password=? where id = ?`, [name, username, password, id], err => {
				if (err) return reject(err)
				accept()
			})
		}
	})
}

async function deleteUser(id) {
	return new Promise((accept, reject) => {
		db.run(`delete from users where id = ?`, [id], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

async function deleteUsersByName(name) {
	return new Promise((accept, reject) => {
		db.run(`delete from users where name = ?`, [name], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

module.exports = {
	getUsers,
	getUserById,
	getUsersByUsername,
	addUser,
	updateUser,
	deleteUser,
	deleteUsersByName
}