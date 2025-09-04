import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Calculator from './src/Calculator'; // Renombraremos caluadora.tsx a Calculator.tsx

export default function App() {
  return (
    <PaperProvider>
      <Calculator />
    </PaperProvider>
  );
}

