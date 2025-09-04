// src/Calculator.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PixelRatio,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Button, IconButton, useTheme, Portal, Modal } from 'react-native-paper';
import { create, all } from 'mathjs';

const { width, height } = Dimensions.get('window');
const math = create(all);

// Escala tamaño según configuración de fuente del dispositivo
const scale = (size: number) => size * PixelRatio.getFontScale();

// Constantes para botones
const BASIC_BUTTONS = [
  ['C', 'DEL', '(', ')'],
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

const SCIENTIFIC_BUTTONS = [
  ['sin(', 'cos(', 'tan(', 'sqrt('],
  ['log(', 'ln(', '^', 'π'],
  ['e', '%'],
];

const OPERATORS = ['+', '-', '×', '÷', '%'];
const SCIENTIFIC_FUNCS = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt(', '^', 'π', 'e'];

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;

  // Maneja la pulsación de botones
  const handlePress = useCallback(
    (value: string) => {
      if (value === '=') {
        if (!expression.trim()) {
          setResult('');
          return;
        }
        try {
          const sanitizedExpression = expression.replace(/÷/g, '/').replace(/×/g, '*');
          const currentResult = math.evaluate(sanitizedExpression);
          const resultStr = currentResult.toString();
          setResult(resultStr);
          setHistory((prev) => [{ expression, result: resultStr }, ...prev].slice(0, 10));
          setExpression(resultStr);
        } catch {
          setResult('Error');
        }
      } else if (value === 'C') {
        setExpression('');
        setResult('');
      } else if (value === 'DEL') {
        setExpression((prev) => prev.slice(0, -1));
      } else {
        const lastChar = expression.slice(-1);
        if (
          OPERATORS.includes(value) &&
          (expression === '' || OPERATORS.includes(lastChar))
        ) {
          return;
        }
        setExpression((prev) => prev + value);
      }
    },
    [expression],
  );

  const handleClearHistory = () => {
    setHistory([]);
    setHistoryVisible(false);
  };

  const mapButtonValue = (val: string) => {
    switch (val) {
      case '÷':
        return '/';
      case '×':
        return '*';
      case 'π':
        return math.pi.toString();
      case 'e':
        return math.e.toString();
      default:
        return val;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Botón de historial */}
      <IconButton
        icon="history"
        iconColor={theme.colors.onSurface}
        size={scale(30)}
        onPress={() => setHistoryVisible(true)}
        style={styles.historyButton}
        accessibilityLabel="Mostrar historial"
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: scale(20) }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Display */}
        <View style={[styles.displayContainer, { backgroundColor: theme.colors.surface }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'flex-end', paddingRight: scale(10) }}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={[styles.expressionText, { color: theme.colors.onSurface }]}
              selectable
              accessibilityLabel="Expresión matemática"
            >
              {expression || '0'}
            </Text>
          </ScrollView>
          <Text
            style={[
              styles.resultText,
              { color: theme.colors.primary },
              isLandscape && { marginRight: scale(40) }, // 👈 mueve resultado a la izquierda en horizontal
            ]}
            accessibilityLabel="Resultado"
          >
            {result}
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          {[...BASIC_BUTTONS, ...SCIENTIFIC_BUTTONS].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((buttonValue) => {
                const isClear = buttonValue === 'C';
                const isEquals = buttonValue === '=';
                const isOperator = OPERATORS.includes(buttonValue);
                const isScientific = SCIENTIFIC_FUNCS.includes(buttonValue);

                return (
                  <Button
                    key={buttonValue}
                    mode="contained"
                    onPress={() => handlePress(mapButtonValue(buttonValue))}
                    style={[
                      styles.button,
                      isClear && styles.clearButton,
                      isEquals && styles.equalsButton,
                      isOperator && styles.operatorButton,
                      isScientific && styles.scientificButton,
                    ]}
                    labelStyle={styles.buttonText}
                    accessibilityLabel={`Botón ${buttonValue}`}
                  >
                    {buttonValue}
                  </Button>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal del historial */}
      <Portal>
        <Modal
          visible={historyVisible}
          onDismiss={() => setHistoryVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Historial</Text>
          <ScrollView>
            {history.length === 0 ? (
              <Text style={styles.noHistoryText}>No hay historial disponible.</Text>
            ) : (
              history.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setExpression(item.expression);
                    setHistoryVisible(false);
                    setResult(item.result);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Historial: ${item.expression} igual a ${item.result}`}
                >
                  <Text style={styles.historyItem}>
                    {item.expression} = {item.result}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          <Button onPress={handleClearHistory} style={styles.clearHistoryButton} mode="outlined">
            Limpiar historial
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  displayContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: scale(20),
    marginBottom: scale(5),
  },
  expressionText: {
    fontSize: scale(width > 400 ? 30 : 24),
    marginBottom: scale(5),
    textAlign: 'right',
  },
  resultText: {
    fontSize: scale(width > 400 ? 48 : 36),
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buttonsContainer: {
    flex: 0.7,
    flexDirection: 'column',
    padding: scale(5),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: scale(5),
  },
  button: {
    flex: 1,
    margin: scale(4),
    justifyContent: 'center',
    alignItems: 'center',
    height: (height * 0.7 - scale(50)) / 6,
    borderRadius: scale(10),
  },
  buttonText: {
    fontSize: scale(width > 400 ? 24 : 18),
  },
  clearButton: {
    backgroundColor: '#d32f2f',
  },
  equalsButton: {
    backgroundColor: '#1976d2',
  },
  operatorButton: {
    backgroundColor: '#388e3c',
  },
  scientificButton: {
    backgroundColor: '#757575',
  },
  historyButton: {
    position: 'absolute',
    top: scale(10),
    left: scale(10),
    zIndex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
  },
  noHistoryText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  clearHistoryButton: {
    marginTop: 10,
  },
});

export default Calculator;
