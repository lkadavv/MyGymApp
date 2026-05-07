import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SubscriptionRepository } from '../SubscriptionRepository';

const subRepo = new SubscriptionRepository();

const PLANS = [
    { plan_name: 'Старт (8 занять)', price: 800, description: '2 тренування на тиждень протягом місяця', trainer_name: 'Олена Кравченко' },
    { plan_name: 'Стандарт (12 занять)', price: 1200, description: '3 тренування на тиждень.', trainer_name: 'Олена Кравченко' },
    { plan_name: 'Безліміт', price: 2000, description: 'Необмежена кількість відвідувань протягом місяця', trainer_name: 'Олена Кравченко' },
];

export default function AvailableSubscriptionsScreen({ navigation, route }: any) {
    const { userEmail } = route.params;

    const handlePurchase = (plan: any) => {
    navigation.navigate('Payment', { userEmail, plan });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Абонементи</Text>
            {PLANS.map((plan, index) => (
                <TouchableOpacity key={index} style={styles.card} onPress={() => handlePurchase(plan)}>
                    <Text style={styles.planName}>{plan.plan_name}</Text>
                    <Text style={styles.price}>{plan.price} ₴</Text>
                    <Text style={styles.desc}>{plan.description}</Text>
                    <Text style={styles.trainer}>Тренер: {plan.trainer_name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ebf2f5', padding: 20 },
    header: { fontSize: 28, fontWeight: 'bold', color: '#4a5568', marginBottom: 20, marginTop: 40 },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#44b6c1' },
    planName: { fontSize: 20, fontWeight: 'bold', color: '#4a5568' },
    price: { fontSize: 18, color: '#44b6c1', fontWeight: 'bold', position: 'absolute', right: 20, top: 20 },
    desc: { color: '#718096', marginTop: 5 },
    trainer: { color: '#4a5568', marginTop: 10, fontSize: 14 }
});