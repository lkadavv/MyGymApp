import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { UserRepository } from '../UserRepository';

const userRepo = new UserRepository();

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');

        // КРОК 1: Шукаємо в базі
        const user = await userRepo.getUserByEmail(email.trim());

        // КРОК 2: ПЕРЕВІРКА НА ІСНУВАННЯ
        if (!user) {
            setErrorMessage('Такої пошти не існує в базі!');
            return; // ЗУПИНКА, далі код не йде
        }

        // КРОК 3: ПЕРЕВІРКА ПАРОЛЯ
        if (user.password === password) {
            // Тільки тут ми пускаємо далі
            navigation.navigate('Home', { isLoggedIn: true });
        } else {
            setErrorMessage('Неправильний пароль!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вхід у FitBook</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="Email" 
                value={email}
                onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
                autoCapitalize="none"
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Пароль" 
                value={password}
                secureTextEntry 
                onChangeText={(text) => { setPassword(text); setErrorMessage(''); }}
            />

            {/* ЧЕРВОНИЙ ТЕКСТ ПОМИЛКИ ЯК ТИ ХОТІВ */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Ще немає акаунту? Реєстрація</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#6d9efc', marginBottom: 40, textAlign: 'center' },
    input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, fontSize: 16, padding: 5 },
    errorText: { color: 'red', marginBottom: 15, fontWeight: 'bold' },
    button: { backgroundColor: '#6d9efc', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkText: { color: '#6d9efc', textAlign: 'center', marginTop: 20 }
});