import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl
} from 'react-native';
import { BookingRepository } from '../BookingRepository';
import { BookingWithTraining } from '../Booking';

const bookingRepo = new BookingRepository();

export default function MyBookingsScreen({ navigation }: any) {
    const [bookings, setBookings] = useState<BookingWithTraining[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadBookings = async () => {
        const data = await bookingRepo.getAll();
        setBookings(data);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadBookings);
        return unsubscribe;
    }, [navigation]);

    const handleCancel = (id: number, trainingName: string) => {
        Alert.alert(
            'Бажаєте скасувати запис?',
            'Безкоштовне скасування можливе за 24 години.',
            [
                { text: 'Ні', style: 'cancel' },
                {
                    text: 'Так, скасувати',
                    onPress: async () => {
                        await bookingRepo.cancelBooking(id);
                        loadBookings();
                        Alert.alert('Успішно', `Запис на ${trainingName} скасовано`);
                    }
                }
            ]
        );
    };

    const handleEdit = (booking: any) => {
        navigation.navigate('Booking', { existingBooking: booking });
    };
    

    const handleDelete = (id: number, trainingName: string) => {
        Alert.alert(
            'Видалити запис?',
            `Запис на ${trainingName} буде видалено назавжди.`,
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Видалити',
                    style: 'destructive',
                    onPress: async () => {
                        await bookingRepo.delete(id);
                        loadBookings();
                        Alert.alert('Успішно', 'Запис видалено');
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: BookingWithTraining }) => (
        <View style={styles.card}>
            <Text style={styles.trainingName}>{item.training_name}</Text>
            <Text style={styles.date}>
                {item.booking_date}, {item.time} </Text>
            <Text style={styles.price}>{item.price} грн</Text>
            <Text style={styles.trainer}>{item.trainer_name} тренер</Text>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.editButton]}
                    onPress={() => handleEdit(item)}
                >
                    <Text style={styles.buttonText}>Редагувати</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => handleCancel(item.id!, item.training_name || '')}
                >
                    <Text style={styles.buttonText}>Скасувати</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(item.id!, item.training_name || '')}
                >
                    <Text style={styles.buttonText}>Видалити</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id!.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadBookings} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Немає активних записів</Text>
                        <TouchableOpacity 
                            style={styles.bookButton}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.bookButtonText}>Записатись на тренування</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    trainingName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
    },
    trainer: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#2196F3',
    },
    cancelButton: {
        backgroundColor: '#FF9800',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    bookButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});