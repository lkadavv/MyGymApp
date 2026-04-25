import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('fitbook.db');
    
    // Таблиця тренувань (довідник)
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS trainings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            trainer_name TEXT NOT NULL,
            duration INTEGER NOT NULL,
            price INTEGER NOT NULL,
            max_capacity INTEGER NOT NULL,
            time TEXT NOT NULL,
            description TEXT,
            image_emoji TEXT
        );
    `);
    
    // Таблиця записів (бронювань)
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            training_id INTEGER NOT NULL,
            client_name TEXT NOT NULL,
            client_phone TEXT NOT NULL,
            booking_date TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (training_id) REFERENCES trainings (id) ON DELETE CASCADE
        );
    `);
    
    // Додаємо початкові тренування
    const existingTrainings = await db.getAllAsync('SELECT * FROM trainings');
    
    if (existingTrainings.length === 0) {
        await db.runAsync(`
            INSERT INTO trainings (name, trainer_name, duration, price, max_capacity, time, image_emoji) VALUES
            ('Аштанга-йога', 'Олена Кравченко', 55, 350, 10, '10:00', '🧘‍♀️'),
            ('TRX', 'Вадим Канельський', 55, 400, 10, '12:00', '💪'),
            ('Аквааеробіка', 'Юлія Ференцюк', 55, 350, 7, '15:30', '🏊‍♀️'),
            ('Бокс', 'Валентин Дрізд', 55, 350, 15, '21:30', '🥊')
        `);
    }
    
    console.log('База даних ініціалізована');
};