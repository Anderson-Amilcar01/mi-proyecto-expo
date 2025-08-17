// src/ScientificCalculator.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { create, all } from 'mathjs';

const math = create(all);

const ScientificCalculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleButtonPress = (value: string) => {
    setInput(prev => prev + value);
    setError('');
  };

  const calculate = () => {
    try {
      const result = math.evaluate(input);
      const operation = `${input} = ${result}`;
      setHistory(prev => [operation, ...prev].slice(0, 10));
      setInput(result.toString());
      setError('');
    } catch (err) {
      setError('Error en la operación');
    }
  };

  const clearInput = () => {
    setInput('');
    setError('');
  };

  const backspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const handleFunction = (fn: string) => {
    switch (fn) {
      case 'sqrt': setInput(prev => `${prev}sqrt(`); break;
      case 'pow': setInput(prev => `${prev}^2`); break; // cuadrado directo
      case 'exp': setInput(prev => `${prev}^(`); break; // potencia general
      case 'sin': setInput(prev => `${prev}sin(`); break;
      case 'cos': setInput(prev => `${prev}cos(`); break;
      case 'tan': setInput(prev => `${prev}tan(`); break;
      case 'log': setInput(prev => `${prev}log(`); break;
      case 'ln': setInput(prev => `${prev}ln(`); break;
      case 'abs': setInput(prev => `${prev}abs(`); break;
      case 'pi': setInput(prev => `${prev}${math.pi}`); break;
      case 'e': setInput(prev => `${prev}${math.e}`); break;
      case '(': setInput(prev => `${prev}(`); break;
      case ')': setInput(prev => `${prev})`); break;
    }
    setError('');
  };

  const renderButton = (label: string, onPress: () => void, color = '#d3d3d3') => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Introduce la operación"
        keyboardType="default"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.title}>Operaciones básicas</Text>
      <View style={styles.row}>
        {renderButton('7', () => handleButtonPress('7'))}
        {renderButton('8', () => handleButtonPress('8'))}
        {renderButton('9', () => handleButtonPress('9'))}
        {renderButton('+', () => handleButtonPress('+'), '#ff9500')}
      </View>
      <View style={styles.row}>
        {renderButton('4', () => handleButtonPress('4'))}
        {renderButton('5', () => handleButtonPress('5'))}
        {renderButton('6', () => handleButtonPress('6'))}
        {renderButton('-', () => handleButtonPress('-'), '#ff9500')}
      </View>
      <View style={styles.row}>
        {renderButton('1', () => handleButtonPress('1'))}
        {renderButton('2', () => handleButtonPress('2'))}
        {renderButton('3', () => handleButtonPress('3'))}
        {renderButton('*', () => handleButtonPress('*'), '#ff9500')}
      </View>
      <View style={styles.row}>
        {renderButton('0', () => handleButtonPress('0'))}
        {renderButton('.', () => handleButtonPress('.'))}
        {renderButton('C', clearInput, '#ff3b30')}
        {renderButton('/', () => handleButtonPress('/'), '#ff9500')}
      </View>
      <View style={styles.row}>
        {renderButton('⌫', backspace, '#ff3b30')}
      </View>

      <Text style={styles.title}>Funciones científicas</Text>
      <View style={styles.row}>
        {renderButton('√', () => handleFunction('sqrt'), '#5ac8fa')}
        {renderButton('x²', () => handleFunction('pow'), '#5ac8fa')}
        {renderButton('^n', () => handleFunction('exp'), '#5ac8fa')}
        {renderButton('abs', () => handleFunction('abs'), '#5ac8fa')}
      </View>
      <View style={styles.row}>
        {renderButton('sin', () => handleFunction('sin'), '#5ac8fa')}
        {renderButton('cos', () => handleFunction('cos'), '#5ac8fa')}
        {renderButton('tan', () => handleFunction('tan'), '#5ac8fa')}
        {renderButton('ln', () => handleFunction('ln'), '#5ac8fa')}
      </View>
      <View style={styles.row}>
        {renderButton('log', () => handleFunction('log'), '#5ac8fa')}
        {renderButton('π', () => handleFunction('pi'), '#5ac8fa')}
        {renderButton('e', () => handleFunction('e'), '#5ac8fa')}
        {renderButton('(', () => handleFunction('('), '#5ac8fa')}
      </View>
      <View style={styles.row}>
        {renderButton(')', () => handleFunction(')'), '#5ac8fa')}
      </View>

      {renderButton('=', calculate, '#34c759')}

      <Text style={styles.title}>Historial (últimas 10)</Text>
      <ScrollView style={styles.historyContainer}>
        {history.map((item, index) => (
          <Text
            key={index}
            style={styles.historyItem}
            onPress={() => setInput(item.split('=')[0].trim())}
          >
            {item}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    fontSize: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  error: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: '23%',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyContainer: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 5,
  },
});

export default ScientificCalculator;
