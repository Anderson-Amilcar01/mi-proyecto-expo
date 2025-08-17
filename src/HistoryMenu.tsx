import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HistoryMenuProps {
  onSelect: (item: string) => void;
}

export default function HistoryMenu({ onSelect }: HistoryMenuProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  const STORAGE_KEY = "@calculator_history";

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.log("Error loading history", e);
    }
  };

  const saveHistory = async (newHistory: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (e) {
      console.log("Error saving history", e);
    }
  };

  const handleSelect = (item: string) => {
    onSelect(item.split(" = ")[0]); // solo la operación
    setVisible(false);
  };

  const handleDeleteItem = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    saveHistory(newHistory);
  };

  const handleClearAll = () => {
    Alert.alert("Borrar todo", "¿Estás seguro de borrar todo el historial?", [
      { text: "Cancelar" },
      { text: "Borrar", onPress: () => saveHistory([]) },
    ]);
  };

  return (
    <View>
      {/* Botón Hamburguesa */}
      <TouchableOpacity style={styles.menuButton} onPress={() => setVisible(true)}>
        <Text style={{ fontSize: 24 }}>☰</Text>
      </TouchableOpacity>

      {/* Modal del Historial */}
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Historial</Text>

            <FlatList
              data={history}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.itemContainer}>
                  <TouchableOpacity onPress={() => handleSelect(item)} style={{ flex: 1 }}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                    <Text style={styles.deleteText}>❌</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.button} onPress={handleClearAll}>
                <Text style={styles.buttonText}>Borrar Todo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => setVisible(false)}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  itemContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 5, borderBottomWidth: 0.5, borderColor: "#ccc" },
  itemText: { fontSize: 16 },
  deleteText: { fontSize: 18, color: "red", paddingHorizontal: 5 },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: { padding: 10, backgroundColor: "#007bff", borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
