import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#E8F5E9",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  amountText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
  },

  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  balanceText: {
    fontSize: 16,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  payBtn: {
    width: "100%",
    backgroundColor: "#2E7D32",
    paddingVertical: 18,
    borderRadius: 15,
    marginTop: 40,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: "#A5D6A7",
  },
  payBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelBtn: {
    marginTop: 20,
  },
  cancelText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "500",
  },
});
