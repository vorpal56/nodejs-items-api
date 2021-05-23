async function getItems() {
	return new Promise((accept, reject) => {
		db.all(`select * from items`, (err, rows) => {
			if (err) return reject(err)
			accept(rows.map(item => 
				Object.assign({}, item, {completed : item.completed === 1})
			))
		})
	})
}

async function getItemById(id) {
	return new Promise((accept, reject) => {
		db.get(`select * from items where id = ?`, [id], (err, row) =>{
			if (err) return reject(err)
			accept(Object.assign({}, row, {completed: row.completed === 1}))
		})
	})
}

async function getItemsByName(name) {
	return new Promise((accept, reject) =>{
		db.all(`select * from items where name = ?`, [name], (err, rows) => {
			if (err) return reject(err)
			accept(rows.map(item => 
				Object.assign({}, item, {completed: item.completed === 1})
			))
		}) 
	})
}

async function addItem(item) {
	return new Promise((accept, reject) => {
		db.run(`insert into items(id, name, completed) values(?, ?, ?)`, [item.id, item.name, item.completed], err =>{
			if (err) return reject(err)
			accept(`Added ${item.name} to the database`)
		})
	})
}

async function updateItem(id, item) {
	return new Promise((accept, reject) => {
		db.run(`update items set name=?, completed=? where id = ?`, [item.name, item.completed ? 1: 0, id], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

async function deleteItem(id) {
	return new Promise((accept, reject) => {
		db.run(`delete from items where id = ?`, [id], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

async function deleteItemsByName(name) {
	return new Promise((accept, reject) => {
		db.run(`delete from items where name = ?`, [name], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

module.exports = {
	getItems,
	getItemById,
	getItemsByName,
	addItem,
	updateItem,
	deleteItem,
	deleteItemsByName
}