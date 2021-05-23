const sqlite3 = require('sqlite3').verbose();
const fs = require("fs")
const path = require("path")
const location = process.env.SQLITE_DB_LOCATION || `database/table.db`

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
							`CREATE TABLE IF NOT EXISTS items (id varchar(36), name varchar(255), completed boolean)`,
							(err, result) => {
									if (err) return reject(err);
									accept();
							},
					);
					db.run(
						`CREATE TABLE IF NOT EXISTS users (id varchar(36), name varchar(32), username varchar(32) UNIQUE, password varchar(32))`,
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


module.exports = {
	init, 
	teardown
}