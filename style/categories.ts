import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1c1c1e",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 15,
    color: "#8e8e93",
    marginBottom: 30,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  activeDropdown: {
    borderColor: "#1877F2",
    backgroundColor: "#fff",
    // Shadow for active state
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E7F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activeIconCircle: {
    backgroundColor: "#1877F2",
  },
  dropdownTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  activeText: {
    color: "#1877F2",
  },
  dropdownContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: -5, // Connect with header
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  subItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#3a3a3c",
    fontWeight: "500",
  },
});
