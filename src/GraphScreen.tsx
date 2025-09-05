// src/GraphScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Button } from 'react-native-paper';
import { create, all } from 'mathjs';
import { RouteProp, useRoute } from '@react-navigation/native';

const math = create(all);
const screenWidth = Dimensions.get('window').width;

// Tipado de los parámetros que recibe esta pantalla
type RootStackParamList = {
  Graph: { expression: string } | undefined;
};

type GraphScreenRouteProp = RouteProp<RootStackParamList, 'Graph'>;

const GraphScreen: React.FC = () => {
  const route = useRoute<GraphScreenRouteProp>();
  const initialExpression = route.params?.expression ?? 'sin(x)';

  const [expression, setExpression] = useState(initialExpression);
  const [points, setPoints] = useState<number[]>([]);
  const [xLabels, setXLabels] = useState<string[]>([]);

  const generateGraph = () => {
    try {
      const xValues = Array.from({ length: 100 }, (_, i) => -10 + i * 0.2);
      const yValues = xValues.map((x) => {
        try {
          return math.evaluate(expression, { x });
        } catch {
          return 0;
        }
      });

      setPoints(yValues);
      // Mostrar etiquetas en el eje X cada 20 puntos
      setXLabels(xValues.filter((_, i) => i % 20 === 0).map((x) => x.toFixed(1)));
    } catch {
      setPoints([]);
      setXLabels([]);
    }
  };

  // Generar la gráfica automáticamente al entrar
  useEffect(() => {
    generateGraph();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        value={expression}
        onChangeText={setExpression}
        placeholder="Ej: sin(x), x^2, log(x)"
      />
      <Button mode="contained" onPress={generateGraph} style={styles.button}>
        Graficar
      </Button>

      {points.length > 0 && (
        <LineChart
          data={{
            labels: xLabels.length ? xLabels : ['-10', '-5', '0', '5', '10'],
            datasets: [{ data: points }],
          }}
          width={screenWidth - 20}
          height={300}
          chartConfig={{
            backgroundColor: "#1E1E1E",
            backgroundGradientFrom: "#232526",
            backgroundGradientTo: "#414345",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 200, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
            style: { borderRadius: 12 },
          }}
          bezier
          style={styles.chart}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#fff", flexGrow: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: { marginBottom: 15 },
  chart: { borderRadius: 12 },
});

export default GraphScreen;
