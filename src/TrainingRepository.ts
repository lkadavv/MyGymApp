import * as SQLite from 'expo-sqlite';
import { Training } from './Training';

export class TrainingRepository {
    async getAll(): Promise<Training[]> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        return await db.getAllAsync<Training>('SELECT * FROM trainings ORDER BY time ASC');
    }
}