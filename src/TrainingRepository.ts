import * as SQLite from 'expo-sqlite';
import { Training } from './Training';

export class TrainingRepository {
    async getAll(): Promise<Training[]> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        return await db.getAllAsync<Training>('SELECT * FROM trainings ORDER BY time ASC');
    }

    async getById(id: number): Promise<Training | null> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        const result = await db.getAllAsync<Training>(
            'SELECT * FROM trainings WHERE id = ?',
            [id]
        );
        return result.length > 0 ? result[0] : null;
    }

    async getAvailableSpots(trainingId: number, date: string): Promise<number> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        const training = await this.getById(trainingId);
        if (!training) return 0;
        
        const bookings = await db.getAllAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM bookings WHERE training_id = ? AND booking_date = ? AND status = "active"',
            [trainingId, date]
        );
        
        const bookedCount = bookings[0]?.count || 0;
        return training.max_capacity - bookedCount;
    }
}