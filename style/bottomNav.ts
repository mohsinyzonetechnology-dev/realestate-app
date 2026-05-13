import { StyleSheet } from "react-native";

// const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    // Add a very subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  listPadding: {
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12, // Smooth corners
  },
  activeItemContainer: {
    // Optional: add a very light blue background for the whole tab
    // backgroundColor: '#F0F7FF',
  },
  iconWrapper: {
    marginBottom: 4,
    padding: 6,
    borderRadius: 10,
  },
  activeIconWrapper: {
    backgroundColor: "#E5F1FF", // Light blue circle around the active icon
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
  },
  activeText: {
    color: "#006AFF",
    fontWeight: "700",
  },
});
