import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 16,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { fontSize: 28, fontWeight: 500, color: "#1c1c1e" },

  topButtonsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mainBtn: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  mainBtnText: { fontWeight: 500, color: "#1c1c1e", fontSize: 15 },

  feedGrid: { paddingBottom: 100 },
  todayPicksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  picksTitle: { fontSize: 20, fontWeight: 500, color: "#1c1c1e" },

  gridContainer: {
    paddingHorizontal: 16,
  },

  // ====================== FIXED CARD UI ======================
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden", // Images ke corners round karne ke liye
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 4,
  },
  cardImg: {
    width: "100%",
    height: 200,
  },
  cardDetails: {
    padding: 16,
    paddingBottom: 20,
  },
  priceText: {
    fontWeight: "500",
    fontSize: 19,
    color: "#1c1c1e",
    marginBottom: 4,
  },
  titleText: {
    color: "#1c1c1e",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 4,
  },
  locationSubText: {
    fontSize: 13,
    color: "#8e8e93",
    marginTop: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
    color: "#1877F2",
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },

  // ... baqi styles unchanged ...
  activeFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF6FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#D0E5FF",
  },
  filterText: {
    fontSize: 14,
    color: "#151617",
    fontWeight: 500,
  },
  emptyState: {
    width: "100%",
    paddingTop: 80,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 22,
  },
  actionRow: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 5,
    elevation: 3,
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },

  dropdownText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },

  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  dropdownTitle: {
    fontWeight: "600",
  },
  ////////////
  dropdownContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -8, // Buttons ke kareeb lane ke liye
    borderRadius: 16,
    paddingVertical: 8,
    // Shadow for elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 1000, // Takay feed ke upar aaye
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  dropdownSection: {
    paddingHorizontal: 8,
  },
  dropdownHeader2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  dropdownTitle2: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  itemsList: {
    paddingLeft: 20,
    paddingBottom: 8,
  },
  dropdownItem2: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    marginBottom: 4,
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 4,
    marginHorizontal: 15,
  },
  stickyContainer: {
    backgroundColor: "#fff", // 👈 warna transparent ho jata hai
    zIndex: 10,
  },

  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeCircle: {
    padding: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },
  modalBody: {
    padding: 20,
  },
  boostBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  boostTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 2,
  },
  boostDesc: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 16,
  },
  pricingDetails: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 8,
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutline: {
    backgroundColor: "#F3F4F6",
  },
  btnTextOutline: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 14,
  },
  btnPrimary: {
    backgroundColor: "#3B82F6",
  },
  btnTextPrimary: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    // 👇 IMPORTANT for overlay effect
    backgroundColor: "transparent",

    // optional nice UI
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
