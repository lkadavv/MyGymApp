import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('fitbook.db');
    
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE, 
        password TEXT NOT NULL
    );
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS trainings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            trainer_name TEXT NOT NULL,
            price INTEGER NOT NULL,
            time TEXT NOT NULL,
            max_capacity INTEGER NOT NULL
        );
    `);
    
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            training_id INTEGER NOT NULL,
            client_name TEXT NOT NULL,
            client_phone TEXT NOT NULL,
            booking_date TEXT NOT NULL,
            FOREIGN KEY (training_id) REFERENCES trainings (id) ON DELETE CASCADE
        );
    `);
    
    const existingTrainings = await db.getAllAsync('SELECT * FROM trainings');
    
    if (existingTrainings.length === 0) {
        await db.runAsync(`
            INSERT INTO trainings (name, trainer_name, price, time, max_capacity) VALUES
            ('Аштанга-йога', 'Олена Кравченко', 350, '10:00', 1),
            ('TRX', 'Вадим Канельський', 400,'12:00', 5),
            ('Аквааеробіка', 'Юлія Ференцюк', 350, '15:30',10),
            ('Бокс', 'Валентин Дрізд', 350, '21:30', 2)
        `);
    }
    
};