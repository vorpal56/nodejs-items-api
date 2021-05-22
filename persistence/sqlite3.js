const sqlite3 = require('sqlite3').verbose();
const fs = require("fs")
const path = require("path")
const tableName = "example"
const location = process.env.SQLITE_DB_LOCATION || `database/${tableName}.db`

function init() {
	const dirName = path.dirname(location);
	if (!fs.existsSync(dirName)) {
			fs.mkdirSync(dirName, { recursive: true });
	}

	return new Promise((accept, reject) => {
			db = new sqlite3.Database(location, err => {
					if (err) return reject(err);

					if (process.env.NODE_ENV !== 'test')
							console.log(`Using sqlite database at ${location}`);

					db.run(
							`CREATE TABLE IF NOT EXISTS ${tableName} (id varchar(36), name varchar(255), completed boolean)`,
							(err, result) => {
									if (err) return reject(err);
									accept();
							},
					);
			});
	});
}

async function teardown() {
	return new Promise((accept, reject) => {
			db.close(err => {
					if (err) reject(err);
					else accept();
			});
	});
}
async function getItems() {
	return new Promise((accept, reject) => {
		db.all(`select * from ${tableName}`, (err, rows) => {
			if (err) return reject(err)
			accept(rows.map(item => 
				Object.assign({}, item, {completed : item.completed === 1})
			))
		})
	})
}

async function getItemById(id) {
	return new Promise((accept, reject) => {
		db.get(`select * from ${tableName} where id = ?`, [id], (err, row) =>{
			if (err) return reject(err)
			accept(Object.assign({}, row, {completed: row.completed === 1}))
		})
	})
}

async function getItemsByName(name) {
	return new Promise((accept, reject) =>{
		db.all(`select * from ${tableName} where name = ?`, [name], (err, rows) => {
			if (err) return reject(err)
			accept(rows.map(item => 
				Object.assign({}, item, {completed: item.completed === 1})
			))
		}) 
	})
}

async function addItem(item) {
	return new Promise((accept, reject) => {
		db.run(`insert into ${tableName}(id, name, completed) values(?, ?, ?)`, [item.id, item.name, item.completed], err =>{
			if (err) return reject(err)
			accept(`Added ${item.name} to the database`)
		})
	})
}

async function updateItem(id, item) {
	return new Promise((accept, reject) => {
		db.run(`update ${tableName} set name=?, completed=? where id = ?`, [item.name, item.completed ? 1: 0, id], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

async function deleteItem(id) {
	return new Promise((accept, reject) => {
		db.run(`delete from ${tableName} where id = ?`, [id], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

async function deleteItemsByName(name) {
	return new Promise((accept, reject) => {
		db.run(`delete from ${tableName} where name = ?`, [name], err => {
			if (err) return reject(err)
			accept()
		})
	})
}

module.exports = {
	init, 
	teardown,
	getItems,
	getItemById,
	getItemsByName,
	addItem,
	updateItem,
	deleteItem,
	deleteItemsByName
}