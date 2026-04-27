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
import { validateName, validatePhone, validateDate } from '../validators';

const bookingRepo = new BookingRepository();

export default function BookingScreen({ route, navigation }: any) {
    const { training, existingBooking } = route.params || {};
    const [clientPhone, setClientPhone] = useState(existingBooking?.client_phone || '');
    const [clientName, setClientName] = useState(existingBooking?.client_name || '');
    const [bookingDate, setBookingDate] = useState(
        existingBooking?.booking_date || new Date().toISOString().split('T')[0]
    );

    const handleAction = async () => {
        if (!validateName(clientName)) {
            Alert.alert("Введіть ім'я");
            return;
        }

        if (!validatePhone(clientPhone)) {
            Alert.alert('Номер має містити 9 цифр');
            return;
        }

        if (!validateDate(bookingDate)) {
            Alert.alert('Не коректна дата (РРРР-ММ-ДД)');
            return;
        }

        try {
            if (existingBooking) {
                await bookingRepo.update(existingBooking.id, {
                    client_name: clientName,
                    client_phone: clientPhone,
                    booking_date: bookingDate
                });
                Alert.alert('Дані оновлено!');
            } else {
                await bookingRepo.create({
                    training_id: training.id!,
                    client_name: clientName,
                    client_phone: clientPhone,
                    booking_date: bookingDate,
                });
                Alert.alert('Ви записані!');
            }
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Немає місць');
        }
    };

    const handleNameChange = (text: string) => {
        const cleaned = text.replace(/\d/g, '');
        setClientName(cleaned);
    };

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        setClientPhone(cleaned);
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
                    onChangeText={handleNameChange}
                />
                

            <Text style={styles.label}>Номер телефону:</Text>
                <View style={styles.phoneContainer}>
                    <Text style={styles.phoneCode}>+380</Text>
                    <TextInput
                        style={styles.phoneInput}
                        value={clientPhone}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        maxLength={9}
                    />
                </View>

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
    container: {
        flex: 1, 
        backgroundColor: 'white' 
    },
    card: { 
        margin: 15, 
        padding: 20, 
        borderRadius: 12, 
        alignItems: 'center' 
    },
    trainingName: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    price: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#6d9efc', 
        marginVertical: 5 
    },
    time: { 
        fontSize: 18,
         color: '#666' 
        },
    form: { 
        backgroundColor: '#fff', 
        margin: 15, 
        padding: 20, 
        borderRadius: 12 },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15, 
        textAlign: 'center' },
    label: 
    { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 5 
    },
    input: {
        borderWidth: 1, 
        borderColor: '#ddd', 
        padding: 10, 
        borderRadius: 8, 
        marginBottom: 15 
    },
    bookButton: { 
        backgroundColor: '#6d9efc', 
        padding: 15, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    bookButtonText: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    phoneCode: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        fontWeight: 'bold',
    },
    phoneInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
});