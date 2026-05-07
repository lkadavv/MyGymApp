import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PaymentSuccessScreen({ navigation, route }: any) {
    const { userEmail } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FitBook</Text>
            <Text style={styles.successText}>Оплата пройшла успішно!</Text>
            
            <View style={styles.circle}>
                <Text style={{fontSize: 80, color: 'white'}}>✓</Text>
            </View>

            <Text style={styles.subNumber}>Номер абонемента: №127</Text>

            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.navigate('MySubscriptions', { userEmail })}
            >
                <Text style={styles.backText}>До моїх абонементів</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ebf2f5', justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#44b6c1', marginBottom: 40 },
    successText: { fontSize: 22, color: '#2f855a', fontWeight: 'bold', marginBottom: 30 },
    circle: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#38a169', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    subNumber: { fontSize: 20, fontWeight: 'bold', color: '#1a202c', marginBottom: 40 },
    backButton: { backgroundColor: '#44b6c1', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
    backText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});