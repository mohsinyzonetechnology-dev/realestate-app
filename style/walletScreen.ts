import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#F5F7FB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backBtn: {
    fontSize: 24,
    marginRight: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: 500,
    marginTop: 8,
    marginBottom: 20,
  },

  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },

  label: {
    color: "gray",
    fontSize: 14,
  },

  balanceText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 90,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  amountBtn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  selectedBtn: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  amountText: {
    fontWeight: "600",
    color: "#333",
  },

  selectedText: {
    color: "#fff",
  },

  addBtn: {
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toast: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "#47c176",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 999,
  },

  toastText: {
    color: "#fff",
    fontSize: 14,
  },
  // Add these properties to your existing StyleSheet object
  formContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
    fontSize: 14,
  },
});
