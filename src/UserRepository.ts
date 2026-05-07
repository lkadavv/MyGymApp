import * as SQLite from 'expo-sqlite';

export interface User {
    id?: number;
    email: string;
    password: string;
}

export class UserRepository {
    // Пошук користувача для входу
    async getUserByEmail(email: string): Promise<User | null> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        const result = await db.getAllAsync<User>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return result.length > 0 ? result[0] : null;
    }

    // Реєстрація нового користувача
    async create(user: User): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        
        // Перевірка, чи імейл вже зайнятий
        const existing = await this.getUserByEmail(user.email);
        if (existing) {
            throw new Error('Користувач з таким email вже існує');
        }

        await db.runAsync(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [user.email, user.password]
        );
    }
}