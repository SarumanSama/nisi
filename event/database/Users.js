const { promises, existsSync } = require("fs");
const { Collection } = require("../../lib/Collection");
const { color } = require("../../utils");
const usersMap = new Collection();

function print(message) {
	console.log(color("[UserDB]", "yellow"), message);
}

class Users {
	addUser(id) {
		if (!id || typeof id !== "string") {
			print(TypeError(`'id' is ${typeof id}. 'id' must be a string`));
		}
		if (usersMap.has(id)) return print(`ignoring: '${id}' already in database`);
		try {
			let data = {
				id,
				premium: false,
				expire: null,
				limit: 50,
				type: null,
				info: { age: null, adult: false },
			};
			usersMap.set(id, data);
			print(`Success adding user ${id}`);
			return true;
		} catch (e) {
			print(`Failed adding user ${id}`);
			throw e;
		}
	}
	deleteUser(id) {
		if (!usersMap.has(id)) {
			print(`'${id}' not found in database`);
			return false;
		}
		try {
			usersMap.delete(id);
			print(`Success delete '${id}'`);
			return true;
		} catch (e) {
			throw e;
		}
	}
	editUser(
		id,
		data = {
			premium: false,
			expire: null,
			limit: 0,
			type: null,
			info: { age: null, adult: false },
		}
	) {
		if (!usersMap.has(id)) {
			print(`'${id}' not found in database`);
			return false;
		}
		try {
			data = { id, ...data };
			usersMap.set(id, data);
			print(`Success edit '${id}' data`);
			return true;
		} catch (e) {
			throw e;
		}
	}
	getUser(id) {
		if (!usersMap.has(id)) {
			print(`'${id}' not found in database`);
			return false;
		}
		return usersMap.get(id);
	}
	toArray() {
		return Array.from(usersMap.values());
	}
	async writeToFile(path) {
		if (!path) print(`'path' is empty`);
		await promises.writeFile(path, JSON.stringify(this.toArray(usersMap), null, "\t"));
		print("write user db to: " + path);
	}
	async readFromFile(path) {
		if (!path || !existsSync(path)) return `'path' is empty or not found`;
		if (existsSync(path)) {
			print("read user db from: " + path);
			const dbStr = await promises.readFile(path, { encoding: "utf-8" });
			const dbJson = JSON.parse(dbStr);
			if (Array.isArray(dbJson)) {
				for (let dbX of dbJson) {
					usersMap.set(dbX.id, dbX);
				}
			}
		}
	}
}

module.exports = Users;
