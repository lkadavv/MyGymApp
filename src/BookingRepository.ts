import * as SQLite from 'expo-sqlite';
import { Booking } from './Booking';

export class BookingRepository {
    async getAll(): Promise<Booking[]> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        return await db.getAllAsync<Booking>(`
            SELECT 
                b.*,
                t.name as training_name,
                t.trainer_name,
                t.price,
                t.time
            FROM bookings b
            JOIN trainings t ON b.training_id = t.id
            ORDER BY b.booking_date DESC, t.time ASC
        `);
    }

    async create(booking: Booking): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        
        console.log('Перевірка для тренування ID:', booking.training_id);
        console.log('Дата:', booking.booking_date);
        
        const training = await db.getAllAsync<{ max_capacity: number }>(
            'SELECT max_capacity FROM trainings WHERE id = ?',
            [booking.training_id]
        );
        
        console.log('max_capacity:', training[0]?.max_capacity);
        
        if (!training[0]) {
            throw new Error('Тренування не знайдено');
        }
        
        const bookingsCount = await db.getAllAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM bookings WHERE training_id = ? AND booking_date = ?',
            [booking.training_id, booking.booking_date]
        );
        
        console.log('Існуючих записів:', bookingsCount[0].count);
        
        if (bookingsCount[0].count >= training[0].max_capacity) {
            throw new Error(`Немає вільних місць. Максимум ${training[0].max_capacity} осіб на день`);
        }
        
        await db.runAsync(
            `INSERT INTO bookings (training_id, client_name, client_phone, booking_date) 
             VALUES (?, ?, ?, ?)`,
            [booking.training_id, booking.client_name, booking.client_phone, booking.booking_date]
        );
    }

    async update(id: number, data: Partial<Booking>): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        
        const current = await db.getAllAsync<Booking>(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );
        
        if (!current[0]) throw new Error('Запис не знайдено');
        
        const newDate = data.booking_date || current[0].booking_date;
        const trainingId = current[0].training_id;
        const oldDate = current[0].booking_date;
        
        if (newDate !== oldDate) {
            const training = await db.getAllAsync<{ max_capacity: number }>(
                'SELECT max_capacity FROM trainings WHERE id = ?',
                [trainingId]
            );
            
            if (!training[0]) throw new Error('Тренування не знайдено');
            
            const existingCount = await db.getAllAsync<{ count: number }>(
                `SELECT COUNT(*) as count FROM bookings 
                 WHERE training_id = ? AND booking_date = ? AND id != ?`,
                [trainingId, newDate, id]
            );
            
            if (existingCount[0].count >= training[0].max_capacity) {
                throw new Error(`На ${newDate} вже немає вільних місць! Максимум ${training[0].max_capacity} осіб.`);
            }
        }
        
        const updates = [];
        const values = [];
        
        const allowedFields = ['client_name', 'client_phone', 'booking_date'];
        
        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }
        values.push(id);
        
        if (updates.length > 0) {
            await db.runAsync(
                `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
        }
    }

    async delete(id: number): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        await db.runAsync('DELETE FROM bookings WHERE id = ?', [id]);
    }
}