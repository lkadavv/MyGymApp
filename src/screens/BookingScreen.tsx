import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import { BookingRepository } from '../BookingRepository';
import { Training } from '../Training';

const bookingRepo = new BookingRepository();

export default function BookingScreen({ route, navigation }: any) {
    const { training, existingBooking } = route.params || {};

    const [clientName, setClientName] = useState(existingBooking?.client_name || '');
    const [clientPhone, setClientPhone] = useState(existingBooking?.client_phone || '');
    const [bookingDate, setBookingDate] = useState(
        existingBooking?.booking_date || new Date().toISOString().split('T')[0]
    );

    const handleAction = async () => {
        if (!clientName || clientName.length < 2) {
            Alert.alert('Помилка', "Введіть ім'я");
            return;
        }

        try {
            if (existingBooking) {
                await bookingRepo.update(existingBooking.id, {
                    client_name: clientName,
                    client_phone: clientPhone,
                    booking_date: bookingDate
                });
                Alert.alert('Успішно', 'Дані оновлено!');
            } else {
                await bookingRepo.create({
                    training_id: training.id!,
                    client_name: clientName,
                    client_phone: clientPhone,
                    booking_date: bookingDate,
                    status: 'active'
                });
                Alert.alert('Успішно', 'Ви записані!');
            }
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Помилка', 'Не вдалося зберегти дані');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {training && (
                <View style={styles.card}>
                    <Text style={styles.trainingName}>{training.name}</Text>
                    <Text style={styles.price}>{training.price} грн</Text>
                    <Text style={styles.time}>{training.time}</Text>
                </View>
            )}

            <View style={styles.form}>
                <Text style={styles.title}>
                    {existingBooking ? 'Редагувати запис' : 'Оформити запис'}
                </Text>

                <Text style={styles.label}>Ваше ім'я:</Text>
                <TextInput
                    style={styles.input}
                    value={clientName}
                    onChangeText={setClientName}
                />

                <Text style={styles.label}>Номер телефону:</Text>
                <TextInput
                    style={styles.input}
                    value={clientPhone}
                    onChangeText={setClientPhone}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Дата тренування:</Text>
                <TextInput
                    style={styles.input}
                    value={bookingDate}
                    onChangeText={setBookingDate}
                />

                <TouchableOpacity style={styles.bookButton} onPress={handleAction}>
                    <Text style={styles.bookButtonText}>
                        {existingBooking ? 'Зберегти зміни' : 'Підтвердити запис'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, alignItems: 'center' },
    trainingName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    price: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', marginVertical: 5 },
    time: { fontSize: 18, color: '#666' },
    form: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 15 },
    bookButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center' },
    bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});