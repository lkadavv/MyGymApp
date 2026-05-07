import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { TrainingRepository } from '../TrainingRepository';
import { Training } from '../Training';

const trainingRepo = new TrainingRepository();


export default function HomeScreen({ navigation, route }: any) {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const userEmail = route.params?.userEmail ?? '';

    // Отримуємо статус авторизації з параметрів навігації
    // Якщо route.params?.isLoggedIn існує, беремо його, інакше false
    const isLoggedIn = route.params?.isLoggedIn ?? false;

    const loadTrainings = async () => {
        const data = await trainingRepo.getAll();
        setTrainings(data);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadTrainings);
        loadTrainings();
        return unsubscribe;
    }, [navigation]);

    const handleAuthIconPress = () => {
        if (isLoggedIn) {
            Alert.alert(
                "Вихід",
                "Ви впевнені, що хочете вийти з акаунту?",
                [
                    { text: "Скасувати", style: "cancel" },
                    { 
                        text: "Вийти", 
                        onPress: () => {
                            // Використовуємо replace, щоб повністю вийти з контексту Home
                            navigation.replace('Login'); 
                        } 
                    }
                ]
            );
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>FitBook</Text>
                
                <View style={styles.rightHeaderContainer}>
                    {/* КНИЖКА: показується тільки якщо залогінений */}
                    {isLoggedIn && (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Profile', { userEmail })} // Передаємо в Profile
                            style={styles.iconButton}
                        >
                            <Text style={styles.iconText}>📖</Text>
                        </TouchableOpacity>
                    )}

                    {/* ЕМБЛЕМА КОРИСТУВАЧА / ВИХІД */}
                    <TouchableOpacity 
                        onPress={handleAuthIconPress}
                        style={styles.iconButton}
                    >
                        <Text style={styles.iconText}>
                            {isLoggedIn ? '🚪' : '👤'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* СПИСОК ТРЕНУВАНЬ (завжди видимий) */}
            {trainings.map((training) => (
                <TouchableOpacity
                    key={training.id}
                    style={styles.card}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.trainingName}>{training.name}</Text>
                    </View>
                    
                    <Text style={styles.price}>{training.price} грн</Text>
                    <Text style={styles.time}>{training.time}</Text>
                    <Text style={styles.trainerLabel}>{training.max_capacity} - макс. кількість людей</Text>
                    
                    <View style={styles.trainerContainer}>
                        <Text style={styles.trainerLabel}>тренер</Text>
                        <Text style={styles.trainerName}>{training.trainer_name}</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.bookButton}
                        onPress={() => {
                            if (isLoggedIn) {
                                navigation.navigate('Booking', { training });
                            } else {
                                Alert.alert("Увага", "Спочатку увійдіть в акаунт, щоб записатись");
                                navigation.navigate('Login');
                            }
                        }}
                    >
                        <Text style={styles.bookButtonText}>Записатись</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    rightHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6d9efc',
    },
    iconButton: {
        marginLeft: 15,
        padding: 5,
    },
    iconText: {
        fontSize: 28,
    },
    card: {
        backgroundColor: 'white',
        margin: 15,
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        marginBottom: 10,
    },
    trainingName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6d9efc',
        marginBottom: 5,
    },
    time: {
        fontSize: 18,
        color: '#555',
        marginBottom: 5,
    },
    trainerContainer: {
        marginTop: 10,
        marginBottom: 15,
    },
    trainerLabel: {
        fontSize: 12,
        color: '#999',
    },
    trainerName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    bookButton: {
        backgroundColor: '#6d9efc',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});