import { StyleSheet } from "react-native";

const calculadoraStyles = StyleSheet.create({
  container: { flex: 1, padding: 10, justifyContent: "center" },
  landscapeContainer: { flex: 1, flexDirection: "row", padding: 10 },

  display: {
    height: 80,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  displayText: { fontSize: 32 },

  buttonsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  button: {
    width: "22%",
    marginVertical: 5,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  calculatorSection: { flex: 3 },

  // Historial flotante
  historyWrapper: { position: "absolute", top: 10, right: 10, zIndex: 100 },
  menuButton: { padding: 10, backgroundColor: "#ccc", borderRadius: 5, alignItems: "center" },
  historyMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 220,
    maxHeight: 400,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  historyItem: { flexDirection: "row", alignItems: "center", padding: 5, borderBottomWidth: 0.5, borderColor: "#ccc" },
  historyText: { fontSize: 16 },
  clearButton: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 5 },
});

export default calculadoraStyles;
