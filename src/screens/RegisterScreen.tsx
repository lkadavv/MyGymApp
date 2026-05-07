import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { UserRepository } from '../UserRepository';
const userRepo = new UserRepository();

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1); // 1 - введення даних, 2 - код підтвердження

    const handleRegister = () => {
        
        // Бізнес-правило: 6-20 символів (US-A1)
        if (password.length < 6 || password.length > 20) {
            Alert.alert("Помилка", "Пароль має бути від 6 до 20 символів");
            return;
        }
        setStep(2); // Перехід до кроку 5-6 (підтвердження)
    };

    const confirmCode = async () => {
        try {
            // 1. Спочатку перевіряємо, чи немає такої пошти
            const existingUser = await userRepo.getUserByEmail(email.trim());
            
            if (existingUser) {
                Alert.alert("Помилка", "Користувач з такою поштою вже зареєстрований!");
                return;
            }

            // 2. Якщо все ок — створюємо
            await userRepo.create({ email: email.trim(), password });
            Alert.alert("Успіх", "Акаунт створено!");
            navigation.navigate('Login');
        } catch (e) {
            Alert.alert("Помилка", "Не вдалося зберегти дані в базу");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Реєстрація</Text>
            
            {step === 1 ? (
                <>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Електронна пошта" 
                        onChangeText={setEmail}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Пароль (6-20 символів)" 
                        secureTextEntry 
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Створити акаунт</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.info}>Ми відправили код на {email}</Text>
                    <TextInput style={styles.input} placeholder="Код з пошти" keyboardType="number-pad" />
                    <TouchableOpacity style={styles.button} onPress={confirmCode}>
                        <Text style={styles.buttonText}>Підтвердити</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#6d9efc', marginBottom: 40, textAlign: 'center' },
    input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 25, fontSize: 16, padding: 5 },
    button: { backgroundColor: '#6d9efc', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    info: { textAlign: 'center', marginBottom: 20, color: '#666' }
});