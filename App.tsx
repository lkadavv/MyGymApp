import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './src/db';
import HomeScreen from './src/screens/HomeScreen';
import BookingScreen from './src/screens/BookingScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import { View, Text, ActivityIndicator } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setIsReady(true))
      .catch(err => console.log('Помилка БД:', err));
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Завантаження</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Вхід', headerLeft: () => null }} // headerLeft: () => null прибере кнопку "назад"
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Реєстрація' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen} 
          options={{ title: 'Запис на тренування' }}
        />
        <Stack.Screen 
          name="MyBookings" 
          component={MyBookingsScreen} 
          options={{ title: 'Мої записи' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}