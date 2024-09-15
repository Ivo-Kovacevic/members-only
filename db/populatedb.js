const { Client } = require("pg");
require("dotenv").config();

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        text VARCHAR(1023),
        time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO users (username, password)
    VALUES ('mike', '$2a$10$vuMCOuOnn4RdCIh78AWTae/zKhWL1HA2wmJqd5VG6b7ZriKgxEdmi');

    INSERT INTO users (username, password)
    VALUES ('nike', '$2a$10$dqAkHmGh20xJi79qb.3UHexX3r8F0RZs.NmnNaoNFaqbjZLv5vwAG');

    INSERT INTO messages (user_id, title, text)
    VALUES ((SELECT id FROM users WHERE username = 'mike'), 'The Art of Coffee Brewing', 'Just perfected my pour-over technique this morning! The aroma is unmatched. Anyone wants tips on how to brew the perfect cup?');

    INSERT INTO messages (user_id, title, text)
    VALUES ((SELECT id FROM users WHERE username = 'mike'), 'Adventure Awaits', 'Booked a last-minute flight to Iceland for the Northern Lights! If anyone has been, drop your recommendations! Can’t wait for this adventure.');

    INSERT INTO messages (user_id, title, text)
    VALUES ((SELECT id FROM users WHERE username = 'nike'), 'Sneakerhead Alert', 'Got my hands on the limited-edition kicks from the new collab! Thinking of unboxing them on stream tomorrow. Who’s tuning in?');

    INSERT INTO messages (user_id, title, text)
    VALUES ((SELECT id FROM users WHERE username = 'nike'), 'Fitness Journey Begins', 'Just crushed my first 10k run! Training for a marathon now. Any seasoned runners here? Would love some advice on pacing and nutrition.');
`;

const main = async function () {
    try {
        // example of database connection
        // postgresql://user:password@host:5432/database
        const connectionString = process.argv[2];
        if (!connectionString) {
            console.error(
                "Please provide the database connection string as an argument."
            );
            process.exit(1);
        }

        console.log("Seeding...");
        const client = new Client({ connectionString });

        await client.connect();
        await client.query(SQL);
        await client.end();

        console.log("Done");
    } catch (error) {
        console.error("Error during seeding: ", error);
        process.exit(1);
    }
};

main();
