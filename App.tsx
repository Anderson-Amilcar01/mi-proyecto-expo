// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Calculator from './src/Calculator';
import GraphScreen from './src/GraphScreen';

type RootTabParamList = {
  Calculator: undefined;
  Graph: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Calculator"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#222' },
            tabBarActiveTintColor: '#00bcd4',
            tabBarInactiveTintColor: '#aaa',
          }}
        >
          <Tab.Screen
            name="Calculator"
            component={Calculator}
            options={{
              tabBarLabel: 'Calculadora',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="calculator" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Graph"
            component={GraphScreen}
            options={{
              tabBarLabel: 'Gráfica',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chart-line" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
