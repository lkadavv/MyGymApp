import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SubscriptionRepository } from '../SubscriptionRepository';

const subRepo = new SubscriptionRepository();

export default function MySubscriptionsScreen({ navigation, route }: any) {
    const { userEmail } = route.params;
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadSub = async () => {
        setLoading(true);
        const data = await subRepo.getByUserEmail(userEmail);
        setSubscription(data);
        setLoading(false);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadSub);
        return unsubscribe;
    }, [navigation]);

    if (loading) return <ActivityIndicator size="large" style={{flex:1}} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Мої абонементи</Text>

            {subscription ? (
                <View style={styles.activeCard}>
                    <Text style={styles.planName}>{subscription.plan_name}</Text>
                    <Text style={styles.price}>{subscription.price} ₴</Text>
                    <Text style={styles.desc}>{subscription.description}</Text>
                    <View style={styles.trainerRow}>
                        <View style={styles.avatar}><Text>👩‍🏫</Text></View>
                        <Text>{subscription.trainer_name} (тренер)</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>У вас поки немає активних абонементів</Text>
                </View>
            )}

            <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => navigation.navigate('AvailableSubscriptions', { userEmail })}
            >
                <Text style={styles.buyButtonText}>Придбати</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ebf2f5', padding: 25 },
    header: { fontSize: 28, fontWeight: 'bold', color: '#4a5568', marginBottom: 30, marginTop: 40 },
    activeCard: { backgroundColor: 'white', padding: 25, borderRadius: 20, borderTopWidth: 10, borderTopColor: '#44b6c1' },
    planName: { fontSize: 22, fontWeight: 'bold', color: '#4a5568' },
    price: { fontSize: 18, color: '#44b6c1', position: 'absolute', right: 25, top: 25 },
    desc: { color: '#718096', marginVertical: 10 },
    trainerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
    avatar: { width: 40, height: 40, backgroundColor: '#cbd5e0', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#718096', fontSize: 16 },
    buyButton: { backgroundColor: '#44b6c1', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 30 },
    buyButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});