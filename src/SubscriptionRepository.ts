import * as SQLite from 'expo-sqlite';

export class SubscriptionRepository {
    private dbName = 'fitbook.db';

    async getByUserEmail(email: string) {
        const db = await SQLite.openDatabaseAsync(this.dbName);
        return await db.getFirstAsync<{plan_name: string, price: number, description: string, trainer_name: string}>(
            'SELECT * FROM user_subscriptions WHERE user_email = ?',
            [email]
        );
    }

    async purchase(email: string, plan: any) {
        const db = await SQLite.openDatabaseAsync(this.dbName);
        // Видаляємо старий абонемент перед купівлею нового (один юзер - один абонемент)
        await db.runAsync('DELETE FROM user_subscriptions WHERE user_email = ?', [email]);
        await db.runAsync(
            'INSERT INTO user_subscriptions (user_email, plan_name, price, description, trainer_name) VALUES (?, ?, ?, ?, ?)',
            [email, plan.plan_name, plan.price, plan.description, plan.trainer_name]
        );
    }
}