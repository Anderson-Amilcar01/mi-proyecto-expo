// App.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavLight,
  DarkTheme as NavDark,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Calculator from './src/Calculator';
import GraphScreen from './src/GraphScreen';

type RootTabParamList = {
  Calculator: undefined;
  Graph: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar tema al iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (e) {
        console.warn('Error cargando tema:', e);
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  // 🔹 Guardar tema al cambiar
  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.warn('Error guardando tema:', e);
    }
  };

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const navTheme = isDark ? NavDark : NavLight;

  // 🔹 Pantalla de carga mientras lee AsyncStorage
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#00bcd4" />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          initialRouteName="Calculator"
          screenOptions={{
            headerRight: () => (
              <IconButton
                icon={isDark ? 'white-balance-sunny' : 'weather-night'}
                onPress={toggleTheme}
                accessibilityLabel="Cambiar tema"
              />
            ),
            tabBarStyle: { backgroundColor: isDark ? '#222' : '#fff' },
            tabBarActiveTintColor: isDark ? '#00bcd4' : '#1976d2',
            tabBarInactiveTintColor: isDark ? '#aaa' : '#666',
          }}
        >
          <Tab.Screen
            name="Calculator"
            component={Calculator}
            options={{
              tabBarLabel: 'Calculadora',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="calculator"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Graph"
            component={GraphScreen}
            options={{
              tabBarLabel: 'Gráfica',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="chart-line"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // fondo oscuro del splash
  },
});
