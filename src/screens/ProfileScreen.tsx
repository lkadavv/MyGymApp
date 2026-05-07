import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function ProfileScreen({ navigation, route }: any) {

    const { userEmail } = route.params || { userEmail: 'Гість' };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>FitBook</Text>
            <Text style={styles.sectionTitle}>Особистий кабінет</Text>

            <View style={styles.userCard}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={{fontSize: 40}}>👤</Text>
                </View>
                <View>
                    {/* ТУТ ТЕПЕР ДИНАМІЧНИЙ EMAIL */}
                    <Text style={styles.userName}>{userEmail}</Text>
                    <Text style={styles.contactLink}>Контактна інформація</Text>
                </View>
            </View>

            <Text style={styles.paymentTitle}>Оплата картою</Text>

            {/* Кнопка Мої записи */}
            <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => navigation.navigate('MyBookings', { userEmail })}
            >
                <Text style={styles.buttonText}>Мої записи</Text>
                <Text style={styles.arrow}>❯</Text>
            </TouchableOpacity>

            {/* Кнопка Мої абонементи */}
            <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => navigation.navigate('MySubscriptions', { userEmail })}
            >
                <Text style={styles.buttonText}>Мої абонементи</Text>
                <Text style={styles.arrow}>❯</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ebf2f5', padding: 25, paddingTop: 60 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#44b6c1', marginBottom: 20 },
    sectionTitle: { fontSize: 28, fontWeight: 'bold', color: '#4a5568', marginBottom: 30 },
    userCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
    avatarPlaceholder: { width: 70, height: 70, borderRadius: 15, backgroundColor: '#cbd5e0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    userName: { fontSize: 20, fontWeight: 'bold', color: '#4a5568' },
    contactLink: { color: '#44b6c1', fontSize: 14 },
    paymentTitle: { textAlign: 'center', fontSize: 22, color: '#4a5568', fontWeight: '600', marginBottom: 20, marginTop: 20 },
    menuButton: { 
        backgroundColor: '#38b2ac', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 18, 
        borderRadius: 12, 
        marginBottom: 15,
        alignItems: 'center'
    },
    buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
    arrow: { color: 'white', fontSize: 20 }
});