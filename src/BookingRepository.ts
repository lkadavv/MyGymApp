import * as SQLite from 'expo-sqlite';
import { Booking, BookingWithTraining } from './Booking';
import { Training } from './Training';

export class BookingRepository {
    async getAll(): Promise<BookingWithTraining[]> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        return await db.getAllAsync<BookingWithTraining>(`
            SELECT 
                b.*,
                t.name as training_name,
                t.trainer_name,
                t.price,
                t.time
            FROM bookings b
            JOIN trainings t ON b.training_id = t.id
            WHERE b.status = 'active'
            ORDER BY b.booking_date DESC, t.time ASC
        `);
    }

    async getById(id: number): Promise<BookingWithTraining | null> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        const result = await db.getAllAsync<BookingWithTraining>(`
            SELECT 
                b.*,
                t.name as training_name,
                t.trainer_name,
                t.price,
                t.time
            FROM bookings b
            JOIN trainings t ON b.training_id = t.id
            WHERE b.id = ?
        `, [id]);
        return result.length > 0 ? result[0] : null;
    }

    async getByClient(phone: string): Promise<BookingWithTraining[]> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        return await db.getAllAsync<BookingWithTraining>(`
            SELECT 
                b.*,
                t.name as training_name,
                t.trainer_name,
                t.price,
                t.time
            FROM bookings b
            JOIN trainings t ON b.training_id = t.id
            WHERE b.client_phone = ? AND b.status = 'active'
            ORDER BY b.booking_date DESC
        `, [phone]);
    }

    async create(booking: Booking): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        
        const training = await db.getAllAsync<Training>(
            'SELECT max_capacity FROM trainings WHERE id = ?',
            [booking.training_id]
        );
        
        const bookingsCount = await db.getAllAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM bookings WHERE training_id = ? AND booking_date = ? AND status = "active"',
            [booking.training_id, booking.booking_date]
        );
        
        if (training[0] && bookingsCount[0].count >= training[0].max_capacity) {
            throw new Error('Немає вільних місць на цю дату');
        }
        
        await db.runAsync(
            `INSERT INTO bookings (training_id, client_name, client_phone, booking_date, status) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                booking.training_id,
                booking.client_name,
                booking.client_phone,
                booking.booking_date,
                booking.status || 'active'
            ]
        );
    }

    async update(id: number, data: Partial<Booking>): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        const updates = [];
        const values = [];
        
        for (const [key, value] of Object.entries(data)) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
        values.push(id);
        
        await db.runAsync(
            `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    async delete(id: number): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        await db.runAsync('DELETE FROM bookings WHERE id = ?', [id]);
    }

    async cancelBooking(id: number): Promise<void> {
        const db = await SQLite.openDatabaseAsync('fitbook.db');
        await db.runAsync(
            'UPDATE bookings SET status = "cancelled" WHERE id = ?',
            [id]
        );
    }
}