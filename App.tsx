import React from 'react';
import { SafeAreaView } from 'react-native';
import  ScientificCalculator from './src/caluadora'


const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScientificCalculator />
    </SafeAreaView>
  );
};

export default App;
