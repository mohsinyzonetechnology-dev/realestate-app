import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 55,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1c1c1e",
  },

  publishText: {
    color: "#1877F2",
    fontWeight: "700",
    fontSize: 17,
  },

  form: {
    padding: 16,
    paddingBottom: 120,
  },

  // ====================== PHOTO SECTION ======================
  photoSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16.5,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 10,
  },

  imageScroll: {
    flexDirection: "row",
    paddingBottom: 8,
  },

  addPhotoBox: {
    width: 108,
    height: 108,
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#c7c7cc",
  },

  addPhotoText: {
    fontSize: 13.5,
    color: "#8e8e93",
    marginTop: 6,
    fontWeight: "500",
  },

  imageContainer: {
    width: 108,
    height: 108,
    marginRight: 12,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f0f0f0",
  },

  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  // Replace Button
  replaceBtn: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 5,
    borderRadius: 10,
  },

  // Remove Button
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 50,
    padding: 1,
  },

  // ====================== FORM FIELDS ======================
  inputField: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16.5,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },

  selectorField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },

  selectorValue: {
    fontSize: 16.5,
    color: "#8e8e93",
  },

  selectedText: {
    color: "#1c1c1e",
    fontWeight: "500",
  },

  // ====================== MODAL STYLES ======================
  modalContent: {
    padding: 20,
    flex: 1,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "500",
    color: "#1c1c1e",
  },

  resetText: {
    color: "#1877F2",
    fontWeight: "500",
    fontSize: 16,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  iconCircleSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  optionText: {
    fontSize: 16.5,
    fontWeight: "500",
    color: "#1c1c1e",
  },

  // Radio Button
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#c7c7cc",
    justifyContent: "center",
    alignItems: "center",
  },

  radioActive: {
    borderColor: "#1877F2",
  },

  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1877F2",
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
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
