import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SubscriptionRepository } from '../SubscriptionRepository';

const subRepo = new SubscriptionRepository();

export default function PaymentScreen({ navigation, route }: any) {
    const { userEmail, plan } = route.params;
    
    // Стейт для полів
    const [cardNum, setCardNum] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [cvv, setCvv] = useState('');

    const handleConfirmPayment = async () => {
        // Валідація номера картки (рівно 16 цифр)
        if (cardNum.length !== 16) {
            Alert.alert("Помилка", "Номер картки повинен містити рівно 16 цифр");
            return;
        }

        // Валідація дня (1-31)
        const dayInt = parseInt(day);
        if (isNaN(dayInt) || dayInt < 1 || dayInt > 31) {
            Alert.alert("Помилка", "День має бути від 1 до 31");
            return;
        }

        // Валідація місяця (1-12)
        const monthInt = parseInt(month);
        if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
            Alert.alert("Помилка", "Місяць має бути від 1 до 12");
            return;
        }

        // Валідація CVV (3 цифри)
        if (cvv.length !== 3) {
            Alert.alert("Помилка", "CVV код повинен містити 3 цифри");
            return;
        }
        
        try {
            await subRepo.purchase(userEmail, plan);
            navigation.navigate('PaymentSuccess', { userEmail });
        } catch (e) {
            Alert.alert("Помилка", "Не вдалося провести оплату");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FitBook</Text>
            <Text style={styles.planName}>{plan.plan_name}</Text>
            <Text style={styles.price}>{plan.price}.00 грн</Text>

            <Text style={styles.label}>Оплата картою</Text>
            
            <TouchableOpacity style={styles.payButton}><Text style={styles.payText}>Apple Pay</Text></TouchableOpacity>
            <TouchableOpacity style={styles.payButton}><Text style={styles.payText}>Google Pay</Text></TouchableOpacity>

            <Text style={styles.or}>або</Text>

            {/* Номер картки - 16 цифр */}
            <TextInput 
                style={styles.input} 
                placeholder="Номер картки (16 цифр)" 
                keyboardType="number-pad" 
                maxLength={16}
                value={cardNum}
                onChangeText={setCardNum}
            />

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
                {/* День (1-31) */}
                <TextInput 
                    style={[styles.input, {width: '30%', marginBottom: 0}]} 
                    placeholder="День" 
                    keyboardType="number-pad" 
                    maxLength={2}
                    value={day}
                    onChangeText={setDay}
                />
                {/* Місяць (1-12) */}
                <TextInput 
                    style={[styles.input, {width: '30%', marginBottom: 0}]} 
                    placeholder="Місяць" 
                    keyboardType="number-pad" 
                    maxLength={2}
                    value={month}
                    onChangeText={setMonth}
                />
                {/* CVV (3 цифри) */}
                <TextInput 
                    style={[styles.input, {width: '30%', marginBottom: 0}]} 
                    placeholder="CVV" 
                    keyboardType="number-pad" 
                    maxLength={3}
                    secureTextEntry 
                    value={cvv}
                    onChangeText={setCvv}
                />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
                <Text style={styles.confirmText}>Придбати</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ebf2f5', padding: 25, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#44b6c1', textAlign: 'center', marginBottom: 10 },
    planName: { fontSize: 22, color: '#4a5568', textAlign: 'center', fontWeight: 'bold' },
    price: { fontSize: 18, color: '#44b6c1', textAlign: 'center', marginBottom: 30 },
    label: { textAlign: 'center', fontSize: 18, marginBottom: 15, color: '#4a5568' },
    payButton: { backgroundColor: '#44b6c1', padding: 12, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
    payText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    or: { textAlign: 'center', marginVertical: 10, color: '#718096' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#44b6c1', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 14 },
    confirmButton: { backgroundColor: '#44b6c1', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    confirmText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});