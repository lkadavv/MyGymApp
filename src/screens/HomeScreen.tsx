import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { TrainingRepository } from '../TrainingRepository';
import { Training } from '../Training';

const trainingRepo = new TrainingRepository();

export default function HomeScreen({ navigation }: any) {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadTrainings = async () => {
        const data = await trainingRepo.getAll();
        setTrainings(data);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadTrainings);
        loadTrainings();
        return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={loadTrainings} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>FitBook</Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('MyBookings')}
                    style={styles.iconButton}
                >
                    <Text style={styles.iconText}>📖</Text>
                </TouchableOpacity>
            </View>

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
                    
                    <View style={styles.trainerContainer}>
                        <Text style={styles.trainerLabel}>тренер</Text>
                        <Text style={styles.trainerName}>{training.trainer_name}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.bookButton}
                    onPress={() => navigation.navigate('Booking', { training })}>

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
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6d9efc',
    },
    iconButton: {
        padding: 10,
    },
    iconText: {
        fontSize: 28,
    },
    card: {
        backgroundColor: 'white',
        margin: 15,
        padding: 20,
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    emoji: {
        fontSize: 32,
        marginRight: 10,
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
        marginBottom: 10,
    },
    time: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    trainerContainer: {
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