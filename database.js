const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database.');

        // Create the 'users' table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                userId TEXT UNIQUE,
                messageSent INTEGER DEFAULT 0
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('Users table is already created.'); //Lazy, need to fix this
            }
        });
    }
});

// Error handling for the database connection
db.on('error', (err) => {
    console.error('Database error:', err);
});

module.exports = db;
