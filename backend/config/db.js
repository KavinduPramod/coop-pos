const mariadb = require("mariadb");

let connection;

async function createConnection() {
    console.log("Creating a new database connection...");
    connection = await mariadb.createConnection({
        checkDuplicate: false,
        host: "165.22.97.154",
        user: "user",
        password: "123",
        database: "testdb",
    });
    console.log("Database connection created successfully.");
}

async function getConnection() {
    if (!connection) {
        await createConnection();
    }
    return connection;
}

module.exports = {
    getConnection,
};


