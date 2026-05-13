import { styles } from "../../style/index";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: any;
  loading?: boolean;
  price?: number;
  duration?: number;
}

export default function BoostModal({
  visible,
  onClose,
  onConfirm,
  item,
  loading = false,
  price = 1000,
  duration = 30,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* HEADER */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>⚡ Boost Post</Text>

                <TouchableOpacity
                  style={styles.closeCircle}
                  onPress={onClose}>
                  <Ionicons
                    name="close"
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* BODY */}
              <View style={styles.modalBody}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {item?.title || "Selected Post"}
                </Text>

                <View style={styles.pricingDetails}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>Rs. {price}</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Duration</Text>
                    <Text style={styles.priceValue}>{duration} Days</Text>
                  </View>
                </View>
              </View>

              {/* FOOTER */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnOutline]}
                  onPress={onClose}>
                  <Text style={styles.btnTextOutline}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btn,
                    styles.btnPrimary,
                    loading && { opacity: 0.6 },
                  ]}
                  onPress={onConfirm}
                  disabled={loading}>
                  <Text style={styles.btnTextPrimary}>
                    {loading ? "Processing..." : "Confirm & Pay"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
